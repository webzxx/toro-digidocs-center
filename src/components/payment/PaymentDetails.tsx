import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { getPaymentStatusBadge } from "../utils";

interface PaymentDetailsProps {
  payment: any;
  showAmounts?: boolean;
  showHeader?: boolean;
  showStatus?: boolean;
  showPaymentMethod?: boolean;
}

export function PaymentDetails({ 
  payment, 
  showAmounts = false, 
  showHeader = false, 
  showStatus = false,
  showPaymentMethod = false,
}: PaymentDetailsProps) {
  const resident = payment.certificateRequest.resident;
  const metadata = payment.metadata as any;
  const paidDate = payment.paymentDate || new Date();

  // Calculate amounts
  const baseAmount = payment.amount - (metadata?.shippingFee || 0);
  const shippingFee = metadata?.shippingFee || 0;
  
  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex flex-col items-start pt-2 sm:flex-row sm:items-center sm:justify-between sm:pt-0">
          <div>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(paidDate), { addSuffix: true })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Paid via</span>
            <div className="relative h-8 w-16">
              <Image 
                src="/payment/maya-logo.png"
                alt="Maya" 
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
      
      <div>
        <h3 className="mb-1 text-sm font-medium text-gray-500">Transaction Reference</h3>
        <p className="font-mono text-base">{payment.transactionReference}</p>
      </div>
      
      <div>
        <h3 className="mb-1 text-sm font-medium text-gray-500">Certificate</h3>
        <p className="text-base font-medium">
          {payment.certificateRequest.certificateType.replaceAll("_", " ")} Certificate
        </p>
        <p className="text-sm text-gray-600">
          Reference: {payment.certificateRequest.referenceNumber}
        </p>
      </div>
      
      <div>
        <h3 className="mb-1 text-sm font-medium text-gray-500">Recipient</h3>
        <p className="text-base">{resident.firstName} {resident.lastName}</p>
      </div>
      
      {showPaymentMethod && (
        <div>
          <h3 className="mb-1 text-sm font-medium text-gray-500">Payment Method</h3>
          <p className="text-base">{payment.paymentMethod.replaceAll("_", " ")}</p>
        </div>
      )}
      
      {showAmounts && (
        <>
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Certificate Fee</span>
              <span>{formatCurrency(baseAmount)}</span>
            </div>
            
            {shippingFee > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping Fee</span>
                <span>{formatCurrency(shippingFee)}</span>
              </div>
            )}
            
            <Separator className="my-2" />
            
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatCurrency(payment.amount)}</span>
            </div>
          </div>
        </>
      )}
      
      {showStatus && (
        <div className="mt-4">
          {getPaymentStatusBadge(payment.paymentStatus)}
        </div>
      )}
    </div>
  );
}
