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
import { Target, Users, Award, Heart, Shield } from "lucide-react";

export default function AboutPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  return (
    <>
      <Hero
        title={locale === "ro" ? "Despre Garderobă Pro" : "About Garderobă Pro"}
        subtitle={
          locale === "ro"
            ? "Pasiune pentru evenimente și atenție la detalii. De peste 10 ani aducem ordine și siguranță la cele mai mari evenimente din România."
            : "Passion for events and attention to detail. For over 10 years bringing order and safety to Romania's largest events."
        }
        variant="page"
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold">
              {locale === "ro" ? "Povestea Noastră" : "Our Story"}
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                {locale === "ro"
                  ? "Am început în 2014 cu o idee simplă: evenimentele trebuie să fie sigure și fără griji pentru participanți. Prima noastră garderobă a fost la un festival cu 500 de oameni. Astăzi gestionăm evenimente cu peste 12.000 de participanți."
                  : "We started in 2014 with a simple idea: events should be safe and worry-free for attendees. Our first cloakroom was at a festival with 500 people. Today we manage events with over 12,000 participants."}
              </p>
              <p>
                {locale === "ro"
                  ? "În cei peste 10 ani de experiență, am lucrat la festivaluri majore precum Electric Castle, Untold, și sute de alte evenimente din toată țara. Am dezvoltat sisteme eficiente, am investit în echipamente profesionale, și am antrenat echipe dedicate."
                  : "In over 10 years of experience, we've worked at major festivals like Electric Castle, Untold, and hundreds of other events nationwide. We've developed efficient systems, invested in professional equipment, and trained dedicated teams."}
              </p>
              <p>
                {locale === "ro"
                  ? "Nu suntem doar un serviciu de garderobă. Suntem parteneri pentru organizatorii de evenimente care vor să ofere o experiență completă participanților lor."
                  : "We're not just a cloakroom service. We're partners for event organizers who want to provide a complete experience to their attendees."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            {locale === "ro" ? "Valorile Noastre" : "Our Values"}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Shield className="h-6 w-6" />
                </div>
                <CardTitle>
                  {locale === "ro" ? "Siguranță" : "Safety"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {locale === "ro"
                    ? "Proceduri stricte și sisteme verificate pentru protecția bunurilor participanților."
                    : "Strict procedures and verified systems to protect attendees' belongings."}
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Target className="h-6 w-6" />
                </div>
                <CardTitle>
                  {locale === "ro" ? "Profesionalism" : "Professionalism"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {locale === "ro"
                    ? "Echipă instruită, echipamente de calitate, execuție impecabilă de fiecare dată."
                    : "Trained team, quality equipment, impeccable execution every time."}
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle>
                  {locale === "ro" ? "Parteneriat" : "Partnership"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {locale === "ro"
                    ? "Nu suntem doar furnizori, suntem parteneri care înțeleg viziunea ta."
                    : "We're not just suppliers, we're partners who understand your vision."}
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Heart className="h-6 w-6" />
                </div>
                <CardTitle>{locale === "ro" ? "Pasiune" : "Passion"}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {locale === "ro"
                    ? "Iubim evenimentele și dedicația noastră se vede în fiecare detaliu."
                    : "We love events and our dedication shows in every detail."}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold">
              {locale === "ro" ? "Cifrele Noastre" : "Our Numbers"}
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              <div>
                <div className="mb-2 text-5xl font-bold text-primary">10+</div>
                <div className="text-sm text-muted-foreground">
                  {locale === "ro"
                    ? "Ani de experiență"
                    : "Years of experience"}
                </div>
              </div>
              <div>
                <div className="mb-2 text-5xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">
                  {locale === "ro"
                    ? "Evenimente realizate"
                    : "Events completed"}
                </div>
              </div>
              <div>
                <div className="mb-2 text-5xl font-bold text-primary">2M+</div>
                <div className="text-sm text-muted-foreground">
                  {locale === "ro"
                    ? "Participanți serviți"
                    : "Attendees served"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <QuoteCTA
        variant="inline"
        heading={
          locale === "ro" ? "Hai să lucrăm împreună" : "Let's work together"
        }
        description={
          locale === "ro"
            ? "Devenim parteneri pentru evenimentul tău"
            : "We become partners for your event"
        }
        ctaLabel={locale === "ro" ? "Contactează-ne" : "Contact Us"}
        ctaHref={`/${locale}/contact`}
      />
    </>
  );
}
