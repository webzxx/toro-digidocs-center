"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { STORAGE_KEYS } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SignOutButton() {
  const handleSignOut = () => {
    // Clear the chat history from localStorage
    localStorage.removeItem(STORAGE_KEYS.CHAT_MESSAGES);
    
    // Clear any payment-related data from localStorage
    // Find and remove all items that match the payment pattern
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith("payment_")) {
        localStorage.removeItem(key);
      }
    });
    
    // Proceed with the sign out
    signOut({ callbackUrl: "/" });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign Out</DialogTitle>
          <DialogDescription>
            Are you sure you want to sign out?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleSignOut}>
            Yes, Sign Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}