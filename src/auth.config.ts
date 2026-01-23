import type { NextAuthConfig } from "next-auth";

// Auth configuration without Mongoose imports (safe for Edge Runtime)
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  trustHost: true,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = auth?.user?.principalType === 'admin';
      const isCustomer = auth?.user?.principalType === 'customer';
      
      const isOnAdminRoute = nextUrl.pathname.startsWith('/admin');
      const isOnAccountRoute = nextUrl.pathname.startsWith('/account');
      
      const publicAdminRoutes = ['/admin/login', '/admin/signup', '/admin/forgot-password', '/admin/reset-password'];
      const publicAccountRoutes = ['/account/login', '/account/signup', '/account/forgot-password', '/account/reset-password', '/account/verify-email'];
      
      // Admin routes
      if (isOnAdminRoute) {
        const isPublicAdminRoute = publicAdminRoutes.some(route => nextUrl.pathname === route);
        
        if (isPublicAdminRoute) {
          // Redirect logged-in admins away from login page
          if (isAdmin) {
            return Response.redirect(new URL('/admin', nextUrl));
          }
          return true;
        }
        
        // Require admin authentication
        if (!isAdmin) {
          return false; // Will redirect to signIn page
        }
        
        return true;
      }
      
      // Account routes
      if (isOnAccountRoute) {
        const isPublicAccountRoute = publicAccountRoutes.some(route => nextUrl.pathname === route);
        
        if (isPublicAccountRoute) {
          // Redirect logged-in customers away from login page
          if (isCustomer) {
            return Response.redirect(new URL('/shop', nextUrl));
          }
          return true;
        }
        
        // Require customer authentication
        if (!isCustomer) {
          const loginUrl = new URL('/account/login', nextUrl);
          loginUrl.searchParams.set('redirect', nextUrl.pathname);
          return Response.redirect(loginUrl);
        }
        
        return true;
      }
      
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as any).role;
        token.principalType = (user as any).principalType;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
        session.user.principalType = token.principalType as any;
      }
      return session;
    },
  },
  providers: [], // Providers will be added in auth.ts
} satisfies NextAuthConfig;
