import { unstable_setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuoteCTA } from "@/components/sections/QuoteCTA";
import {
  Music,
  Users,
  Building2,
  Trophy,
  Presentation,
  PartyPopper,
} from "lucide-react";

const industries = [
  {
    icon: Music,
    titleRo: "Festivaluri Muzicale",
    titleEn: "Music Festivals",
    descRo:
      "De la festivaluri boutique la mega-evenimente cu 50.000+ participanți. Experiență la Electric Castle, Untold, și alte festivaluri majore.",
    descEn:
      "From boutique festivals to mega-events with 50,000+ attendees. Experience at Electric Castle, Untold, and other major festivals.",
  },
  {
    icon: Building2,
    titleRo: "Evenimente Corporate",
    titleEn: "Corporate Events",
    descRo:
      "Conferințe, team building, petreceri corporate, gale. Servicii discrete și profesionale pentru business.",
    descEn:
      "Conferences, team building, corporate parties, galas. Discrete and professional services for business.",
  },
  {
    icon: Presentation,
    titleRo: "Conferințe & Expoziții",
    titleEn: "Conferences & Exhibitions",
    descRo:
      "Târguri, expoziții, conferințe internaționale. Soluții scalabile pentru evenimente B2B.",
    descEn:
      "Trade fairs, exhibitions, international conferences. Scalable solutions for B2B events.",
  },
  {
    icon: Trophy,
    titleRo: "Evenimente Sportive",
    titleEn: "Sports Events",
    descRo:
      "Maratoane, competiții, meciuri. Sistem rapid pentru flux mare de participanți.",
    descEn:
      "Marathons, competitions, matches. Fast system for high participant flow.",
  },
  {
    icon: Users,
    titleRo: "Teatru & Artă",
    titleEn: "Theater & Arts",
    descRo:
      "Teatre, opere, spectacole. Soluții permanente sau temporare pentru săli de spectacol.",
    descEn:
      "Theaters, operas, shows. Permanent or temporary solutions for performance venues.",
  },
  {
    icon: PartyPopper,
    titleRo: "Evenimente Private",
    titleEn: "Private Events",
    descRo:
      "Nunți, aniversări, petreceri private de amploare. Servicii personalizate pentru evenimente speciale.",
    descEn:
      "Weddings, anniversaries, large private parties. Customized services for special events.",
  },
];

export default async function IndustriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  unstable_setRequestLocale(locale);

  return (
    <>
      <Hero
        title={locale === "ro" ? "Industrii Deservite" : "Industries We Serve"}
        subtitle={
          locale === "ro"
            ? "Experiență vastă în diverse tipuri de evenimente. Adaptăm soluțiile la specificul fiecărei industrii."
            : "Vast experience across diverse event types. We adapt solutions to each industry's specifics."
        }
        variant="page"
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry, index) => {
              const Icon = industry.icon;
              return (
                <Card key={index} className="transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle>
                      {locale === "ro" ? industry.titleRo : industry.titleEn}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      {locale === "ro" ? industry.descRo : industry.descEn}
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
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold">
              {locale === "ro"
                ? "Capacitate Complet Scalabilă"
                : "Fully Scalable Capacity"}
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              {locale === "ro"
                ? "De la evenimente intime cu 100 de participanți până la festivaluri masive cu 12.000+ participanți. Infrastructura și echipa se adaptează la dimensiunea evenimentului tău."
                : "From intimate events with 100 attendees to massive festivals with 12,000+ participants. Infrastructure and team adapt to your event size."}
            </p>
            <div className="grid gap-8 sm:grid-cols-3">
              <div>
                <div className="mb-2 text-4xl font-bold text-primary">100+</div>
                <div className="text-sm text-muted-foreground">
                  {locale === "ro" ? "Evenimente mici" : "Small events"}
                </div>
              </div>
              <div>
                <div className="mb-2 text-4xl font-bold text-primary">
                  1,000+
                </div>
                <div className="text-sm text-muted-foreground">
                  {locale === "ro" ? "Evenimente medii" : "Medium events"}
                </div>
              </div>
              <div>
                <div className="mb-2 text-4xl font-bold text-primary">
                  12,000+
                </div>
                <div className="text-sm text-muted-foreground">
                  {locale === "ro" ? "Festivaluri mari" : "Large festivals"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <QuoteCTA
        variant="inline"
        heading={
          locale === "ro" ? "Evenimentul tău este unic" : "Your event is unique"
        }
        description={
          locale === "ro"
            ? "Personalizăm soluția pentru industria și dimensiunea ta"
            : "We customize the solution for your industry and size"
        }
        ctaLabel={locale === "ro" ? "Discută cu Noi" : "Talk to Us"}
        ctaHref={`/${locale}/contact`}
      />
    </>
  );
}
