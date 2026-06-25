import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { razorpay } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { items, restaurantId, deliveryAddress } = body;

    if (!items || !Array.isArray(items) || items.length === 0 || !restaurantId || !deliveryAddress) {
      return NextResponse.json({ error: 'Missing required checkout parameters.' }, { status: 400 });
    }

    // 1. Fetch menu items from database to verify prices securely
    const menuItemIds = items.map((i) => i.menuItemId);
    const dbMenuItems = await prisma.menuItem.findMany({
      where: {
        id: { in: menuItemIds },
      },
    });

    const dbItemsMap = new Map(dbMenuItems.map((item) => [item.id, item]));

    // 2. Calculate totals
    let subtotal = 0;
    const validatedOrderItems = [];

    for (const item of items) {
      const dbItem = dbItemsMap.get(item.menuItemId);
      if (!dbItem) {
        return NextResponse.json({ error: `Menu item ${item.menuItemId} not found.` }, { status: 400 });
      }
      subtotal += dbItem.price * item.quantity;
      validatedOrderItems.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: dbItem.price,
      });
    }

    const deliveryFee = 3.99;
    const tax = subtotal * 0.05; // 5% tax
    const totalAmount = parseFloat((subtotal + deliveryFee + tax).toFixed(2));

    // 3. Determine if using real Razorpay or Mock sandbox environment
    const keyId = process.env.RAZORPAY_KEY_ID || '';
    const isMock =
      !keyId ||
      keyId === '' ||
      keyId.includes('placeholder') ||
      keyId.includes('yourkeyhere');

    if (isMock) {
      // Mock flow
      const mockOrderId = 'order_mock_' + Math.random().toString(36).substring(2, 11);

      // Create PENDING database record
      await prisma.order.create({
        data: {
          userId: session.user.id,
          restaurantId,
          totalAmount,
          status: 'PENDING',
          deliveryAddress,
          paymentStatus: 'PENDING',
          razorpayOrderId: mockOrderId,
          orderItems: {
            create: validatedOrderItems,
          },
        },
      });

      return NextResponse.json({
        isMock: true,
        orderId: mockOrderId,
        amount: totalAmount,
        currency: 'USD',
      });
    } else {
      // Real Razorpay flow
      // Razorpay uses currency subunits (e.g. cents for USD, paise for INR). We will multiply by 100.
      const rzpOrder = await razorpay.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: 'INR', // Razorpay works best with INR on basic Indian credentials
        receipt: 'rcpt_' + Math.random().toString(36).substring(2, 11),
      });

      // Create PENDING database record
      await prisma.order.create({
        data: {
          userId: session.user.id,
          restaurantId,
          totalAmount,
          status: 'PENDING',
          deliveryAddress,
          paymentStatus: 'PENDING',
          razorpayOrderId: rzpOrder.id,
          orderItems: {
            create: validatedOrderItems,
          },
        },
      });

      return NextResponse.json({
        isMock: false,
        orderId: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        key: keyId,
        user: {
          name: session.user.name,
          email: session.user.email,
        },
      });
    }
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
