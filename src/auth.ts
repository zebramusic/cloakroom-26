import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { CredentialsSignin } from "next-auth";
import connectDB from "./lib/mongodb";
import { User } from "./lib/models";
import { Customer } from "./lib/models-customer";
import { verifyPassword } from "./lib/auth/customer-auth";
import type { Role } from "./lib/auth/permissions";
import bcrypt from "bcryptjs";

export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/admin/login", // Admin sign in page
    // Don't set error page - let it be handled by the login forms
  },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: process.env.NODE_ENV === 'production',
  providers: [
    // Admin login
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        principalType: { label: "Principal Type", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new CredentialsSignin("Email and password are required");
        }

        // Only allow admin login via this provider
        if (credentials.principalType !== "admin") {
          throw new CredentialsSignin("Invalid login method");
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new CredentialsSignin("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          throw new CredentialsSignin("Invalid email or password");
        }

        if (!user.isActive) {
          throw new CredentialsSignin("Account is disabled");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.fullName,
          role: user.role,
          principalType: "admin",
        };
      },
    }),
    // Customer login
    CredentialsProvider({
      id: "customer-credentials",
      name: "Customer Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        principalType: { label: "Principal Type", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new CredentialsSignin("Email and password are required");
        }

        // Only allow customer login via this provider
        if (credentials.principalType !== "customer") {
          throw new CredentialsSignin("Invalid login method");
        }

        await connectDB();

        const normalizedEmail = (credentials.email as string).toLowerCase();

        const customer = await Customer.findOne({ 
          email: normalizedEmail,
        });

        if (!customer || !customer.passwordHash) {
          throw new CredentialsSignin("Invalid email or password");
        }

        // Skip email verification in development mode
        if (!customer.emailVerified && process.env.NODE_ENV !== 'development') {
          throw new CredentialsSignin("Please verify your email address before logging in");
        }

        const isPasswordValid = await verifyPassword(
          credentials.password as string,
          customer.passwordHash
        );

        if (!isPasswordValid) {
          throw new CredentialsSignin("Invalid email or password");
        }

        if (!customer.isActive) {
          throw new CredentialsSignin("Account is disabled");
        }

        // Update last login
        customer.lastLogin = new Date();
        await customer.save();

        return {
          id: customer._id.toString(),
          email: customer.email,
          name: customer.name,
          role: "customer", // Always customer role
          principalType: "customer",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as any).role as Role;
        token.principalType = (user as any).principalType as "admin" | "customer";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.principalType = token.principalType as "admin" | "customer";
      }
      return session;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
