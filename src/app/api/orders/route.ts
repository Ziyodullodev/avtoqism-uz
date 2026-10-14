import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status) where.status = status;

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            part: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Buyurtmalarni yuklashda xatolik' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      region,
      cityAddress,
      deliveryMethod,
      deliveryCost = 0,
      paymentMethod,
      notes,
      items,
    } = body;

    if (!customerName || !customerPhone || !cityAddress || !items || !items.length) {
      return NextResponse.json(
        { success: false, error: 'Barcha talab qilingan maydonlarni to‘ldiring' },
        { status: 400 }
      );
    }

    // Calculate subtotal
    let subtotal = 0;
    for (const item of items) {
      subtotal += item.price * item.quantity;
    }
    const totalAmount = subtotal + Number(deliveryCost);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `AQ-${new Date().getFullYear()}-${randomSuffix}`;
    const trackingCode = `AQ-TRK-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create Order with Items
    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        region: region || 'Toshkent shahri',
        cityAddress,
        deliveryMethod: deliveryMethod || 'courier_fast',
        deliveryCost: Number(deliveryCost),
        paymentMethod: paymentMethod || 'click',
        paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
        status: 'new',
        totalAmount,
        notes: notes || null,
        trackingCode,
        items: {
          create: items.map((item: any) => ({
            partId: item.partId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            part: true,
          },
        },
      },
    });

    // Decrement stock for purchased parts
    for (const item of items) {
      await prisma.part.update({
        where: { id: item.partId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Buyurtmani rasmiylashtirishda xatolik: ' + error.message },
      { status: 500 }
    );
  }
}
