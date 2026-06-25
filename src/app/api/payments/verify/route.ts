import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

    if (!razorpayOrderId) {
      return NextResponse.json({ error: 'Missing order details for verification.' }, { status: 400 });
    }

    const isMock = razorpayOrderId.startsWith('order_mock_');

    if (isMock) {
      // Verify mock signature
      if (razorpaySignature === 'mock_signature') {
        // Update Order in database
        await prisma.order.update({
          where: { razorpayOrderId },
          data: {
            paymentStatus: 'COMPLETED',
            status: 'PREPARING',
            razorpayPaymentId: razorpayPaymentId || 'pay_mock_' + Math.random().toString(36).substring(2, 11),
            razorpaySignature,
          },
        });

        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ error: 'Invalid sandbox signature verification failed.' }, { status: 400 });
      }
    } else {
      // Verify real Razorpay signature
      const secret = process.env.RAZORPAY_KEY_SECRET || '';
      
      if (!razorpayPaymentId || !razorpaySignature) {
        return NextResponse.json({ error: 'Missing transaction details for verification.' }, { status: 400 });
      }

      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(razorpayOrderId + '|' + razorpayPaymentId)
        .digest('hex');

      if (generatedSignature === razorpaySignature) {
        // Signature verified successfully
        await prisma.order.update({
          where: { razorpayOrderId },
          data: {
            paymentStatus: 'COMPLETED',
            status: 'PREPARING',
            razorpayPaymentId,
            razorpaySignature,
          },
        });

        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ error: 'Payment signature verification mismatch.' }, { status: 400 });
      }
    }
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
