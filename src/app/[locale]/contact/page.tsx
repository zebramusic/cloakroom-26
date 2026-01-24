import { Hero } from "@/components/sections/Hero";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";
import { getHeroSettings } from "@/lib/utils/hero-settings";
import { getCompanySettings } from "@/lib/utils/company-settings";
import { ContactForm } from "@/components/forms/ContactForm";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const heroSettings = await getHeroSettings('contact', locale as 'ro' | 'en');
  const companySettings = await getCompanySettings(locale as 'ro' | 'en');

  // Fallback values
  const email = companySettings?.email || "contact@garderobapro.ro";
  const phone = companySettings?.phone || "+40 123 456 789";
  const address = companySettings?.address || "Cluj-Napoca, România";
  const businessHours = companySettings?.businessHours || (locale === "ro" ? "Luni - Vineri, 9:00 - 18:00" : "Monday - Friday, 9:00 - 18:00");

  return (
    <>
      <Hero
        title={heroSettings?.title || (locale === "ro" ? "Contactează-ne" : "Contact Us")}
        subtitle={heroSettings?.subtitle || (
          locale === "ro"
            ? "Suntem aici să răspundem la toate întrebările tale"
            : "We're here to answer all your questions"
        )}
        primaryCTA={heroSettings?.primaryCTA}
        secondaryCTA={heroSettings?.secondaryCTA}
        backgroundImage={heroSettings?.backgroundImage}
        variant="page"
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <ContactForm locale={locale} />
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle>Email</CardTitle>
                      <CardDescription>
                        {locale === "ro"
                          ? "Scrie-ne oricând"
                          : "Write to us anytime"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <a
                    href={`mailto:${email}`}
                    className="text-lg font-medium text-primary hover:underline"
                  >
                    {email}
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle>
                        {locale === "ro" ? "Telefon" : "Phone"}
                      </CardTitle>
                      <CardDescription>
                        {businessHours}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <a
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    className="text-lg font-medium text-primary hover:underline"
                  >
                    {phone}
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle>
                        {locale === "ro" ? "Locație" : "Location"}
                      </CardTitle>
                      <CardDescription>
                        {locale === "ro" ? "Baza principală" : "Main base"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium">{address}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {locale === "ro"
                      ? "Ne deplasăm în toată țara pentru evenimente"
                      : "We travel nationwide for events"}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5">
                <CardHeader>
                  <CardTitle>
                    {locale === "ro"
                      ? "Programează o Întâlnire"
                      : "Schedule a Meeting"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {locale === "ro"
                      ? "Pentru discuții detaliate despre evenimente mari, putem programa o întâlnire video sau fizică."
                      : "For detailed discussions about large events, we can schedule a video or physical meeting."}
                  </p>
                  <Button variant="outline" className="w-full">
                    {locale === "ro" ? "Programează" : "Schedule"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
