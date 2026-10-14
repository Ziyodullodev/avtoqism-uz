import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const make = searchParams.get('make');
    const model = searchParams.get('model');

    const where: any = {};
    if (make) where.make = make;
    if (model) where.model = model;

    const vehicles = await prisma.vehicle.findMany({
      where,
      orderBy: [{ make: 'asc' }, { model: 'asc' }, { yearFrom: 'desc' }],
    });

    // Also get distinct list of makes and models for quick selector filters
    const allVehicles = await prisma.vehicle.findMany({
      select: { make: true, model: true },
      distinct: ['make', 'model'],
    });

    const makes = Array.from(new Set(allVehicles.map((v) => v.make)));

    return NextResponse.json({
      success: true,
      data: vehicles,
      makes,
    });
  } catch (error: any) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { success: false, error: 'Avtomobillarni yuklashda xatolik' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newVehicle = await prisma.vehicle.create({
      data: {
        make: body.make,
        model: body.model,
        generation: body.generation || null,
        yearFrom: parseInt(body.yearFrom),
        yearTo: body.yearTo ? parseInt(body.yearTo) : null,
        engine: body.engine || '',
        fuelType: body.fuelType || 'Benzin',
        transmission: body.transmission || 'Mexanika',
        bodyType: body.bodyType || 'Sedan',
        imageUrl: body.imageUrl || null,
        vinPattern: body.vinPattern || null,
      },
    });

    return NextResponse.json({ success: true, data: newVehicle }, { status: 201 });
  } catch (error: any) {
    console.error('Error adding vehicle:', error);
    return NextResponse.json(
      { success: false, error: 'Avtomobil qo‘shishda xatolik: ' + error.message },
      { status: 500 }
    );
  }
}
