import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, contact, whatsapp, email, password } = body;

    // Validate inputs
    if (!name || !contact || !whatsapp || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await prisma.student.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists.' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.student.create({
      data: {
        name,
        contact,
        whatsapp,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: 'Registration successful', userId: newUser.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { message: 'An error occurred during registration.' },
      { status: 500 }
    );
  }
}
