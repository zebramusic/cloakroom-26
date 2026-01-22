"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "./DateRangePicker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface DateRange {
  from?: Date;
  to?: Date;
}

interface QuoteFormProps {
  locale: string;
  onSuccess?: () => void;
}

export function QuoteForm({ locale, onSuccess }: QuoteFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [attendees, setAttendees] = React.useState("500");

  const services = [
    {
      id: "cloakroom",
      labelRo: "Garderobă standard",
      labelEn: "Standard cloakroom",
    },
    { id: "vip", labelRo: "Servicii VIP", labelEn: "VIP services" },
    { id: "backstage", labelRo: "Backstage", labelEn: "Backstage" },
    { id: "bagcheck", labelRo: "Bag Check", labelEn: "Bag Check" },
    {
      id: "infrastructure",
      labelRo: "Infrastructură completă",
      labelEn: "Complete infrastructure",
    },
    { id: "lostfound", labelRo: "Lost & Found", labelEn: "Lost & Found" },
    {
      id: "other",
      labelRo: "Altele (specifică în descriere)",
      labelEn: "Other (specify in description)",
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      eventType: formData.get("eventType"),
      dateFrom: dateRange?.from?.toISOString(),
      dateTo: dateRange?.to?.toISOString(),
      attendees: parseInt(attendees),
      location: formData.get("location"),
      description: formData.get("description"),
      services: formData.getAll("services"),
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      company: formData.get("company"),
      role: formData.get("role"),
      budget: formData.get("budget"),
      referral: formData.get("referral"),
      honeypot: formData.get("honeypot"), // spam protection
    };

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quote");
      }

      const result = await response.json();

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(
          `/${locale}/cere-oferta/confirmare?email=${encodeURIComponent(data.email as string)}`,
        );
      }
    } catch (error) {
      console.error("Error submitting quote:", error);
      alert(
        locale === "ro"
          ? "A apărut o eroare. Te rugăm să încerci din nou."
          : "An error occurred. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Section 1: About Event */}
      <Card>
        <CardHeader>
          <CardTitle>
            {locale === "ro" ? "1. Despre Eveniment" : "1. About the Event"}
          </CardTitle>
          <CardDescription>
            {locale === "ro"
              ? "Informații de bază despre evenimentul tău"
              : "Basic information about your event"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="eventType">
              {locale === "ro" ? "Tip eveniment *" : "Event type *"}
            </Label>
            <Select name="eventType" required>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    locale === "ro"
                      ? "Selectează tipul evenimentului"
                      : "Select event type"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="festival">
                  {locale === "ro" ? "Festival muzical" : "Music festival"}
                </SelectItem>
                <SelectItem value="concert">
                  {locale === "ro" ? "Concert" : "Concert"}
                </SelectItem>
                <SelectItem value="conference">
                  {locale === "ro" ? "Conferință" : "Conference"}
                </SelectItem>
                <SelectItem value="corporate">
                  {locale === "ro" ? "Eveniment corporate" : "Corporate event"}
                </SelectItem>
                <SelectItem value="sports">
                  {locale === "ro" ? "Eveniment sportiv" : "Sports event"}
                </SelectItem>
                <SelectItem value="theater">
                  {locale === "ro" ? "Teatru/Artă" : "Theater/Arts"}
                </SelectItem>
                <SelectItem value="private">
                  {locale === "ro" ? "Eveniment privat" : "Private event"}
                </SelectItem>
                <SelectItem value="other">
                  {locale === "ro" ? "Altele" : "Other"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>
              {locale === "ro" ? "Perioada eveniment *" : "Event dates *"}
            </Label>
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              locale={locale}
            />
          </div>

          <div>
            <Label htmlFor="attendees">
              {locale === "ro"
                ? "Număr estimat participanți *"
                : "Estimated attendees *"}
            </Label>
            <div className="space-y-2">
              <Input
                id="attendees"
                name="attendees"
                type="range"
                min="100"
                max="12000"
                step="100"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                required
              />
              <div className="text-right text-sm text-muted-foreground">
                {attendees} {locale === "ro" ? "participanți" : "attendees"}
              </div>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {locale === "ro"
                ? "Estimarea poate fi aproximativă. O vom ajusta în ofertă."
                : "Estimate can be approximate. We'll adjust it in the quote."}
            </p>
          </div>

          <div>
            <Label htmlFor="location">
              {locale === "ro" ? "Locație *" : "Location *"}
            </Label>
            <Input
              id="location"
              name="location"
              required
              placeholder={
                locale === "ro"
                  ? "ex: Cluj Arena, Cluj-Napoca"
                  : "e.g., Cluj Arena, Cluj-Napoca"
              }
            />
          </div>

          <div>
            <Label htmlFor="description">
              {locale === "ro"
                ? "Descriere eveniment (opțional)"
                : "Event description (optional)"}
            </Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              placeholder={
                locale === "ro"
                  ? "Detalii suplimentare despre eveniment..."
                  : "Additional details about the event..."
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Services */}
      <Card>
        <CardHeader>
          <CardTitle>
            {locale === "ro" ? "2. Servicii Necesare" : "2. Required Services"}
          </CardTitle>
          <CardDescription>
            {locale === "ro"
              ? "Selectează toate serviciile de care ai nevoie"
              : "Select all services you need"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {services.map((service) => (
              <div key={service.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={service.id}
                  name="services"
                  value={service.id}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor={service.id} className="font-normal">
                  {locale === "ro" ? service.labelRo : service.labelEn}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Your Details */}
      <Card>
        <CardHeader>
          <CardTitle>
            {locale === "ro" ? "3. Datele Tale" : "3. Your Details"}
          </CardTitle>
          <CardDescription>
            {locale === "ro"
              ? "Cum putem să te contactăm?"
              : "How can we contact you?"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">
              {locale === "ro" ? "Nume complet *" : "Full name *"}
            </Label>
            <Input
              id="name"
              name="name"
              required
              placeholder={locale === "ro" ? "Ion Popescu" : "John Doe"}
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="ion.popescu@exemplu.ro"
            />
          </div>

          <div>
            <Label htmlFor="phone">
              {locale === "ro" ? "Telefon *" : "Phone *"}
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="+40 123 456 789"
            />
          </div>

          <div>
            <Label htmlFor="company">
              {locale === "ro" ? "Companie (opțional)" : "Company (optional)"}
            </Label>
            <Input
              id="company"
              name="company"
              placeholder={
                locale === "ro" ? "Numele companiei" : "Company name"
              }
            />
          </div>

          <div>
            <Label htmlFor="role">
              {locale === "ro" ? "Funcție (opțional)" : "Role (optional)"}
            </Label>
            <Input
              id="role"
              name="role"
              placeholder={
                locale === "ro" ? "ex: Event Manager" : "e.g., Event Manager"
              }
            />
          </div>

          {/* Honeypot field for spam protection */}
          <input
            type="text"
            name="honeypot"
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />
        </CardContent>
      </Card>

      {/* Section 4: Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>
            {locale === "ro"
              ? "4. Preferințe (Opțional)"
              : "4. Preferences (Optional)"}
          </CardTitle>
          <CardDescription>
            {locale === "ro"
              ? "Ne ajută să personalizăm oferta"
              : "Helps us customize the quote"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="budget">
              {locale === "ro" ? "Buget estimativ" : "Estimated budget"}
            </Label>
            <Select name="budget">
              <SelectTrigger>
                <SelectValue
                  placeholder={locale === "ro" ? "Selectează" : "Select"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-5000">
                  {locale === "ro" ? "Sub 5.000 RON" : "Under 5,000 RON"}
                </SelectItem>
                <SelectItem value="5000-10000">5.000 - 10.000 RON</SelectItem>
                <SelectItem value="10000-20000">10.000 - 20.000 RON</SelectItem>
                <SelectItem value="20000-50000">20.000 - 50.000 RON</SelectItem>
                <SelectItem value="over-50000">
                  {locale === "ro" ? "Peste 50.000 RON" : "Over 50,000 RON"}
                </SelectItem>
                <SelectItem value="flexible">
                  {locale === "ro" ? "Flexibil" : "Flexible"}
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-1 text-sm text-muted-foreground">
              {locale === "ro"
                ? "Opțional. Ne ajută să personalizăm oferta."
                : "Optional. Helps us personalize the quote."}
            </p>
          </div>

          <div>
            <Label htmlFor="referral">
              {locale === "ro"
                ? "Cum ai auzit de noi?"
                : "How did you hear about us?"}
            </Label>
            <Select name="referral">
              <SelectTrigger>
                <SelectValue
                  placeholder={locale === "ro" ? "Selectează" : "Select"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="recommendation">
                  {locale === "ro" ? "Recomandare" : "Recommendation"}
                </SelectItem>
                <SelectItem value="previous">
                  {locale === "ro" ? "Client anterior" : "Previous customer"}
                </SelectItem>
                <SelectItem value="partner">
                  {locale === "ro" ? "Partener" : "Partner"}
                </SelectItem>
                <SelectItem value="other">
                  {locale === "ro" ? "Altele" : "Other"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {locale === "ro" ? "Se trimite..." : "Submitting..."}
          </>
        ) : (
          <>{locale === "ro" ? "Trimite Cererea" : "Submit Request"}</>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {locale === "ro"
          ? "Îți vom răspunde în maximum 24 de ore cu o ofertă personalizată"
          : "We'll respond within 24 hours with a personalized quote"}
      </p>
    </form>
  );
}
