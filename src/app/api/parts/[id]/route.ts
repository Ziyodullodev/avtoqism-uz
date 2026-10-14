import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check by ID or Slug
    const part = await prisma.part.findFirst({
      where: {
        OR: [{ id: id }, { slug: id }],
      },
      include: {
        category: true,
        compatibility: {
          include: {
            vehicle: true,
          },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!part) {
      return NextResponse.json(
        { success: false, error: 'Ehtiyot qism topilmadi' },
        { status: 404 }
      );
    }

    // Also fetch alternative / cross-code parts from same category if applicable
    let crossAlternatives: any[] = [];
    if (part.crossCodes) {
      const codeList = part.crossCodes.split(',').map((c) => c.trim()).filter(Boolean);
      if (codeList.length > 0) {
        crossAlternatives = await prisma.part.findMany({
          where: {
            id: { not: part.id },
            categoryId: part.categoryId,
            OR: codeList.map((code) => ({
              crossCodes: { contains: code },
            })),
          },
          take: 4,
        });
      }
    }

    // Similar category parts
    const relatedParts = await prisma.part.findMany({
      where: {
        id: { not: part.id },
        categoryId: part.categoryId,
      },
      take: 4,
    });

    return NextResponse.json({
      success: true,
      data: part,
      crossAlternatives,
      relatedParts,
    });
  } catch (error: any) {
    console.error('Error fetching single part:', error);
    return NextResponse.json(
      { success: false, error: 'Ma\'lumotni yuklashda xatolik' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const updated = await prisma.part.update({
      where: { id },
      data: {
        name: body.name,
        oemNumber: body.oemNumber,
        brand: body.brand,
        country: body.country,
        isOriginal: body.isOriginal,
        price: body.price ? parseInt(body.price) : undefined,
        oldPrice: body.oldPrice ? parseInt(body.oldPrice) : null,
        stock: body.stock !== undefined ? parseInt(body.stock) : undefined,
        unit: body.unit,
        warranty: body.warranty,
        description: body.description,
        specifications: typeof body.specifications === 'string' ? body.specifications : JSON.stringify(body.specifications || {}),
        images: typeof body.images === 'string' ? body.images : JSON.stringify(body.images || []),
        badge: body.badge,
        crossCodes: body.crossCodes,
        categoryId: body.categoryId,
      },
    });

    // Update vehicle compatibilities if passed
    if (body.vehicleIds && Array.isArray(body.vehicleIds)) {
      await prisma.partCompatibility.deleteMany({
        where: { partId: id },
      });

      for (const vId of body.vehicleIds) {
        await prisma.partCompatibility.create({
          data: {
            partId: id,
            vehicleId: vId,
          },
        });
      }
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating part:', error);
    return NextResponse.json(
      { success: false, error: 'Tahrirlashda xatolik: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.part.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: 'O‘chirildi' });
  } catch (error: any) {
    console.error('Error deleting part:', error);
    return NextResponse.json(
      { success: false, error: 'O‘chirishda xatolik: ' + error.message },
      { status: 500 }
    );
  }
}
