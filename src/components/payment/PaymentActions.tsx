"use client";

import { Button } from "@/components/ui/button";

interface PaymentActionsProps {
  variant: "success" | "failure" | "cancel";
}

export function PaymentActions({ variant }: PaymentActionsProps) {
  const handleReturn = () => {
    if (!window.closed) {
      window.location.href = "/";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (variant === "failure") {
    return (
      <div className="flex flex-col items-center gap-4">
        {/* <Button onClick={handleRetry}>
          Try Again
        </Button> */}
        <Button variant="outline" onClick={handleReturn}>
          Return to Home
        </Button>
        <p className="mt-2 text-sm text-muted-foreground">You can also simply close this tab</p>
      </div>
    );
  }

  if (variant === "success") {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-4">
          <Button variant="outline" onClick={handlePrint}>
            Print Receipt
          </Button>
          <Button onClick={handleReturn}>
            Return to Home
          </Button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">You can also simply close this tab</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Button variant="outline" onClick={handleReturn}>
        Return to Home
      </Button>
      <p className="mt-2 text-sm text-muted-foreground">You can also simply close this tab</p>
    </div>
  );
}
