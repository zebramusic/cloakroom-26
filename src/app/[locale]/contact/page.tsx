"use client";

import { Hero } from "@/components/sections/Hero";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log("Form submitted");
  };

  return (
    <>
      <Hero
        title={locale === "ro" ? "Contactează-ne" : "Contact Us"}
        subtitle={
          locale === "ro"
            ? "Suntem aici să răspundem la toate întrebările tale"
            : "We're here to answer all your questions"
        }
        variant="page"
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {locale === "ro"
                      ? "Trimite-ne un Mesaj"
                      : "Send Us a Message"}
                  </CardTitle>
                  <CardDescription>
                    {locale === "ro"
                      ? "Completează formularul și îți răspundem în maximum 24 de ore"
                      : "Fill the form and we'll respond within 24 hours"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium"
                      >
                        {locale === "ro" ? "Nume *" : "Name *"}
                      </label>
                      <Input
                        id="name"
                        name="name"
                        required
                        placeholder={
                          locale === "ro" ? "Numele tău" : "Your name"
                        }
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium"
                      >
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="exemplu@email.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-2 block text-sm font-medium"
                      >
                        {locale === "ro" ? "Telefon" : "Phone"}
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+40 123 456 789"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="mb-2 block text-sm font-medium"
                      >
                        {locale === "ro" ? "Subiect *" : "Subject *"}
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        required
                        placeholder={
                          locale === "ro"
                            ? "Despre ce vrei să vorbim?"
                            : "What do you want to talk about?"
                        }
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="mb-2 block text-sm font-medium"
                      >
                        {locale === "ro" ? "Mesaj *" : "Message *"}
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        placeholder={
                          locale === "ro"
                            ? "Descrie-ne evenimentul tău sau pune-ne orice întrebare..."
                            : "Describe your event or ask us anything..."
                        }
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      {locale === "ro" ? "Trimite Mesaj" : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
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
                    href="mailto:contact@garderobapro.ro"
                    className="text-lg font-medium text-primary hover:underline"
                  >
                    contact@garderobapro.ro
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
                        {locale === "ro"
                          ? "Luni - Vineri, 9:00 - 18:00"
                          : "Monday - Friday, 9:00 - 18:00"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <a
                    href="tel:+40123456789"
                    className="text-lg font-medium text-primary hover:underline"
                  >
                    +40 123 456 789
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
                  <p className="text-lg font-medium">Cluj-Napoca, România</p>
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
