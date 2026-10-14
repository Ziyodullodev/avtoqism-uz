import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partId, authorName, carModel, rating, comment } = body;

    if (!partId || !authorName || !comment || !rating) {
      return NextResponse.json(
        { success: false, error: 'Barcha maydonlarni to‘ldiring' },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        partId,
        authorName,
        carModel: carModel || 'Avtomobil egasi',
        rating: Math.min(5, Math.max(1, parseInt(rating))),
        comment,
      },
    });

    // Recalculate average rating for the part
    const allReviews = await prisma.review.findMany({
      where: { partId },
      select: { rating: true },
    });

    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.part.update({
      where: { id: partId },
      data: {
        rating: Number(avgRating.toFixed(1)),
        reviewCount: allReviews.length,
      },
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error: any) {
    console.error('Error adding review:', error);
    return NextResponse.json(
      { success: false, error: 'Sharh qoldirishda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}
