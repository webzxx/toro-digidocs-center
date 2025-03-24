import { db } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { PaymentReceipt } from '@/components/payment/PaymentReceipt';
import { PaymentActions } from '@/components/payment/PaymentActions';
import { PaymentDetails } from '@/components/payment/PaymentDetails';
import Image from 'next/image';
import { withAuth, WithAuthProps } from '@/lib/auth/withAuth';
import { getPayMayaStatus } from '@/lib/utils/paymaya';

async function PaymentStatusPage({
  params,
  searchParams,
  user
}: {
  params: { status: string };
  searchParams: { id: string };
} & WithAuthProps) {
  const { status: urlStatus } = params;
  const transactionId = searchParams.id;

  if (!transactionId) {
    notFound();
  }

  if (!['success', 'failure', 'cancel'].includes(urlStatus)) {
    notFound();
  }

  // Fetch payment data for valid statuses
  const payment = await db.payment.findFirst({
    where: {
      transactionReference: transactionId,
    },
    include: {
      certificateRequest: {
        include: {
          resident: true,
        }
      }
    }
  });

  if (!payment) {
    notFound();
  }

  // Ensure user can only see their own payments unless they are an admin
  const isAdmin = user.role === 'ADMIN';
  const isOwner = payment.certificateRequest.resident.userId === Number(user.id);

  if (!isAdmin && !isOwner) {
    // User is attempting to view someone else's payment
    redirect('/dashboard');
  }

  // For pending payments, verify with PayMaya first
  let actualPaymentStatus = payment.paymentStatus;
  let actualUrlStatus = urlStatus;
  
  if (payment.paymentStatus === 'PENDING') {
    const checkoutId = payment.metadata ? (payment.metadata as any).checkoutId : null;
    
    if (checkoutId) {
      // Get actual status from PayMaya
      const paymayaStatus = await getPayMayaStatus(checkoutId);
      console.log(`PayMaya status for transaction ${transactionId}: ${paymayaStatus}`);
      
      // Update payment in database if status (which we got from PayMaya)
      // is different from what we have in the database which is currently PENDING (line 62)
      if (paymayaStatus !== payment.paymentStatus) {
        console.log(`Updating payment status from ${payment.paymentStatus} to ${paymayaStatus}`);
        
        await db.payment.update({
          where: { id: payment.id },
          data: { 
            paymentStatus: paymayaStatus,
            ...(paymayaStatus === 'SUCCEEDED' && { paymentDate: new Date() }),
            isActive: false // Since we're already checked the status is in PENDING (line 62), we can safely set this to false
          }
        });

        // If payment is successful, also update certificate status
        if (paymayaStatus === 'SUCCEEDED') {
          await db.certificateRequest.update({
            where: { id: payment.certificateRequestId },
            data: { status: 'PROCESSING' }
          });
        }
        
        actualPaymentStatus = paymayaStatus;
      }
    }
  }

  // Map PaymentStatus to URL status
  switch (actualPaymentStatus) {
    case 'SUCCEEDED':
      actualUrlStatus = 'success';
      break;
    case 'REJECTED':
      actualUrlStatus = 'failure';
      break;
    case 'CANCELLED':
      actualUrlStatus = 'cancel';
      break;
    case 'EXPIRED':
      actualUrlStatus = 'failure';
      break;
    case 'REFUNDED':
    case 'VOIDED':
      actualUrlStatus = 'cancel';
      break;
  }

  // If URL status doesn't match actual status, redirect to correct URL
  if (actualUrlStatus !== urlStatus) {
    redirect(`/payment/${actualUrlStatus}?id=${transactionId}`);
  }

  return (
    <div className="min-h-[40rem] bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {actualUrlStatus === 'success' ? (
          <PaymentReceipt payment={{...payment, paymentStatus: actualPaymentStatus}} />
        ) : actualUrlStatus === 'failure' ? (
          <Card className="p-8">
            <div className="flex flex-col items-center space-y-4 mb-6 text-center">
              <div className="relative w-20 h-20 mb-4">
                <Image
                  src="/payment/payment-failed.svg"
                  alt="Payment Failed"
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-2xl font-bold text-red-600">Payment Failed</h2>
              <p className="text-gray-600">
                We were unable to process your payment. Please try again or contact support if the problem persists.
              </p>
            </div>
            
            <div className="border rounded-lg p-6 bg-white mb-6">
              <PaymentDetails payment={{...payment, paymentStatus: actualPaymentStatus}} />
            </div>
            
            <div className="flex justify-center">
              <PaymentActions variant="failure" />
            </div>
          </Card>
        ) : (
          <Card className="p-8">
            <div className="flex flex-col items-center space-y-4 mb-6 text-center">
              <div className="relative w-20 h-20 mb-4">
                <Image
                  src="/payment/payment-cancelled.svg"
                  alt="Payment Cancelled"
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-2xl font-bold text-amber-600">Payment Cancelled</h2>
              <p className="text-gray-600">
                Your payment has been cancelled. No charges were made to your account.
              </p>
            </div>
            
            <div className="border rounded-lg p-6 bg-white mb-6">
              <PaymentDetails payment={{...payment, paymentStatus: actualPaymentStatus}} />
            </div>
            
            <div className="flex justify-center">
              <PaymentActions variant="cancel" />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default withAuth(PaymentStatusPage);
