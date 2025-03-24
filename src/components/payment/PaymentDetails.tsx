import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface PaymentDetailsProps {
  payment: any;
  showAmounts?: boolean;
  showHeader?: boolean;
  showStatus?: boolean;
}

export function PaymentDetails({ 
  payment, 
  showAmounts = false, 
  showHeader = false, 
  showStatus = false, 
}: PaymentDetailsProps) {
  const resident = payment.certificateRequest.resident;
  const metadata = payment.metadata as any;
  const paidDate = payment.paymentDate || new Date();
  
  // Format amount as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  // Calculate amounts
  const baseAmount = payment.amount - (metadata?.shippingFee || 0);
  const shippingFee = metadata?.shippingFee || 0;
  
  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex flex-col items-start pt-2 sm:pt-0 sm:justify-between sm:flex-row sm:items-center">
          <div>
            <p className="text-gray-500 text-sm">
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
        <h3 className="text-sm font-medium text-gray-500 mb-1">Transaction Reference</h3>
        <p className="font-mono text-base">{payment.transactionReference}</p>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">Certificate</h3>
        <p className="text-base font-medium">
          {payment.certificateRequest.certificateType.replaceAll("_", " ")} Certificate
        </p>
        <p className="text-sm text-gray-600">
          Reference: {payment.certificateRequest.referenceNumber}
        </p>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">Recipient</h3>
        <p className="text-base">{resident.firstName} {resident.lastName}</p>
      </div>
      
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
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {payment.paymentStatus}
          </Badge>
        </div>
      )}
    </div>
  );
}
