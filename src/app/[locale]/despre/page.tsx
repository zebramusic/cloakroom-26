import { unstable_setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { getHeroSettings } from "@/lib/utils/hero-settings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuoteCTA } from "@/components/sections/QuoteCTA";
import { Target, Users, Award, Heart, Shield } from "lucide-react";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  unstable_setRequestLocale(locale);

  const heroSettings = await getHeroSettings("about", locale as "ro" | "en");

  return (
    <>
      <Hero
        title={
          heroSettings?.title ||
          (locale === "ro" ? "Despre Garderobă Pro" : "About Garderobă Pro")
        }
        subtitle={
          heroSettings?.subtitle ||
          (locale === "ro"
            ? "Pasiune pentru evenimente și atenție la detalii. De peste 10 ani aducem ordine și siguranță la cele mai mari evenimente din România."
            : "Passion for events and attention to detail. For over 10 years bringing order and safety to Romania's largest events.")
        }
        primaryCTA={heroSettings?.primaryCTA}
        secondaryCTA={heroSettings?.secondaryCTA}
        backgroundImage={heroSettings?.backgroundImage}
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
                  ? "Credem că primele și ultimele minute ale unui eveniment contează cel mai mult. Acolo începe și se încheie experiența participantului, iar o garderobă bine gândită poate face diferența dintre aglomerație și fluiditate, dintre stres și confort."
                  : "We believe the first and last minutes of an event matter most. That's where the attendee's experience begins and ends, and a well-designed cloakroom can make the difference between congestion and flow, between stress and comfort."}
              </p>
              <p>
                {locale === "ro"
                  ? "Din 2007, livrăm servicii de garderobă profesionistă pentru evenimente de amploare, cu experiență în peste 200 de producții majore, fiecare de minimum 2.000 de participanți. Am construit un sistem care funcționează impecabil în ritmul real al evenimentelor: rapid, ordonat, sigur."
                  : "Since 2007, we've been delivering professional cloakroom services for large-scale events, with experience in over 200 major productions, each with a minimum of 2,000 attendees. We've built a system that works flawlessly at the real pace of events: fast, organized, secure."}
              </p>
              <p>
                {locale === "ro"
                  ? "Am dezvoltat intern o soluție modulară și scalabilă, proiectată să se adapteze aproape oricărui spațiu și să crească odată cu nevoile evenimentului. Folosim un sistem de etichete perechi, unice pentru fiecare eveniment, personalizabile cu identitatea organizatorului, pentru un control clar și o operare fără fricțiuni — de la preluare până la predare."
                  : "We've developed an in-house modular and scalable solution, designed to adapt to almost any space and grow with the event's needs. We use a paired-tag system, unique for each event, customizable with the organizer's branding, for clear control and frictionless operation — from check-in to retrieval."}
              </p>
              <p>
                {locale === "ro"
                  ? "Operăm uzual până la 4.800 de iteme (haine, bagaje, accesorii), cu posibilitate de extindere până la 12.000, la cerere. Indiferent de dimensiune, promisiunea rămâne aceeași: flux fluent, organizare constantă și o experiență calmă pentru public."
                  : "We typically operate up to 4,800 items (clothing, luggage, accessories), with the possibility of scaling up to 12,000 on request. Regardless of size, the promise remains the same: smooth flow, consistent organization, and a calm experience for the audience."}
              </p>
              <p>
                {locale === "ro"
                  ? "Am fost prezenți la evenimente și în locații de referință din România și internațional, în orașe precum București, Cluj, Iași, Timișoara, Constanța, Sibiu și Londra."
                  : "We've been present at events and landmark venues in Romania and internationally, in cities such as Bucharest, Cluj, Iași, Timișoara, Constanța, Sibiu, and London."}
              </p>
              <p>
                {locale === "ro"
                  ? "Suntem garderoba care nu se vede, dar se simte: prin ordine, viteză și încredere. Pentru tine, înseamnă un detaliu rezolvat impecabil. Pentru participanți, înseamnă un eveniment care începe și se termină exact așa cum trebuie."
                  : "We're the cloakroom you don't see, but you feel: through order, speed, and trust. For you, it means a detail handled flawlessly. For attendees, it means an event that starts and ends exactly as it should."}
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
