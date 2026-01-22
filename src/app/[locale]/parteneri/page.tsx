import { unstable_setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { Card } from "@/components/ui/card";
import { QuoteCTA } from "@/components/sections/QuoteCTA";
import Image from "next/image";

// This would normally fetch from MongoDB
const partners = [
  { name: "Electric Castle", logo: "/placeholder-logo.svg", featured: true },
  { name: "Untold Festival", logo: "/placeholder-logo.svg", featured: true },
  { name: "Jazz in the Park", logo: "/placeholder-logo.svg", featured: true },
  { name: "ARTmania Festival", logo: "/placeholder-logo.svg", featured: false },
  { name: "Cluj Arena", logo: "/placeholder-logo.svg", featured: false },
  { name: "BT Arena", logo: "/placeholder-logo.svg", featured: false },
];

export default function PartnersPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  return (
    <>
      <Hero
        title={locale === "ro" ? "Partenerii Noștri" : "Our Partners"}
        subtitle={
          locale === "ro"
            ? "Au încredere în noi și ne-au ales pentru evenimentele lor cele mai importante"
            : "They trust us and chose us for their most important events"
        }
        variant="page"
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {locale === "ro"
                ? "Colaborăm cu cei mai importanți organizatori de evenimente din România. Încrederea lor este cea mai bună dovadă a calității serviciilor noastre."
                : "We collaborate with Romania's most important event organizers. Their trust is the best proof of our service quality."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
            {partners.map((partner, index) => (
              <Card
                key={index}
                className="flex items-center justify-center p-8 transition-shadow hover:shadow-lg"
              >
                <div className="text-center">
                  <div className="mb-2 flex h-20 items-center justify-center">
                    {/* Placeholder for logo */}
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="text-2xl font-bold">
                        {partner.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-medium">{partner.name}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold">
              {locale === "ro" ? "Devino Partener" : "Become a Partner"}
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              {locale === "ro"
                ? "Dacă organizezi evenimente recurente, oferim condiții speciale și parteneriate pe termen lung. Hai să discutăm cum putem colabora."
                : "If you organize recurring events, we offer special terms and long-term partnerships. Let's discuss how we can collaborate."}
            </p>
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <div className="mb-2 text-4xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">
                  {locale === "ro" ? "Parteneri activi" : "Active partners"}
                </div>
              </div>
              <div>
                <div className="mb-2 text-4xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">
                  {locale === "ro" ? "Rate de retenție" : "Retention rate"}
                </div>
              </div>
              <div>
                <div className="mb-2 text-4xl font-bold text-primary">10+</div>
                <div className="text-sm text-muted-foreground">
                  {locale === "ro" ? "Ani colaborare" : "Years collaboration"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <QuoteCTA
        variant="inline"
        heading={locale === "ro" ? "Începe Colaborarea" : "Start Collaboration"}
        description={
          locale === "ro"
            ? "Contactează-ne pentru a discuta despre un parteneriat pe termen lung"
            : "Contact us to discuss a long-term partnership"
        }
        ctaLabel={locale === "ro" ? "Contactează-ne" : "Contact Us"}
        ctaHref={`/${locale}/contact`}
      />
    </>
  );
}
