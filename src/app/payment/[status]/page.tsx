import { db } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { PaymentReceipt } from '@/components/payment/PaymentReceipt';
import { PaymentActions } from '@/components/payment/PaymentActions';
import { PaymentDetails } from '@/components/payment/PaymentDetails';
import Image from 'next/image';
import { withAuth, WithAuthProps } from '@/lib/withAuth';

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

  // Determine actual payment status
  let actualStatus: string;
  switch (payment.paymentStatus) {
    case 'SUCCEEDED':
      actualStatus = 'success';
      break;
    case 'REJECTED':
      actualStatus = 'failure';
      break;
    case 'CANCELLED':
      actualStatus = 'cancel';
      break;
    case 'PENDING':
      // For pending payments, allow URL parameter to determine flow
      actualStatus = urlStatus;
      break;
    default:
      actualStatus = 'failure'; // Default fallback
  }

  // If URL status doesn't match actual status for non-pending payments, redirect to correct URL
  if (payment.paymentStatus !== 'PENDING' && urlStatus !== actualStatus) {
    redirect(`/payment/${actualStatus}?id=${transactionId}`);
  }

  // Update payment status if it's a successful payment and still pending
  if (urlStatus === 'success' && payment.paymentStatus === 'PENDING') {
    await db.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        paymentStatus: 'SUCCEEDED',
        paymentDate: new Date(),
      },
    });

    // Also update certificate status
    await db.certificateRequest.update({
      where: {
        id: payment.certificateRequestId,
      },
      data: {
        status: 'PROCESSING',
      },
    });
    
    // Set actual status to success now that we've updated it
    actualStatus = 'success';
  } else if ((urlStatus === 'failure' || urlStatus === 'cancel') && payment.paymentStatus === 'PENDING') {
    // Mark payment as failed or cancelled
    await db.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        paymentStatus: urlStatus === 'failure' ? 'REJECTED' : 'CANCELLED',
        isActive: false,
      },
    });
    
    // Set actual status to the updated value
    actualStatus = urlStatus;
  }

  return (
    <div className="min-h-[40rem] bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {actualStatus === 'success' ? (
          <PaymentReceipt payment={payment} />
        ) : actualStatus === 'failure' ? (
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
              <PaymentDetails payment={payment} />
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
              <PaymentDetails payment={payment} />
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
