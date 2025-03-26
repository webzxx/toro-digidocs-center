import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { PaymentActions } from "@/components/payment/PaymentActions";
import { PaymentDetails } from "@/components/payment/PaymentDetails";

export function PaymentReceipt({ payment }: { payment: any }) {
  return (
    <div className="space-y-6 py-4">
      <div className="rounded-xl bg-green-50 p-4 flex items-center gap-3 text-green-700 mb-4">
        <div className="bg-green-100 rounded-full p-1">
          <Check className="h-5 w-5 text-green-600" />
        </div>
        <p className="font-medium">Payment Successful!</p>
      </div>
      
      <Card className="overflow-hidden border-t-8 border-t-green-600">
        <CardHeader className="bg-white p-6 pb-0">
          <CardTitle className="text-2xl font-bold">Payment Receipt</CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 pt-0">
          <PaymentDetails 
            payment={payment} 
            showAmounts
            showHeader
            showStatus
          />
        </CardContent>
        
        <CardFooter className="bg-gray-50 p-6 flex justify-end">
          <PaymentActions variant="success" />
        </CardFooter>
      </Card>
      
      <div className="text-center text-sm text-gray-500">
        <p>A confirmation email has been sent to your registered email address.</p>
      </div>
    </div>
  );
}
