import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // 1. Check if prisma client exists
    if (!prisma) {
      console.error("[Signup API] Prisma client is NULL. Module loading likely failed.");
      return NextResponse.json({ 
        message: "Database Client Error", 
        details: "Prisma client failed to initialize. Check engine paths." 
      }, { status: 500 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    const { name, contact, whatsapp, email } = body;

    // Validate required fields
    if (!name || !contact) {
      return NextResponse.json(
        { message: 'Name aur Mobile Number zaroori hai.' },
        { status: 400 }
      );
    }

    const cleanContact = contact.trim().replace(/\D/g, '');
    if (cleanContact.length < 10) {
      return NextResponse.json(
        { message: 'Sahi Mobile Number daalo (10 digit).' },
        { status: 400 }
      );
    }

    // Wrap DB heavy calls in their own try-catch
    try {
      const existingByContact = await prisma.student.findUnique({
        where: { contact: cleanContact },
      });

      if (existingByContact) {
        return NextResponse.json(
          { message: 'Yeh Mobile Number pehle se register hai. Sign In karein.' },
          { status: 400 }
        );
      }

      const newUser = await prisma.student.create({
        data: {
          name: name.trim(),
          contact: cleanContact,
          whatsapp: whatsapp?.trim() || null,
          email: email?.trim().toLowerCase() || null,
          password: null,
        },
      });

      return NextResponse.json(
        { message: 'Registration successful', userId: newUser.id },
        { status: 201 }
      );
    } catch (dbError: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = dbError as any;
      console.error('Signup Database Error:', error);
      
      // Handle Prisma Unique Constraint Errors
      if (error.code === 'P2002') {
        const target = error.meta?.target || [];
        if (Array.isArray(target) && target.includes('email')) {
          return NextResponse.json(
            { message: 'Yeh Email pehle se register hai. Doosra email use karein ya bina email ke join karein.' },
            { status: 400 }
          );
        }
        if (Array.isArray(target) && target.includes('contact')) {
          return NextResponse.json(
            { message: 'Yeh Mobile Number pehle se register hai. Sign In karein.' },
            { status: 400 }
          );
        }
        return NextResponse.json(
          { message: 'Kuch information pehle se register hai (Email/Mobile).' },
          { status: 400 }
        );
      }

      return NextResponse.json({ 
        message: "Database me entry nahi ho paa rahi.",
        details: error.message,
        code: error.code 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Registration Critical Failure:', error);
    return NextResponse.json(
      { 
        message: "Server internal error occur hui.",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
