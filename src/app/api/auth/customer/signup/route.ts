import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Customer } from '@/lib/models-customer';
import { hashPassword, generateTokenWithExpiry, validateEmail, validatePassword } from '@/lib/auth/customer-auth';
import { sendEmail } from '@/lib/email';

// Rate limiting (simple in-memory, use Redis in production)
const signupAttempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Rate limit: 3 signups per hour per IP
    const now = Date.now();
    const attempts = signupAttempts.get(ip);
    if (attempts && attempts.count >= 3 && now < attempts.resetAt) {
      return NextResponse.json(
        { error: 'Too many signup attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const { email, password, name, companyName, phone } = await request.json();

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      return NextResponse.json(
        { error: passwordCheck.error },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email: email.toLowerCase() });
    if (existingCustomer) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Generate email verification token
    const { token: emailVerificationToken, expires: emailVerificationExpires } = 
      generateTokenWithExpiry(24);

    // Create customer
    const customer = await Customer.create({
      email: email.toLowerCase(),
      passwordHash,
      emailVerificationToken,
      emailVerificationExpires,
      emailVerified: false,
      name,
      companyName: companyName || undefined,
      phone: phone || undefined,
      localePreference: 'ro',
      isActive: true,
    });

    // Send verification email (non-blocking for dev, continues even if email fails)
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/account/verify-email?token=${emailVerificationToken}`;
    
    // Try to send email but don't fail signup if email service is down
    sendEmail({
      to: customer.email,
      subject: 'Verifică adresa de email - Garderobă Pro',
      html: `
        <h2>Bine ai venit la Garderobă Pro!</h2>
        <p>Salut ${customer.name},</p>
        <p>Pentru a-ți activa contul, te rugăm să verifici adresa de email făcând click pe linkul de mai jos:</p>
        <p><a href="${verificationUrl}" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Verifică Email</a></p>
        <p>Link-ul este valabil 24 de ore.</p>
        <p>Dacă nu ai creat acest cont, te rugăm să ignori acest email.</p>
        <br>
        <p>Cu stimă,<br>Echipa Garderobă Pro</p>
      `,
    }).catch((emailError) => {
      // Log email error but don't fail the signup
      console.error('[EMAIL ERROR - Non-blocking]', emailError.message || emailError);
      console.log('[VERIFICATION URL]', verificationUrl);
    });

    // Update rate limit
    signupAttempts.set(ip, { count: (attempts?.count || 0) + 1, resetAt: now + 3600000 });

    console.log('[CUSTOMER SIGNUP SUCCESS]', { 
      customerId: customer._id, 
      email: customer.email,
      verificationUrl: process.env.NODE_ENV === 'development' ? verificationUrl : '[hidden]'
    });

    return NextResponse.json(
      {
        message: 'Account created successfully. Please check your email to verify your account.',
        requiresVerification: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[CUSTOMER SIGNUP ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
