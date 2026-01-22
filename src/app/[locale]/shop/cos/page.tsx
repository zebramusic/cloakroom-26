import { unstable_setRequestLocale } from "next-intl/server";
import { CartPageClient } from "./CartPageClient";

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  return <CartPageClient locale={locale} />;
}
