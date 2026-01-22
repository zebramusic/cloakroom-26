import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function AccountLayout({ children }: { children: ReactNode }) {
  // Wrap account pages with SessionProvider for useSession() hook
  return <SessionProvider>{children}</SessionProvider>;
}
