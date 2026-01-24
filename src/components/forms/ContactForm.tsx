"use client";

import { useState } from "react";
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

export function ContactForm({ locale }: { locale: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Implement form submission
    console.log("Form submitted");

    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          {locale === "ro" ? "Trimite-ne un Mesaj" : "Send Us a Message"}
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
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              {locale === "ro" ? "Nume *" : "Name *"}
            </label>
            <Input
              id="name"
              name="name"
              required
              placeholder={locale === "ro" ? "Numele tău" : "Your name"}
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
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
            <label htmlFor="phone" className="mb-2 block text-sm font-medium">
              {locale === "ro" ? "Telefon" : "Phone"}
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder={
                locale === "ro" ? "+40 xxx xxx xxx" : "+40 xxx xxx xxx"
              }
            />
          </div>

          <div>
            <label htmlFor="subject" className="mb-2 block text-sm font-medium">
              {locale === "ro" ? "Subiect *" : "Subject *"}
            </label>
            <Input
              id="subject"
              name="subject"
              required
              placeholder={
                locale === "ro"
                  ? "Ex: Ofertă pentru eveniment"
                  : "Ex: Quote for event"
              }
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-medium">
              {locale === "ro" ? "Mesaj *" : "Message *"}
            </label>
            <Textarea
              id="message"
              name="message"
              required
              rows={6}
              placeholder={
                locale === "ro"
                  ? "Spune-ne despre evenimentul tău..."
                  : "Tell us about your event..."
              }
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? locale === "ro"
                ? "Se trimite..."
                : "Sending..."
              : locale === "ro"
                ? "Trimite Mesaj"
                : "Send Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
