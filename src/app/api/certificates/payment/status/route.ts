import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import getSession from '@/lib/getSession';
import { getPayMayaStatus } from '@/lib/paymaya-utils';

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

    // Get payment status from PayMaya
    const paymayaStatus = await getPayMayaStatus(checkoutId);
    
    // Check if payment status needs to be updated
    if (payment.paymentStatus !== paymayaStatus) {
      console.log(`Updating payment status from ${payment.paymentStatus} to ${paymayaStatus}`);
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
    console.log('Payment status:', paymayaStatus);
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