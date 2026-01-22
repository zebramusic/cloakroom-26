"use client";

import { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";

interface StripePaymentFormProps {
  clientSecret: string;
  locale: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function StripePaymentForm({
  clientSecret,
  locale,
  onSuccess,
  onError,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe) return;

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage(locale === "ro" ? "Plată reușită!" : "Payment succeeded!");
          onSuccess();
          break;
        case "processing":
          setMessage(
            locale === "ro" ? "Plată în procesare..." : "Payment processing...",
          );
          break;
        case "requires_payment_method":
          setMessage(
            locale === "ro"
              ? "Vă rugăm să completați datele cardului"
              : "Please complete card details",
          );
          break;
        default:
          setMessage(
            locale === "ro" ? "Ceva nu a mers bine" : "Something went wrong",
          );
          break;
      }
    });
  }, [stripe, clientSecret, locale, onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/${locale}/shop/comanda/success`,
      },
      redirect: "if_required",
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "An error occurred");
        onError(error.message || "Payment failed");
      } else {
        setMessage(locale === "ro" ? "Eroare de plată" : "Payment error");
        onError("Unexpected error");
      }
      setIsProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border p-4">
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {message && (
        <div
          className={`rounded-md p-3 text-sm ${
            message.includes("success") || message.includes("reușită")
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {message}
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {locale === "ro" ? "Procesare..." : "Processing..."}
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            {locale === "ro" ? "Plătește acum" : "Pay now"}
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        {locale === "ro"
          ? "Plata este securizată prin Stripe. Nu salvăm datele cardului."
          : "Payment is secured by Stripe. We don't store card data."}
      </p>
    </form>
  );
}
