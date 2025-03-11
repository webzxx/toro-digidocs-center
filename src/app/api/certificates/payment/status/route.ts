import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import getSession from '@/lib/getSession';
import paymaya from '@api/paymaya';
import { PaymentStatus } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const certificateId = url.searchParams.get('certificateId');
    const transactionId = url.searchParams.get('transactionId');
    
    if (!certificateId || !transactionId) {
      return NextResponse.json(
        { error: 'Certificate ID and transaction ID are required' },
        { status: 400 }
      );
    }

    // Check if payment exists in database
    const payment = await db.payment.findFirst({
      where: {
        certificateRequestId: parseInt(certificateId),
        transactionReference: transactionId,
      }
    });

    if (!payment) {
      // If no payment record exists, return no payment found
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    const checkoutId = payment.metadata ? (payment.metadata as any).checkoutId : null;

    paymaya.auth('sk-X8qolYjy62kIzEbr0QRK1h4b4KDVHaNcwMYk39jInSl');
    paymaya.server('https://pg-sandbox.paymaya.com');
    const { data } = await paymaya.getPaymentViaPaymentId({
      paymentId: checkoutId
    });
    
    // Check if payment status needs to be updated
    const paymayaStatus = mapPayMayaStatusToInternal(data.status);
    if (payment.paymentStatus !== paymayaStatus) {
      // Update payment status in database
      await db.payment.update({
        where: { id: payment.id },
        data: { 
          paymentStatus: paymayaStatus,
          // If payment is successful, set the payment date
          ...(paymayaStatus === 'SUCCEEDED' && { paymentDate: new Date() }),
          // If payment is active, check if its still in PENDING, otherwise set to false
          ...(payment.isActive && { isActive: paymayaStatus === "PENDING" })
        }
      });
      
      // If payment is successful, also update certificate status
      if (paymayaStatus === 'SUCCEEDED') {
        await db.certificateRequest.update({
          where: { id: parseInt(certificateId) },
          data: { status: 'PROCESSING' }
        });
      }
    }
      
    return NextResponse.json({
      status: paymayaStatus
    });
  } catch (error) {
    console.error('Payment status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
}

// Map PayMaya status to our internal status
function mapPayMayaStatusToInternal(paymayaStatus: string) : PaymentStatus {
  switch (paymayaStatus) {
    case 'PAYMENT_SUCCESS':
      return PaymentStatus.SUCCEEDED;
    case 'PAYMENT_FAILED':
      return PaymentStatus.REJECTED;
    case 'PAYMENT_EXPIRED':
      return PaymentStatus.EXPIRED;
    case 'PAYMENT_CANCELLED':
      return PaymentStatus.CANCELLED;
    case 'REFUNDED':
      return PaymentStatus.REFUNDED
    case 'VOIDED':
      return PaymentStatus.VOIDED;
    default:
      return PaymentStatus.PENDING;
  }
}