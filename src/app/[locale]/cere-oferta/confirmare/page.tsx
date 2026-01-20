import { unstable_setRequestLocale } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, Clock, Phone } from "lucide-react";
import Link from "next/link";

export default function QuoteConfirmationPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { email?: string };
}) {
  unstable_setRequestLocale(locale);

  const email = searchParams.email || "";

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle className="h-12 w-12" />
            </div>
          </div>

          {/* Success Message */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-3xl font-bold">
              {locale === "ro"
                ? "Cererea Ta a Fost Primită!"
                : "Your Request Has Been Received!"}
            </h1>
            <p className="text-lg text-muted-foreground">
              {locale === "ro"
                ? `Îți mulțumim! Cererea ta de ofertă a fost înregistrată cu succes.`
                : `Thank you! Your quote request has been successfully registered.`}
            </p>
            {email && (
              <p className="mt-2 text-muted-foreground">
                {locale === "ro"
                  ? `Vei primi un email de confirmare la `
                  : `You'll receive a confirmation email at `}
                <span className="font-medium text-foreground">{email}</span>
              </p>
            )}
          </div>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {locale === "ro" ? "Ce Urmează?" : "What's Next?"}
              </CardTitle>
              <CardDescription>
                {locale === "ro"
                  ? "Procesul nostru de răspuns"
                  : "Our response process"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 font-semibold">
                      {locale === "ro"
                        ? "Verificăm Email-ul"
                        : "Check Your Email"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {locale === "ro"
                        ? "Vei primi imediat un email de confirmare cu detaliile cererii tale."
                        : "You'll immediately receive a confirmation email with your request details."}
                    </p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 font-semibold">
                      {locale === "ro"
                        ? "Analizăm Cererea"
                        : "We Analyze the Request"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {locale === "ro"
                        ? "Echipa noastră va analiza detaliile evenimentului și va calcula resursele necesare."
                        : "Our team will analyze the event details and calculate required resources."}
                    </p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 font-semibold">
                      {locale === "ro"
                        ? "Primești Oferta"
                        : "Receive Your Quote"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {locale === "ro"
                        ? "În maximum 24 de ore vei primi o ofertă personalizată cu toate detaliile și prețurile."
                        : "Within 24 hours you'll receive a personalized quote with all details and pricing."}
                    </p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 font-semibold">
                      {locale === "ro"
                        ? "Discutăm Detaliile"
                        : "Discuss Details"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {locale === "ro"
                        ? "Dacă ai întrebări sau vrei ajustări, suntem disponibili pentru o discuție."
                        : "If you have questions or want adjustments, we're available for discussion."}
                    </p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {locale === "ro" ? "Scrie-ne la" : "Email us at"}
                  </p>
                  <a
                    href="mailto:contact@garderobapro.ro"
                    className="font-medium text-primary hover:underline"
                  >
                    contact@garderobapro.ro
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {locale === "ro" ? "Sună-ne la" : "Call us at"}
                  </p>
                  <a
                    href="tel:+40123456789"
                    className="font-medium text-primary hover:underline"
                  >
                    +40 123 456 789
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href={`/${locale}`} className="flex-1">
              <Button variant="outline" className="w-full">
                {locale === "ro" ? "Înapoi la Acasă" : "Back to Home"}
              </Button>
            </Link>
            <Link href={`/${locale}/shop`} className="flex-1">
              <Button className="w-full">
                {locale === "ro" ? "Explorează Shop-ul" : "Browse Shop"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
