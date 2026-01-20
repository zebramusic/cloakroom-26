"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ShoppingBag } from "lucide-react";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { PaymentMethodSelector } from "@/components/checkout/PaymentMethodSelector";
import { OrderSummary } from "@/components/shop/OrderSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/store/cart.store";

interface CheckoutPageProps {
  params: {
    locale: string;
  };
}

export default function CheckoutPage({
  params: { locale },
}: CheckoutPageProps) {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleCheckoutSubmit = async (formData: any) => {
    try {
      // Submit order to API
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

      const { orderId } = await response.json();

      // Clear cart
      clearCart();

      // Redirect to confirmation page
      router.push(`/${locale}/shop/comanda/confirmare/${orderId}`);
    } catch (error) {
      console.error("Order creation error:", error);
      throw error;
    }
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
            />

            <CheckoutForm
              locale={locale}
              paymentMethod={paymentMethod}
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
