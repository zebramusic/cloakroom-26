import Link from "next/link";

interface DynamicFooterProps {
  locale: string;
}

export async function DynamicFooter({ locale }: DynamicFooterProps) {
  // For MVP, use simple static footer
  // Can be enhanced to read from DB in future

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Cloakroom Pro</h3>
            <p className="text-sm text-muted-foreground">
              {locale === "en"
                ? "Professional event cloakroom services"
                : "Servicii profesionale de garderobă pentru evenimente"}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              {locale === "en" ? "Services" : "Servicii"}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={locale === "en" ? "/en/servicii" : "/servicii"}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {locale === "en" ? "Event Cloakroom" : "Garderobă Evenimente"}
                </Link>
              </li>
              <li>
                <Link
                  href={locale === "en" ? "/en/shop" : "/shop"}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {locale === "en" ? "Equipment Shop" : "Magazin Echipamente"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              {locale === "en" ? "Company" : "Companie"}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={locale === "en" ? "/en/despre" : "/despre"}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {locale === "en" ? "About Us" : "Despre Noi"}
                </Link>
              </li>
              <li>
                <Link
                  href={locale === "en" ? "/en/portofoliu" : "/portofoliu"}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {locale === "en" ? "Portfolio" : "Portofoliu"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: contact@cloakroom.ro</li>
              <li>Tel: +40 123 456 789</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} Cloakroom Pro.{" "}
            {locale === "en"
              ? "All rights reserved."
              : "Toate drepturile rezervate."}
          </p>
        </div>
      </div>
    </footer>
  );
}
