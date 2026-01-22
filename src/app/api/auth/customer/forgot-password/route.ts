import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Customer } from '@/lib/models-customer';
import { generateTokenWithExpiry, validateEmail } from '@/lib/auth/customer-auth';
import { sendEmail } from '@/lib/email';

// Rate limiting
const resetAttempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Rate limit: 3 requests per 15 minutes per IP
    const now = Date.now();
    const attempts = resetAttempts.get(ip);
    if (attempts && attempts.count >= 3 && now < attempts.resetAt) {
      return NextResponse.json(
        { error: 'Too many reset attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const { email } = await request.json();

    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const customer = await Customer.findOne({ email: email.toLowerCase() });

    // Always return success even if customer not found (security best practice)
    if (!customer) {
      console.log('[PASSWORD RESET] Customer not found:', email);
      return NextResponse.json({
        message: 'If an account exists with this email, you will receive password reset instructions.',
      });
    }

    if (!customer.isActive) {
      console.log('[PASSWORD RESET] Inactive customer:', email);
      return NextResponse.json({
        message: 'If an account exists with this email, you will receive password reset instructions.',
      });
    }

    // Generate reset token (valid for 1 hour)
    const { token: passwordResetToken, expires: passwordResetExpires } = 
      generateTokenWithExpiry(1);

    customer.passwordResetToken = passwordResetToken;
    customer.passwordResetExpires = passwordResetExpires;
    await customer.save();

    // Send reset email (non-blocking)
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/account/reset-password?token=${passwordResetToken}`;
    
    sendEmail({
      to: customer.email,
      subject: 'Resetare parolă - Garderobă Pro',
      html: `
        <h2>Resetare Parolă</h2>
        <p>Salut ${customer.name},</p>
        <p>Am primit o cerere de resetare a parolei pentru contul tău. Fă click pe butonul de mai jos pentru a seta o parolă nouă:</p>
        <p><a href="${resetUrl}" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Resetează Parola</a></p>
        <p>Link-ul este valabil 1 oră.</p>
        <p>Dacă nu ai solicitat resetarea parolei, te rugăm să ignori acest email și parola ta va rămâne neschimbată.</p>
        <br>
        <p>Cu stimă,<br>Echipa Garderobă Pro</p>
      `,
    }).catch((emailError) => {
      console.error('[EMAIL ERROR - Non-blocking]', emailError.message || emailError);
      console.log('[RESET URL]', resetUrl);
    });

    // Update rate limit
    resetAttempts.set(ip, { count: (attempts?.count || 0) + 1, resetAt: now + 900000 });

    console.log('[PASSWORD RESET TOKEN SENT]', { 
      customerId: customer._id, 
      email: customer.email,
      resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : '[hidden]'
    });

    return NextResponse.json({
      message: 'If an account exists with this email, you will receive password reset instructions.',
    });
  } catch (error) {
    console.error('[FORGOT PASSWORD ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request. Please try again.' },
      { status: 500 }
    );
  }
}
