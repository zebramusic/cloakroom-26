import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    console.log("Signup API called");
    const { email, password, fullName } = await request.json();
    console.log("Received data:", { email, fullName, passwordLength: password?.length });

    // Validate input
    if (!email || !password || !fullName) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      console.log("Password too short");
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected");

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log("User already exists");
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with customer role (admin assigns roles later)
    console.log("Creating user...");
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      fullName,
      role: 'customer',
      isActive: true,
    });

    console.log("User created successfully:", user._id);
    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
