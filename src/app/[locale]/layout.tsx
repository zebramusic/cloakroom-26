import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { CartStoreHydration } from "@/components/shared/CartStoreHydration";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <AuthProvider>
      <NextIntlClientProvider messages={messages}>
        <CartStoreHydration />
        <Header locale={locale} />
        <main>{children}</main>
        <Footer locale={locale} />
      </NextIntlClientProvider>
    </AuthProvider>
  );
}
