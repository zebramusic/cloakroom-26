"use client";

import { useState, useEffect } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Loader2 } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

interface StripeCheckoutFormProps {
  amount: number;
  orderId: string;
  locale: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

function CheckoutForm({
  amount,
  orderId,
  locale,
  onSuccess,
  onError,
}: StripeCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/${locale}/shop/comanda/confirmare/${orderId}?payment=success`,
        },
      });

      if (error) {
        onError(error.message || "Payment failed");
      }
    } catch (err) {
      onError("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="mt-6 w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {locale === "ro" ? "Procesare..." : "Processing..."}
          </>
        ) : (
          <>
            {locale === "ro" ? "Plătește " : "Pay "}
            {new Intl.NumberFormat(locale === "ro" ? "ro-RO" : "en-US", {
              style: "currency",
              currency: "RON",
            }).format(amount / 100)}
          </>
        )}
      </Button>
    </form>
  );
}

export function StripeCheckoutForm(props: StripeCheckoutFormProps) {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Create PaymentIntent
    fetch("/api/stripe/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: props.amount,
        orderId: props.orderId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setError(data.error || "Failed to initialize payment");
        }
      })
      .catch(() => {
        setError("Failed to initialize payment");
      });
  }, [props.amount, props.orderId]);

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!clientSecret) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
    },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          <CardTitle>
            {props.locale === "ro" ? "Plată cu cardul" : "Card Payment"}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm {...props} />
        </Elements>
      </CardContent>
    </Card>
  );
}
