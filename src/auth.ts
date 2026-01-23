import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { CredentialsSignin } from "next-auth";
import type { Role } from "./lib/auth/permissions";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
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

        // Lazy-load Mongoose to avoid bundling it in Edge Runtime (middleware)
        const connectDB = (await import("./lib/mongodb")).default;
        const { User } = await import("./lib/models");
        const bcrypt = await import("bcryptjs");

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

        // Lazy-load Mongoose to avoid bundling it in Edge Runtime (middleware)
        const connectDB = (await import("./lib/mongodb")).default;
        const { Customer } = await import("./lib/models-customer");
        const { verifyPassword } = await import("./lib/auth/customer-auth");

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
});
