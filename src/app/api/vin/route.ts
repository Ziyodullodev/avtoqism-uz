import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decodeVin } from '@/lib/vin-decoder';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawVin = body.vin;

    if (!rawVin) {
      return NextResponse.json(
        { success: false, error: 'VIN kod kiritilmadi' },
        { status: 400 }
      );
    }

    const decoded = decodeVin(rawVin);

    if (!decoded.isValid) {
      return NextResponse.json({
        success: false,
        error: decoded.error || 'Noto‘g‘ri VIN kod formati',
        decoded,
      });
    }

    // Try finding exact or partial vehicle match in DB
    let matchedVehicle = null;
    if (decoded.matchedVehiclePattern) {
      matchedVehicle = await prisma.vehicle.findFirst({
        where: {
          vinPattern: { contains: decoded.matchedVehiclePattern, mode: 'insensitive' },
        } as any,
      });
    }

    if (!matchedVehicle) {
      matchedVehicle = await prisma.vehicle.findFirst({
        where: {
          make: { equals: decoded.suggestedMake, mode: 'insensitive' },
          model: { contains: decoded.suggestedModel, mode: 'insensitive' },
        } as any,
      });
    }

    // If still not found, search by make only
    if (!matchedVehicle) {
      matchedVehicle = await prisma.vehicle.findFirst({
        where: {
          make: { equals: decoded.suggestedMake, mode: 'insensitive' },
        } as any,
      });
    }

    // Find compatible parts for this vehicle
    let compatibleParts: any[] = [];
    if (matchedVehicle) {
      compatibleParts = await prisma.part.findMany({
        where: {
          compatibility: {
            some: {
              vehicleId: matchedVehicle.id,
            },
          },
        },
        include: {
          category: true,
        },
        take: 12,
      });
    }

    return NextResponse.json({
      success: true,
      decoded,
      matchedVehicle,
      compatibleParts,
    });
  } catch (error: any) {
    console.error('VIN decode error:', error);
    return NextResponse.json(
      { success: false, error: 'VIN kodni tahlil qilishda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}
