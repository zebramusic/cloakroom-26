"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ClaimOrderDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleClaim = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/customer/orders/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber: orderNumber.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to claim order");
      } else {
        setSuccess(true);
        setTimeout(() => {
          setOpen(false);
          router.refresh();
          router.push(`/account/orders/${data.order._id}`);
        }, 1500);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Claim Order</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Claim an Order</DialogTitle>
          <DialogDescription>
            Enter your order number to link it to your account. The email
            address must match the order.
          </DialogDescription>
        </DialogHeader>
        {success ? (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              Order claimed successfully! Redirecting...
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orderNumber">Order Number</Label>
                <Input
                  id="orderNumber"
                  placeholder="e.g., ORD-2026-0001"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  You can find your order number in the confirmation email.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleClaim}
                disabled={isLoading || !orderNumber.trim()}
              >
                {isLoading ? "Claiming..." : "Claim Order"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
