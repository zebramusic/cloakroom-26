import { unstable_setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { QuoteCTA } from "@/components/sections/QuoteCTA";
import { Search } from "lucide-react";

const faqCategories = [
  {
    categoryRo: "Servicii Generale",
    categoryEn: "General Services",
    faqs: [
      {
        questionRo: "Ce zone acoperiti?",
        questionEn: "What areas do you cover?",
        answerRo:
          "Activăm în toată România. Avem baza principală în Bacău, dar ne deplasăm pentru evenimente în orice colț al țării. Tariful include transportul echipamentelor și echipei.",
        answerEn:
          "We operate throughout Romania. Our main base is in Bacău, but we travel for events anywhere in the country. The fee includes transportation of equipment and team.",
      },
      {
        questionRo: "Cât timp în avans trebuie să vă contactăm?",
        questionEn: "How far in advance should we contact you?",
        answerRo:
          "Recomandăm cel puțin 2-4 săptămâni pentru evenimente mari. Pentru evenimente mici sau urgente putem răspunde și în 48 de ore, în funcție de disponibilitate.",
        answerEn:
          "We recommend at least 2-4 weeks for large events. For small or urgent events, we can respond within 48 hours, depending on availability.",
      },
      {
        questionRo: "Ce se întâmplă dacă se pierd obiecte?",
        questionEn: "What happens if items are lost?",
        answerRo:
          "Avem sistem Lost & Found organizat. În plus, fiecare obiect este identificat prin token numeric unic. În cei 10 ani de activitate, rata de pierderi este sub 0.01%.",
        answerEn:
          "We have an organized Lost & Found system. Additionally, each item is identified by a unique numeric token. In 10 years of operation, our loss rate is below 0.01%.",
      },
    ],
  },
  {
    categoryRo: "Prețuri & Plată",
    categoryEn: "Pricing & Payment",
    faqs: [
      {
        questionRo: "Cum se calculează prețul final?",
        questionEn: "How is the final price calculated?",
        answerRo:
          "Prețul depinde de: număr participanți, durata evenimentului, locația, serviciile solicitate (standard/VIP/backstage), și complexitatea setup-ului. Fiecare ofertă este personalizată.",
        answerEn:
          "Price depends on: number of attendees, event duration, location, requested services (standard/VIP/backstage), and setup complexity. Each quote is customized.",
      },
      {
        questionRo: "Când trebuie făcută plata?",
        questionEn: "When should payment be made?",
        answerRo:
          "50% avans la semnarea contractului, 50% cu 7 zile înainte de eveniment. Pentru parteneri recurenti oferim și plată la 30 de zile.",
        answerEn:
          "50% advance upon contract signing, 50% 7 days before the event. For recurring partners, we also offer 30-day payment terms.",
      },
      {
        questionRo: "Există costuri ascunse?",
        questionEn: "Are there hidden costs?",
        answerRo:
          "Nu. Oferta noastră include toate costurile: transport, setup, personal, echipamente, teardown. Singurele costuri suplimentare pot apărea dacă solicitați modificări majore în ultimul moment.",
        answerEn:
          "No. Our quote includes all costs: transport, setup, staff, equipment, teardown. The only additional costs may arise if you request major last-minute changes.",
      },
    ],
  },
  {
    categoryRo: "Logistică & Setup",
    categoryEn: "Logistics & Setup",
    faqs: [
      {
        questionRo: "Cât timp durează setup-ul?",
        questionEn: "How long does setup take?",
        answerRo:
          "Depinde de dimensiunea evenimentului. Pentru 500 de participanți: 2-3 ore. Pentru 5.000+: 6-8 ore. Ajungem cu suficient timp înainte pentru a fi gata la deschidere.",
        answerEn:
          "Depends on event size. For 500 attendees: 2-3 hours. For 5,000+: 6-8 hours. We arrive with enough time to be ready at opening.",
      },
      {
        questionRo: "Aveți propriile echipamente?",
        questionEn: "Do you have your own equipment?",
        answerRo:
          "Da, avem propriile rack-uri mobile, ghișee, bariere, semnalistică, token-uri. Nu depindem de echipamente împrumutate. Totul este profesional și standardizat.",
        answerEn:
          "Yes, we have our own mobile racks, counters, barriers, signage, tokens. We don't depend on borrowed equipment. Everything is professional and standardized.",
      },
      {
        questionRo: "Ce spațiu aveți nevoie?",
        questionEn: "What space do you need?",
        answerRo:
          "Depinde de numărul de participanți. În general: 20-30mp pentru 500 participanți, 50-100mp pentru 2.000+. Preferăm zone acoperite și securizate, dar ne adaptăm la orice spațiu.",
        answerEn:
          "Depends on attendee numbers. Generally: 20-30sqm for 500 attendees, 50-100sqm for 2,000+. We prefer covered and secured areas, but adapt to any space.",
      },
    ],
  },
  {
    categoryRo: "Personal & Siguranță",
    categoryEn: "Staff & Safety",
    faqs: [
      {
        questionRo: "Echipa este instruită?",
        questionEn: "Is the team trained?",
        answerRo:
          "Da. Toți membrii echipei trec prin training intern: proceduri, sistem de token-uri, comunicare cu participanții, gestionare situații de urgență. Avem supervizori cu experiență la fiecare eveniment.",
        answerEn:
          "Yes. All team members undergo internal training: procedures, token system, participant communication, emergency situation management. We have experienced supervisors at each event.",
      },
      {
        questionRo: "Ce protocoale de siguranță aveți?",
        questionEn: "What safety protocols do you have?",
        answerRo:
          "Sistem numeric duplicat pentru verificare, zonare clară public/staff, control acces, proceduri pentru obiecte de valoare, asigurare de răspundere civilă, Lost & Found organizat.",
        answerEn:
          "Duplicate numeric system for verification, clear public/staff zoning, access control, valuable item procedures, liability insurance, organized Lost & Found.",
      },
    ],
  },
];

export default async function FAQPage({
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
          locale === "ro" ? "Întrebări Frecvente" : "Frequently Asked Questions"
        }
        subtitle={
          locale === "ro"
            ? "Răspunsuri la cele mai comune întrebări despre serviciile noastre"
            : "Answers to the most common questions about our services"
        }
        variant="page"
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Search (future enhancement) */}
          <div className="mx-auto mb-12 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={
                  locale === "ro"
                    ? "Caută o întrebare..."
                    : "Search for a question..."
                }
                className="pl-10"
              />
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="mx-auto max-w-3xl space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="mb-6 text-2xl font-bold">
                  {locale === "ro" ? category.categoryRo : category.categoryEn}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.faqs.map((faq, faqIndex) => (
                    <AccordionItem
                      key={faqIndex}
                      value={`item-${categoryIndex}-${faqIndex}`}
                    >
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
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-2xl font-bold">
              {locale === "ro"
                ? "Nu ai găsit răspunsul?"
                : "Didn't find the answer?"}
            </h2>
            <p className="mb-6 text-muted-foreground">
              {locale === "ro"
                ? "Contactează-ne direct și îți răspundem în câteva ore"
                : "Contact us directly and we'll respond within hours"}
            </p>
          </div>
        </div>
      </section>

      <QuoteCTA
        variant="inline"
        heading={locale === "ro" ? "Hai să vorbim" : "Let's talk"}
        ctaLabel={locale === "ro" ? "Contactează-ne" : "Contact Us"}
        ctaHref={`/${locale}/contact`}
      />
    </>
  );
}
