import { unstable_setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { QuoteCTA } from "@/components/sections/QuoteCTA";
import { Users, Calendar, MapPin, Package, Clock, Shield } from "lucide-react";

const pricingFactors = [
  {
    icon: Users,
    titleRo: "Număr de Participanți",
    titleEn: "Number of Attendees",
    descRo:
      "De la 100 la 12.000+ participanți. Infrastructura și echipa se scalează proporțional.",
    descEn:
      "From 100 to 12,000+ attendees. Infrastructure and team scale proportionally.",
  },
  {
    icon: Calendar,
    titleRo: "Durata Evenimentului",
    titleEn: "Event Duration",
    descRo:
      "Ore, zile sau weekenduri întregi. Tarife adaptate la durata serviciului.",
    descEn:
      "Hours, days, or entire weekends. Rates adapted to service duration.",
  },
  {
    icon: MapPin,
    titleRo: "Locație & Logistică",
    titleEn: "Location & Logistics",
    descRo:
      "Distanța față de baza noastră, accesibilitatea locației, și complexitatea setup-ului.",
    descEn:
      "Distance from our base, venue accessibility, and setup complexity.",
  },
  {
    icon: Package,
    titleRo: "Servicii Incluse",
    titleEn: "Included Services",
    descRo:
      "Garderobă standard, VIP, backstage, bag check. Fiecare serviciu se adaugă modular.",
    descEn:
      "Standard cloakroom, VIP, backstage, bag check. Each service adds modularly.",
  },
  {
    icon: Clock,
    titleRo: "Program & Flux",
    titleEn: "Schedule & Flow",
    descRo:
      "Ore de vârf, mai multe puncte de lucru, sistem fast-track sau prioritate.",
    descEn:
      "Peak hours, multiple service points, fast-track or priority system.",
  },
  {
    icon: Shield,
    titleRo: "Infrastructură Necesară",
    titleEn: "Required Infrastructure",
    descRo:
      "Rack-uri, ghișee, bariere, semnalistică. Furnizăm tot sau parțial.",
    descEn: "Racks, counters, barriers, signage. We provide all or partially.",
  },
];

const faqs = [
  {
    questionRo: "Cum se calculează prețul?",
    questionEn: "How is the price calculated?",
    answerRo:
      "Prețul se calculează în funcție de numărul de participanți estimați, durata evenimentului, locația, și serviciile solicitate. Fiecare ofertă este personalizată pentru nevoile tale specifice.",
    answerEn:
      "Price is calculated based on estimated attendees, event duration, location, and requested services. Each quote is customized for your specific needs.",
  },
  {
    questionRo: "Există un preț minim?",
    questionEn: "Is there a minimum price?",
    answerRo:
      "Da, avem un tarif minim pentru mobilizarea echipei și echipamentelor. Acesta variază în funcție de locație și perioada anului.",
    answerEn:
      "Yes, we have a minimum fee for team and equipment mobilization. This varies based on location and time of year.",
  },
  {
    questionRo: "Oferiți discount pentru evenimente recurente?",
    questionEn: "Do you offer discounts for recurring events?",
    answerRo:
      "Da, pentru partenerii care lucrează constant cu noi oferim condiții preferențiale și prețuri speciale.",
    answerEn:
      "Yes, for partners who work consistently with us, we offer preferential terms and special pricing.",
  },
  {
    questionRo: "Se pot face modificări după semnarea contractului?",
    questionEn: "Can changes be made after signing the contract?",
    answerRo:
      "Da, putem ajusta numărul de participanți și serviciile cu până la 7 zile înainte de eveniment fără costuri suplimentare. Modificările mai târzii pot atrage tarife de urgență.",
    answerEn:
      "Yes, we can adjust attendee numbers and services up to 7 days before the event at no extra cost. Later changes may incur rush fees.",
  },
];

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  unstable_setRequestLocale(locale);

  return (
    <>
      <Hero
        title={locale === "ro" ? "Prețuri Transparente" : "Transparent Pricing"}
        subtitle={
          locale === "ro"
            ? "Fiecare eveniment este unic. Creăm oferte personalizate bazate pe nevoile tale specifice."
            : "Every event is unique. We create customized quotes based on your specific needs."
        }
        variant="page"
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              {locale === "ro"
                ? "Ce Influențează Prețul?"
                : "What Influences the Price?"}
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {locale === "ro"
                ? "Prețul final depinde de mai mulți factori. Oferim oferte clare și detaliate pentru transparență totală."
                : "Final price depends on several factors. We provide clear and detailed quotes for total transparency."}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pricingFactors.map((factor, index) => {
              const Icon = factor.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">
                      {locale === "ro" ? factor.titleRo : factor.titleEn}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      {locale === "ro" ? factor.descRo : factor.descEn}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-3xl font-bold">
              {locale === "ro"
                ? "Întrebări Frecvente despre Prețuri"
                : "Frequently Asked Questions about Pricing"}
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>
                    {locale === "ro" ? faq.questionRo : faq.questionEn}
                  </AccordionTrigger>
                  <AccordionContent>
                    {locale === "ro" ? faq.answerRo : faq.answerEn}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <QuoteCTA
        variant="full-width"
        heading={
          locale === "ro"
            ? "Cere o Ofertă Personalizată"
            : "Request a Custom Quote"
        }
        description={
          locale === "ro"
            ? "Completează un formular simplu și primești o ofertă detaliată în 24 de ore"
            : "Fill a simple form and receive a detailed quote within 24 hours"
        }
        ctaLabel={locale === "ro" ? "Cere Ofertă Acum" : "Request Quote Now"}
        ctaHref={`/${locale}/cere-oferta`}
      />
    </>
  );
}
