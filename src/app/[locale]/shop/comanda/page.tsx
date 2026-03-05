"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ShoppingBag, Loader2 } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { PaymentMethodSelector } from "@/components/checkout/PaymentMethodSelector";
import { StripePaymentForm } from "@/components/checkout/StripePaymentForm";
import { OrderSummary } from "@/components/shop/OrderSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/store/cart.store";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

interface CheckoutPageProps {
  params: Promise<{ locale: string }>;
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale } = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderData, setOrderData] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [orderId, setOrderId] = useState("");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [customerData, setCustomerData] = useState<any>(null);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);
  const [companySettings, setCompanySettings] = useState<any>(null);

  // Fetch customer data if logged in
  useEffect(() => {
    if (session?.user?.id && session?.user?.principalType === "customer") {
      setIsLoadingCustomer(true);
      fetch(`/api/customers/${session.user.id}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.customer) {
            setCustomerData(data.customer);
          }
        })
        .catch((err) => console.error("Failed to fetch customer data:", err))
        .finally(() => setIsLoadingCustomer(false));
    }
  }, [session]);

  useEffect(() => {
    fetch(`/api/site/company-settings?locale=${locale}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.settings) {
          setCompanySettings(data.settings);
        }
      })
      .catch((err) =>
        console.error("Failed to fetch company settings for checkout:", err),
      );
  }, [locale]);

  const handleCheckoutSubmit = async (formData: any) => {
    setIsCreatingOrder(true);
    try {
      // Create order first
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          paymentMethod,
          items: cartItems,
          locale,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const { orderId: newOrderId } = await response.json();
      setOrderId(newOrderId);

      // If Stripe payment, create payment intent
      if (paymentMethod === "stripe") {
        const subtotal = cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
        const taxRate = 0.19;
        const tax = subtotal * taxRate;
        const deliveryFee = formData.deliveryMethod === "courier" ? 50 : 0;
        const total = subtotal + tax + deliveryFee;

        const piResponse = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(total * 100), // Convert to cents
            orderId: newOrderId,
          }),
        });

        if (!piResponse.ok) {
          throw new Error("Failed to create payment intent");
        }

        const { clientSecret } = await piResponse.json();
        setClientSecret(clientSecret);
        setOrderData(formData);
      } else {
        // For other payment methods, redirect to confirmation
        clearCart();
        router.push(`/${locale}/shop/comanda/confirmare/${newOrderId}`);
      }
    } catch (error) {
      console.error("Order creation error:", error);
      alert(
        locale === "ro" ? "Eroare la crearea comenzii" : "Error creating order",
      );
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    router.push(`/${locale}/shop/comanda/confirmare/${orderId}`);
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
  };

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground" />
          <h1 className="text-2xl font-bold">
            {locale === "ro" ? "Coșul este gol" : "Cart is empty"}
          </h1>
          <p className="text-muted-foreground">
            {locale === "ro"
              ? "Adaugă produse în coș pentru a putea finaliza comanda."
              : "Add products to cart to proceed with checkout."}
          </p>
          <Link
            href={`/${locale}/shop`}
            className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90"
          >
            {locale === "ro" ? "Mergi la magazin" : "Go to shop"}
          </Link>
        </div>
      </div>
    );
  }

  // Show Stripe payment form if we have client secret
  if (clientSecret && paymentMethod === "stripe") {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              {locale === "ro" ? "Plată cu cardul" : "Card Payment"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {locale === "ro"
                ? "Completează datele cardului pentru a finaliza comanda"
                : "Complete card details to finish your order"}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {locale === "ro" ? "Detalii plată" : "Payment Details"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "stripe",
                  },
                }}
              >
                <StripePaymentForm
                  clientSecret={clientSecret}
                  locale={locale}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4">
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href={`/${locale}`} className="hover:text-foreground">
            {locale === "ro" ? "Acasă" : "Home"}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/${locale}/shop`} className="hover:text-foreground">
            {locale === "ro" ? "Magazin" : "Shop"}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/${locale}/shop/cos`} className="hover:text-foreground">
            {locale === "ro" ? "Coș" : "Cart"}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">
            {locale === "ro" ? "Finalizare comandă" : "Checkout"}
          </span>
        </nav>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {locale === "ro" ? "Finalizare comandă" : "Checkout"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {locale === "ro"
              ? "Completează datele pentru a finaliza comanda"
              : "Complete your order details"}
          </p>
        </div>
      </div>

      {/* Checkout Content */}
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Forms */}
          <div className="space-y-8 lg:col-span-2">
            <PaymentMethodSelector
              locale={locale}
              value={paymentMethod}
              onChange={setPaymentMethod}
              companySettings={companySettings}
            />

            <CheckoutForm
              locale={locale}
              paymentMethod={paymentMethod}
              customerData={customerData}
              isLoadingCustomer={isLoadingCustomer}
              onSubmit={handleCheckoutSubmit}
            />
          </div>

          {/* Right Column: Order Summary */}
          <div className="space-y-6">
            {/* Cart Items Preview */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {locale === "ro" ? "Produse comandate" : "Order Items"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.product_id} className="flex gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                        <Image
                          src={item.image_url || "/placeholder-product.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium line-clamp-1">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {locale === "ro" ? "Cantitate:" : "Quantity:"}{" "}
                          {item.quantity}
                        </p>
                      </div>
                      <div className="font-medium">
                        {new Intl.NumberFormat(
                          locale === "ro" ? "ro-RO" : "en-US",
                          {
                            style: "currency",
                            currency: "RON",
                          },
                        ).format(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <OrderSummary locale={locale} />

            {/* Security Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <p>
                    {locale === "ro"
                      ? "Datele tale sunt protejate prin criptare SSL. Nu salvăm informații despre carduri bancare."
                      : "Your data is protected by SSL encryption. We do not store credit card information."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
