import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() || '';
    const category = searchParams.get('category') || '';
    const vehicleId = searchParams.get('vehicleId') || '';
    const brand = searchParams.get('brand') || '';
    const isOriginal = searchParams.get('isOriginal');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');
    const sort = searchParams.get('sort') || 'popular';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const where: any = {};

    // Keyword search (Name, OEM number, Brand, CrossCodes)
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { oemNumber: { contains: q, mode: 'insensitive' } },
        { brand: { contains: q, mode: 'insensitive' } },
        { crossCodes: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    // Category filter
    if (category) {
      where.category = {
        slug: category,
      };
    }

    // Vehicle compatibility filter
    if (vehicleId) {
      where.compatibility = {
        some: {
          vehicleId: vehicleId,
        },
      };
    }

    // Brand filter
    if (brand) {
      where.brand = {
        equals: brand,
      };
    }

    // Original / Aftermarket
    if (isOriginal !== null && isOriginal !== undefined && isOriginal !== '') {
      where.isOriginal = isOriginal === 'true';
    }

    // In stock
    if (inStock === 'true') {
      where.stock = {
        gt: 0,
      };
    }

    // Price range
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseInt(minPrice);
      if (maxPrice) where.price.lte = parseInt(maxPrice);
    }

    // Sorting
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'rating') {
      orderBy = { rating: 'desc' };
    } else if (sort === 'popular') {
      orderBy = [{ reviewCount: 'desc' }, { rating: 'desc' }];
    } else if (sort === 'newest') {
      orderBy = { createdAt: 'desc' };
    }

    const parts = await prisma.part.findMany({
      where,
      include: {
        category: true,
        compatibility: {
          include: {
            vehicle: true,
          },
        },
        reviews: {
          take: 3,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy,
      take: limit,
    });

    return NextResponse.json({ success: true, count: parts.length, data: parts });
  } catch (error: any) {
    console.error('Error fetching parts:', error);
    return NextResponse.json(
      { success: false, error: 'Ehtiyot qismlarini yuklashda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      oemNumber,
      brand,
      country,
      isOriginal,
      price,
      oldPrice,
      stock,
      unit,
      warranty,
      description,
      specifications,
      images,
      badge,
      crossCodes,
      categoryId,
      vehicleIds,
    } = body;

    if (!name || !oemNumber || !brand || !price || !categoryId) {
      return NextResponse.json(
        { success: false, error: 'Zarur maydonlar to‘ldirilmagan' },
        { status: 400 }
      );
    }

    const generatedSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
        '-' +
        Date.now();

    const newPart = await prisma.part.create({
      data: {
        name,
        slug: generatedSlug,
        oemNumber,
        brand,
        country: country || 'O‘zbekiston',
        isOriginal: isOriginal ?? true,
        price: parseInt(price),
        oldPrice: oldPrice ? parseInt(oldPrice) : null,
        stock: stock ? parseInt(stock) : 10,
        unit: unit || 'dona',
        warranty: warranty || '12 oy',
        description: description || '',
        specifications: typeof specifications === 'string' ? specifications : JSON.stringify(specifications || {}),
        images: typeof images === 'string' ? images : JSON.stringify(images || []),
        badge: badge || null,
        crossCodes: crossCodes || null,
        categoryId,
      },
    });

    // Add compatibility if provided
    if (vehicleIds && Array.isArray(vehicleIds) && vehicleIds.length > 0) {
      for (const vId of vehicleIds) {
        await prisma.partCompatibility.create({
          data: {
            partId: newPart.id,
            vehicleId: vId,
          },
        });
      }
    }

    return NextResponse.json({ success: true, data: newPart }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating part:', error);
    return NextResponse.json(
      { success: false, error: 'Yangi qismni saqlashda xatolik: ' + error.message },
      { status: 500 }
    );
  }
}
