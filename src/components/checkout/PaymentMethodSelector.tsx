"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Banknote, Info, Wallet } from "lucide-react";

interface PaymentMethodSelectorProps {
  locale: string;
  value: string;
  onChange: (value: string) => void;
}

export function PaymentMethodSelector({
  locale,
  value,
  onChange,
}: PaymentMethodSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {locale === "ro" ? "Metodă de plată" : "Payment Method"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={value} onValueChange={onChange}>
          {/* Stripe Card Payment */}
          <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
            <RadioGroupItem value="stripe" id="stripe" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="stripe" className="font-medium">
                  {locale === "ro"
                    ? "Card bancar (recomandat)"
                    : "Credit/Debit Card (recommended)"}
                </Label>
              </div>
              {value === "stripe" && (
                <div className="rounded-md bg-muted p-3 text-sm">
                  <div className="mb-2 flex items-start gap-2">
                    <Info className="mt-0.5 h-4 w-4 text-blue-500" />
                    <p className="font-medium">
                      {locale === "ro"
                        ? "Plată securizată cu cardul:"
                        : "Secure card payment:"}
                    </p>
                  </div>
                  <div className="space-y-1 text-muted-foreground">
                    <p>
                      {locale === "ro"
                        ? "Acceptăm Visa, Mastercard, American Express"
                        : "We accept Visa, Mastercard, American Express"}
                    </p>
                    <p className="mt-2 text-xs">
                      {locale === "ro"
                        ? "* Procesare instantanee prin Stripe. Comanda va fi confirmată imediat."
                        : "* Instant processing via Stripe. Order will be confirmed immediately."}
                    </p>
                    <p className="text-xs">
                      {locale === "ro"
                        ? "* Datele cardului sunt criptate și nu sunt salvate de noi."
                        : "* Card data is encrypted and not stored by us."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bank Transfer */}
          <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
            <RadioGroupItem value="bank_transfer" id="bank_transfer" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="bank_transfer" className="font-medium">
                  {locale === "ro" ? "Transfer bancar" : "Bank Transfer"}
                </Label>
              </div>
              {value === "bank_transfer" && (
                <div className="rounded-md bg-muted p-3 text-sm">
                  <div className="mb-2 flex items-start gap-2">
                    <Info className="mt-0.5 h-4 w-4 text-blue-500" />
                    <p className="font-medium">
                      {locale === "ro"
                        ? "Detalii transfer bancar:"
                        : "Bank transfer details:"}
                    </p>
                  </div>
                  <div className="space-y-1 text-muted-foreground">
                    <p>
                      <strong>
                        {locale === "ro" ? "Beneficiar:" : "Beneficiary:"}
                      </strong>{" "}
                      Garderobă Profesională SRL
                    </p>
                    <p>
                      <strong>
                        {locale === "ro" ? "Cont IBAN:" : "IBAN:"}
                      </strong>{" "}
                      RO49 AAAA 1B31 0075 9384 0000
                    </p>
                    <p>
                      <strong>{locale === "ro" ? "Bancă:" : "Bank:"}</strong>{" "}
                      Banca Transilvania
                    </p>
                    <p className="mt-2 text-xs">
                      {locale === "ro"
                        ? "* Vă rugăm să includeți numărul comenzii în detaliile transferului."
                        : "* Please include the order number in the transfer details."}
                    </p>
                    <p className="text-xs">
                      {locale === "ro"
                        ? "* Comanda va fi procesată după confirmarea plății (1-2 zile lucrătoare)."
                        : "* Order will be processed after payment confirmation (1-2 business days)."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cash on Delivery */}
          <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
            <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Banknote className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="cash_on_delivery" className="font-medium">
                  {locale === "ro"
                    ? "Ramburs (plată la livrare)"
                    : "Cash on Delivery"}
                </Label>
              </div>
              {value === "cash_on_delivery" && (
                <div className="rounded-md bg-muted p-3 text-sm">
                  <div className="mb-2 flex items-start gap-2">
                    <Info className="mt-0.5 h-4 w-4 text-blue-500" />
                    <p className="font-medium">
                      {locale === "ro"
                        ? "Detalii plată la livrare:"
                        : "Cash on delivery details:"}
                    </p>
                  </div>
                  <div className="space-y-1 text-muted-foreground">
                    <p>
                      {locale === "ro"
                        ? "Veți plăti curierului suma totală la primirea coletului."
                        : "You will pay the courier the total amount upon receiving the package."}
                    </p>
                    <p className="mt-2 text-xs">
                      {locale === "ro"
                        ? "* Taxă ramburs: 15 RON (se adaugă la total)."
                        : "* COD fee: 15 RON (added to total)."}
                    </p>
                    <p className="text-xs">
                      {locale === "ro"
                        ? "* Disponibil doar pentru livrări în România."
                        : "* Available only for deliveries in Romania."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </RadioGroup>

        {!value && (
          <p className="mt-4 text-sm text-destructive">
            {locale === "ro"
              ? "Vă rugăm să selectați o metodă de plată"
              : "Please select a payment method"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
