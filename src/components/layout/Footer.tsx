"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

interface CompanySettings {
  companyName: string;
  tagline?: string;
  description?: string;
  address: string;
  phone: string;
  email: string;
  businessHours: string;
  socialNetworks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
  };
  legalInfo: {
    cui: string;
    regCom: string;
    bankName: string;
    iban: string;
    swift?: string;
  };
  logo?: string;
}

interface FooterProps {
  locale: string;
  companySettings: CompanySettings | null;
}

export function Footer({ locale, companySettings }: FooterProps) {
  const t = useTranslations("nav");
  const currentYear = new Date().getFullYear();

  // Fallback values if no settings
  const companyName = companySettings?.companyName || "Garderobă Pro";
  const description = companySettings?.description || (locale === "ro"
    ? "Soluții profesionale de garderobă pentru evenimente de orice dimensiune."
    : "Professional cloakroom solutions for events of any size.");

  const socialNetworks = companySettings?.socialNetworks || {};
  const hasSocialNetworks = Object.values(socialNetworks).some(url => !!url);

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="text-xl font-bold text-primary-foreground">
                  G
                </span>
              </div>
              <span className="font-bold">{companyName}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
            {hasSocialNetworks && (
              <div className="flex space-x-4">
                {socialNetworks.facebook && (
                  <a
                    href={socialNetworks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Facebook className="h-5 w-5" />
                    <span className="sr-only">Facebook</span>
                  </a>
                )}
                {socialNetworks.instagram && (
                  <a
                    href={socialNetworks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Instagram className="h-5 w-5" />
                    <span className="sr-only">Instagram</span>
                  </a>
                )}
                {socialNetworks.linkedin && (
                  <a
                    href={socialNetworks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </a>
                )}
                {socialNetworks.twitter && (
                  <a
                    href={socialNetworks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Twitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                  </a>
                )}
                {socialNetworks.youtube && (
                  <a
                    href={socialNetworks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Youtube className="h-5 w-5" />
                    <span className="sr-only">YouTube</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Services Column */}
          <div>
            <h3 className="mb-4 font-semibold">{t("services")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={`/${locale}/servicii`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {locale === "ro" ? "Garderobă Evenimente" : "Event Cloakroom"}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/servicii`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {locale === "ro" ? "Shop B2B" : "B2B Shop"}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/servicii`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {locale === "ro" ? "Consultanță" : "Consulting"}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/industrii`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {t("industries")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="mb-4 font-semibold">
              {locale === "ro" ? "Companie" : "Company"}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={`/${locale}/despre`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/parteneri`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {t("partners")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/blog`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {t("blog")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Shop Column */}
          <div>
            <h3 className="mb-4 font-semibold">
              {locale === "ro" ? "Legal & Shop" : "Legal & Shop"}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={`/${locale}/shop`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {t("shop")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/intrebari`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {t("faq")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/termeni`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {locale === "ro"
                    ? "Termeni și Condiții"
                    : "Terms & Conditions"}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/confidentialitate`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {locale === "ro"
                    ? "Politica de Confidențialitate"
                    : "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/gdpr`}
                  className="text-muted-foreground hover:text-primary"
                >
                  GDPR
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {currentYear} Garderobă Pro. CUI: RO12345678.{" "}
            {locale === "ro"
              ? "Toate drepturile rezervate."
              : "All rights reserved."}
          </p>
          <p>
            {locale === "ro"
              ? "Dezvoltat cu ❤️ în România"
              : "Made with ❤️ in Romania"}
          </p>
        </div>
      </div>
    </footer>
  );
}
