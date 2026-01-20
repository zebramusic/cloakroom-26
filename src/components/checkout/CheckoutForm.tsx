"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useCartStore } from "@/lib/store/cart.store";

// Validation schema
const checkoutSchema = z.object({
  // Contact info
  email: z.string().email("Email invalid"),
  phone: z.string().min(10, "Telefon invalid"),

  // Billing address
  billingFirstName: z.string().min(2, "Prenume obligatoriu"),
  billingLastName: z.string().min(2, "Nume obligatoriu"),
  billingCompany: z.string().optional(),
  billingAddress: z.string().min(5, "Adresă obligatorie"),
  billingCity: z.string().min(2, "Oraș obligatoriu"),
  billingCounty: z.string().min(2, "Județ obligatoriu"),
  billingPostalCode: z.string().min(5, "Cod poștal obligatoriu"),
  billingCountry: z.string(),

  // Shipping address (optional if same as billing)
  shippingIsSame: z.boolean(),
  shippingFirstName: z.string().optional(),
  shippingLastName: z.string().optional(),
  shippingAddress: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingCounty: z.string().optional(),
  shippingPostalCode: z.string().optional(),
  shippingCountry: z.string().optional(),

  // Delivery method
  deliveryMethod: z.enum(["pickup", "courier"]),

  // Notes
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  locale: string;
  paymentMethod: string;
  onSubmit: (data: CheckoutFormData) => Promise<void>;
}

export function CheckoutForm({
  locale,
  paymentMethod,
  onSubmit,
}: CheckoutFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cartItems = useCartStore((state) => state.items);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingIsSame: true,
      deliveryMethod: "courier",
      billingCountry: "România",
    },
  });

  const shippingIsSame = watch("shippingIsSame");

  const onFormSubmit = async (data: CheckoutFormData) => {
    if (cartItems.length === 0) {
      alert(locale === "ro" ? "Coșul este gol" : "Cart is empty");
      return;
    }

    if (!paymentMethod) {
      alert(
        locale === "ro"
          ? "Selectați o metodă de plată"
          : "Select a payment method",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Checkout error:", error);
      alert(
        locale === "ro"
          ? "Eroare la procesare comandă"
          : "Error processing order",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>
            {locale === "ro" ? "Informații de contact" : "Contact Information"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="email">
                {locale === "ro" ? "Email" : "Email"}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="nume@exemplu.ro"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">
                {locale === "ro" ? "Telefon" : "Phone"}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0712345678"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Address */}
      <Card>
        <CardHeader>
          <CardTitle>
            {locale === "ro" ? "Adresa de facturare" : "Billing Address"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="billingFirstName">
                {locale === "ro" ? "Prenume" : "First Name"}
                <span className="text-destructive">*</span>
              </Label>
              <Input id="billingFirstName" {...register("billingFirstName")} />
              {errors.billingFirstName && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.billingFirstName.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="billingLastName">
                {locale === "ro" ? "Nume" : "Last Name"}
                <span className="text-destructive">*</span>
              </Label>
              <Input id="billingLastName" {...register("billingLastName")} />
              {errors.billingLastName && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.billingLastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="billingCompany">
              {locale === "ro" ? "Companie (opțional)" : "Company (optional)"}
            </Label>
            <Input id="billingCompany" {...register("billingCompany")} />
          </div>

          <div>
            <Label htmlFor="billingAddress">
              {locale === "ro" ? "Adresă" : "Address"}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="billingAddress"
              placeholder={
                locale === "ro" ? "Str. Exemplu nr. 1" : "123 Example St"
              }
              {...register("billingAddress")}
            />
            {errors.billingAddress && (
              <p className="mt-1 text-sm text-destructive">
                {errors.billingAddress.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="billingCity">
                {locale === "ro" ? "Oraș" : "City"}
                <span className="text-destructive">*</span>
              </Label>
              <Input id="billingCity" {...register("billingCity")} />
              {errors.billingCity && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.billingCity.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="billingCounty">
                {locale === "ro" ? "Județ" : "County"}
                <span className="text-destructive">*</span>
              </Label>
              <Input id="billingCounty" {...register("billingCounty")} />
              {errors.billingCounty && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.billingCounty.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="billingPostalCode">
                {locale === "ro" ? "Cod poștal" : "Postal Code"}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="billingPostalCode"
                {...register("billingPostalCode")}
              />
              {errors.billingPostalCode && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.billingPostalCode.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="billingCountry">
              {locale === "ro" ? "Țară" : "Country"}
            </Label>
            <Input
              id="billingCountry"
              {...register("billingCountry")}
              readOnly
            />
          </div>
        </CardContent>
      </Card>

      {/* Delivery Method */}
      <Card>
        <CardHeader>
          <CardTitle>
            {locale === "ro" ? "Metodă de livrare" : "Delivery Method"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue="courier">
            <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
              <RadioGroupItem
                value="courier"
                id="courier"
                {...register("deliveryMethod")}
              />
              <div className="flex-1">
                <Label htmlFor="courier" className="font-medium">
                  {locale === "ro" ? "Livrare cu curier" : "Courier Delivery"}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {locale === "ro"
                    ? "Livrare în 3-5 zile lucrătoare"
                    : "Delivery in 3-5 business days"}
                </p>
              </div>
              <div className="font-medium">
                {locale === "ro" ? "50 RON" : "50 RON"}
              </div>
            </div>
            <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
              <RadioGroupItem
                value="pickup"
                id="pickup"
                {...register("deliveryMethod")}
              />
              <div className="flex-1">
                <Label htmlFor="pickup" className="font-medium">
                  {locale === "ro" ? "Ridicare personală" : "Personal Pickup"}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {locale === "ro"
                    ? "Ridicare din București, programare necesară"
                    : "Pickup from Bucharest, appointment required"}
                </p>
              </div>
              <div className="font-medium">
                {locale === "ro" ? "GRATUIT" : "FREE"}
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Order Notes */}
      <Card>
        <CardHeader>
          <CardTitle>
            {locale === "ro"
              ? "Note comandă (opțional)"
              : "Order Notes (optional)"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder={
              locale === "ro"
                ? "Observații suplimentare despre comandă..."
                : "Additional notes about your order..."
            }
            rows={4}
            {...register("notes")}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting || cartItems.length === 0}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {locale === "ro" ? "Procesare..." : "Processing..."}
          </>
        ) : locale === "ro" ? (
          "Finalizează comanda"
        ) : (
          "Place Order"
        )}
      </Button>
    </form>
  );
}
