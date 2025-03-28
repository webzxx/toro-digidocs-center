import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Truck, Store } from "lucide-react";
import { Toast, useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { initiatePayment, cancelPayment } from "@/app/actions/payment";

interface PaymentButtonProps {
  certificateId: number;
};

export default function PaymentButton({ certificateId }: PaymentButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup");
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  let checkoutWindow: Window | null = null;

  // Check for existing transaction and window state on mount
  useEffect(() => {
    const storedTransaction = localStorage.getItem(`payment_${certificateId}`);
    if (storedTransaction) {
      try {
        const { transactionId, timestamp, checkoutUrl, windowOpen } = JSON.parse(storedTransaction);
        const timeSinceInitiated = Date.now() - timestamp;
        
        if (timeSinceInitiated < 30 * 60 * 1000) {
          setCheckoutUrl(checkoutUrl);
          checkTransactionStatus(transactionId, windowOpen);
        } else {
          localStorage.removeItem(`payment_${certificateId}`);
        }
      } catch (error) {
        console.error("Error parsing stored transaction:", error);
        localStorage.removeItem(`payment_${certificateId}`);
      }
    }
    
    // Mark initialization as complete
    setIsInitializing(false);
    
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [certificateId]); // eslint-disable-line react-hooks/exhaustive-deps

  // When "Proceed to Payment" button is clicked
  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      
      const result = await initiatePayment({ 
        certificateId,
        deliveryMethod,
      });

      if(result.error || !result.transactionId)
        throw new Error(result.error || "Payment initialization failed");

      // Store transaction info in localStorage with checkout URL
      localStorage.setItem(`payment_${certificateId}`, JSON.stringify({
        transactionId: result.transactionId,
        timestamp: Date.now(),
        checkoutUrl: result.checkoutUrl,
        windowOpen: true,
      }));
      
      setCheckoutUrl(result.checkoutUrl);
      // Open the checkout URL in a new tab
      openCheckoutWindow(result.checkoutUrl);
      // Close dialog after successful payment initialization
      setIsDialogOpen(false);
      // Poll for payment status
      pollPaymentStatus(result.transactionId);
      
    } catch (error) {
      console.error("Payment error:", error);
      
      // Show error toast
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
      
      setIsProcessing(false);
    }
  };

  const openCheckoutWindow = (url: string) => {
    checkoutWindow = window.open(url, "_blank");
    
    if (checkoutWindow) {
      // Update localStorage with window state
      const storedTransaction = localStorage.getItem(`payment_${certificateId}`);
      if (storedTransaction) {
        const transaction = JSON.parse(storedTransaction);
        localStorage.setItem(`payment_${certificateId}`, JSON.stringify({
          ...transaction,
          windowOpen: true,
        }));
      }

      const checkWindowClosed = setInterval(() => {
        if (checkoutWindow && checkoutWindow.closed) {
          clearInterval(checkWindowClosed);
          setIsProcessing(false);
          // Update localStorage when window is closed
          const storedTransaction = localStorage.getItem(`payment_${certificateId}`);
          if (storedTransaction) {
            const transaction = JSON.parse(storedTransaction);
            localStorage.setItem(`payment_${certificateId}`, JSON.stringify({
              ...transaction,
              windowOpen: false,
            }));
          }
          toast({
            title: "Checkout Window Closed",
            description: "You can reopen the payment page by clicking 'Reopen Checkout'",
          });
        }
      }, 1000);
    }
  };

  const reopenCheckout = () => {
    if (checkoutUrl) {
      setIsProcessing(true);
      setIsDialogOpen(false);
      openCheckoutWindow(checkoutUrl);
    }
  };

  const checkTransactionStatus = async (transactionId: string, isCheckoutWindowOpen: boolean) => {
    try {
      if (isCheckoutWindowOpen) setIsProcessing(true);

      const response = await fetch(`/api/certificates/payment/status?certificateId=${certificateId}&transactionId=${transactionId}`);
      const data = await response.json();
      
      if (data.status === "PENDING") {
        // Transaction exists and is still pending, resume polling
        pollPaymentStatus(transactionId);
      } else if (data.status === "SUCCEEDED") {
        // Transaction already completed
        handlePaymentSuccess();
      } else {
        // Transaction failed or doesn't exist
        setIsProcessing(false);
        localStorage.removeItem(`payment_${certificateId}`);
      }
    } catch (error) {
      console.error("Error checking transaction status:", error);
      setIsProcessing(false);
    }
  };

  const resetPaymentState = (showToast = false, toastOptions:Toast = {}) => {
    clearPolling();
    setIsDialogOpen(false);
    setIsProcessing(false);
    setCheckoutUrl(null);
    localStorage.removeItem(`payment_${certificateId}`);
    
    if (showToast) {
      toast({
        title: toastOptions.title || "Payment Status",
        description: toastOptions.description || "",
        variant: toastOptions.variant || "default",
      });
    }
  };

  const pollPaymentStatus = (transactionId: string) => {
    if (pollIntervalRef.current) return; // prevent multiple intervals

    pollIntervalRef.current = setInterval(async () => {
      try {
        if (document.hidden) return; // don't poll if tab is not active

        const response = await fetch(`/api/certificates/payment/status?certificateId=${certificateId}&transactionId=${transactionId}`);
        const data = await response.json();

        if (data.status === "SUCCEEDED") {
          handlePaymentSuccess();
        } else if (data.status === "REJECTED" || data.status === "EXPIRED") {
          resetPaymentState(true, {
            title: "Payment Failed",
            description: "Payment was not completed. Please try again.",
            variant: "destructive",
          });
        } else if (data.status === "CANCELLED"){
          resetPaymentState();
        }
      } catch (error) {
        console.error("Payment status polling error:", error);
      }
    }, 5000); // Poll every 5 seconds
  };

  const handlePaymentSuccess = () => {
    clearPolling();
    setIsProcessing(false);
    localStorage.removeItem(`payment_${certificateId}`);
    toast({
      title: "Payment Successful",
      description: "Your certificate has been successfully paid.",
    });

    // Delay page reload to allow toast to be visible
    setTimeout(() => {
      window.location.reload();
    }, 1500); // 1.5 second delay
  };

  const clearPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  // Add a new function to handle payment cancellation
  const handleCancelPayment = async () => {
    try {
      setIsCancelling(true);
      
      // Get the transaction ID from localStorage
      const storedTransaction = localStorage.getItem(`payment_${certificateId}`);
      if (!storedTransaction) {
        throw new Error("No active payment found");
      }
      
      const { transactionId } = JSON.parse(storedTransaction);
      
      // Call the server action to cancel the payment
      const result = await cancelPayment({
        certificateId,
        transactionId,
      });
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Clear local storage and reset state
      localStorage.removeItem(`payment_${certificateId}`);
      setIsProcessing(false);
      setCheckoutUrl(null);
      setIsDialogOpen(false);
      clearPolling();

      // Show success toast
      toast({
        title: "Payment Cancelled",
        description: result.message || "Your payment has been cancelled successfully.",
      });

      // Delay page reload to allow toast to be visible
      setTimeout(() => {
        window.location.reload();
      }, 1500); // 1.5 second delay
      
    } catch (error) {
      console.error("Payment cancellation error:", error);
      
      // Show error toast
      toast({
        title: "Cancellation Error",
        description: error instanceof Error ? error.message : "Failed to cancel payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" disabled={isInitializing} className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300">
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : checkoutUrl ? (
              "Reopen Checkout"
            ) : (
              "Pay Now"
            )}
          </Button>
        </DialogTrigger>
        
        {/* Dialog content remains the same for new payments */}
        {!checkoutUrl ? (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Certificate Delivery Options</DialogTitle>
              <DialogDescription>
                Choose how you would like to receive your certificate
              </DialogDescription>
            </DialogHeader>
            
            <RadioGroup 
              value={deliveryMethod} 
              onValueChange={(value) => setDeliveryMethod(value as "pickup" | "delivery")}
              className="grid gap-6 py-4"
            >
              <div className="flex items-center space-x-2 border p-4 rounded-md">
                <RadioGroupItem value="pickup" id="pickup" />
                <Label htmlFor="pickup" className="flex items-center gap-3 cursor-pointer">
                  <Store className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Pickup at Barangay Office</p>
                    <p className="text-sm text-gray-500">No additional fee</p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border p-4 rounded-md">
                <RadioGroupItem value="delivery" id="delivery" />
                <Label htmlFor="delivery" className="flex items-center gap-3 cursor-pointer">
                  <Truck className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Deliver to my address</p>
                    <p className="text-sm text-gray-500">Additional ₱50.00 shipping fee</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
            
            <DialogFooter>
              <Button 
                onClick={handlePayment} 
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  `Proceed to Payment (₱${deliveryMethod === "delivery" ? "350" : "300"})`
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        ) : (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Resume Payment</DialogTitle>
              <DialogDescription>
                Your payment session is still active. You can continue with your payment or cancel it.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 flex-col sm:flex-col sm:space-x-0 sm:space-y-1">
              <Button 
                onClick={reopenCheckout} 
                className="w-full"
              >
                Reopen Checkout
              </Button>
              <Button 
                variant="outline"
                onClick={handleCancelPayment}
                disabled={isCancelling}
                className="w-full"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cancelling Payment...
                  </>
                ) : (
                  "Cancel Payment"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}