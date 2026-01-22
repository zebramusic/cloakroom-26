import { unstable_setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuoteCTA } from "@/components/sections/QuoteCTA";
import { CheckCircle } from "lucide-react";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  unstable_setRequestLocale(locale);

  return (
    <>
      <Hero
        title={
          locale === "ro"
            ? "Servicii Complete pentru Evenimente"
            : "Complete Event Services"
        }
        subtitle={
          locale === "ro"
            ? "De la garderobă cu personal la infrastructură completă. Personalizăm soluția pentru evenimentul tău."
            : "From staffed cloakroom to complete infrastructure. We customize the solution for your event."
        }
        variant="page"
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="cloakroom" className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
              <TabsTrigger value="cloakroom">
                {locale === "ro" ? "Garderobă Evenimente" : "Event Cloakroom"}
              </TabsTrigger>
              <TabsTrigger value="shop">
                {locale === "ro" ? "Shop B2B" : "B2B Shop"}
              </TabsTrigger>
              <TabsTrigger value="consulting">
                {locale === "ro" ? "Consultanță" : "Consulting"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cloakroom" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {locale === "ro"
                      ? "Servicii Complete de Garderobă"
                      : "Complete Cloakroom Services"}
                  </CardTitle>
                  <CardDescription>
                    {locale === "ro"
                      ? "Sistem profesional cu personal dedicat pentru evenimente de orice dimensiune"
                      : "Professional system with dedicated staff for events of any size"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-lg font-semibold">
                      {locale === "ro" ? "Ce Include:" : "What's Included:"}
                    </h3>
                    <ul className="space-y-2">
                      {[
                        locale === "ro"
                          ? "Personal instruit și dedicat"
                          : "Trained and dedicated staff",
                        locale === "ro"
                          ? "Sistem cu token-uri numerotate"
                          : "Numbered token system",
                        locale === "ro"
                          ? "Rack-uri profesionale și ghișee"
                          : "Professional racks and counters",
                        locale === "ro"
                          ? "Bariere și semnalistică"
                          : "Barriers and signage",
                        locale === "ro"
                          ? "Setup și teardown complet"
                          : "Complete setup and teardown",
                        locale === "ro"
                          ? "Lost & Found organizat"
                          : "Organized Lost & Found",
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-4 text-lg font-semibold">
                      {locale === "ro" ? "Perfect Pentru:" : "Perfect For:"}
                    </h3>
                    <p className="text-muted-foreground">
                      {locale === "ro"
                        ? "Festivaluri, concerte, conferințe, evenimente corporate, petreceri private cu 100-12.000+ participanți"
                        : "Festivals, concerts, conferences, corporate events, private parties with 100-12,000+ attendees"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shop" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {locale === "ro"
                      ? "Shop B2B - Echipamente Profesionale"
                      : "B2B Shop - Professional Equipment"}
                  </CardTitle>
                  <CardDescription>
                    {locale === "ro"
                      ? "Vinde sau închiriază echipamente pentru propria ta garderobă"
                      : "Buy or rent equipment for your own cloakroom"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-lg font-semibold">
                      {locale === "ro"
                        ? "Produse Disponibile:"
                        : "Available Products:"}
                    </h3>
                    <ul className="space-y-2">
                      {[
                        locale === "ro"
                          ? "Token-uri numerotate"
                          : "Numbered tokens",
                        locale === "ro" ? "Rack-uri mobile" : "Mobile racks",
                        locale === "ro"
                          ? "Umerașe profesionale"
                          : "Professional hangers",
                        locale === "ro"
                          ? "Imprimante termale"
                          : "Thermal printers",
                        locale === "ro"
                          ? "Bariere și stâlpi"
                          : "Barriers and poles",
                        locale === "ro"
                          ? "Semnalistică personalizată"
                          : "Custom signage",
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-4 text-lg font-semibold">
                      {locale === "ro" ? "Perfect Pentru:" : "Perfect For:"}
                    </h3>
                    <p className="text-muted-foreground">
                      {locale === "ro"
                        ? "Organizatori de evenimente, locații permanente, teatre, cluburi care doresc propriul sistem"
                        : "Event organizers, permanent venues, theaters, clubs wanting their own system"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="consulting" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {locale === "ro"
                      ? "Consultanță & Design"
                      : "Consulting & Design"}
                  </CardTitle>
                  <CardDescription>
                    {locale === "ro"
                      ? "Te ajutăm să proiectezi și implementezi propriul sistem de garderobă"
                      : "We help you design and implement your own cloakroom system"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-lg font-semibold">
                      {locale === "ro"
                        ? "Servicii de Consultanță:"
                        : "Consulting Services:"}
                    </h3>
                    <ul className="space-y-2">
                      {[
                        locale === "ro"
                          ? "Analiza spațiului și flow-ului"
                          : "Space and flow analysis",
                        locale === "ro"
                          ? "Design sistem personalizat"
                          : "Custom system design",
                        locale === "ro"
                          ? "Calculul resurselor necesare"
                          : "Resource calculation",
                        locale === "ro"
                          ? "Training pentru personal"
                          : "Staff training",
                        locale === "ro"
                          ? "Proceduri operaționale"
                          : "Operational procedures",
                        locale === "ro"
                          ? "Optimizare costuri"
                          : "Cost optimization",
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-4 text-lg font-semibold">
                      {locale === "ro" ? "Perfect Pentru:" : "Perfect For:"}
                    </h3>
                    <p className="text-muted-foreground">
                      {locale === "ro"
                        ? "Locații noi, teatre, săli de spectacol, cluburi care vor să implementeze sau îmbunătățească sistemul existent"
                        : "New venues, theaters, concert halls, clubs wanting to implement or improve existing systems"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <QuoteCTA
        variant="inline"
        heading={
          locale === "ro"
            ? "Discutăm despre evenimentul tău?"
            : "Let's discuss your event?"
        }
        description={
          locale === "ro"
            ? "Personalizăm serviciile pentru nevoile tale specifice"
            : "We customize services for your specific needs"
        }
        ctaLabel={locale === "ro" ? "Cere Ofertă" : "Request Quote"}
        ctaHref={`/${locale}/cere-oferta`}
      />
    </>
  );
}
