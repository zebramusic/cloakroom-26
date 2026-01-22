"use client";

import { QuoteForm } from "@/components/forms/QuoteForm";
import { use } from "react";

export default function QuoteRequestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold">
              {locale === "ro" ? "Cere Ofertă Gratuită" : "Request Free Quote"}
            </h1>
            <p className="text-lg text-muted-foreground">
              {locale === "ro"
                ? "Completează formularul și primești o ofertă personalizată în 24 de ore"
                : "Fill the form and receive a personalized quote within 24 hours"}
            </p>
          </div>

          <QuoteForm locale={locale} />
        </div>
      </div>
    </div>
  );
}
