import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Attempt a simple query to check DB connectivity
    const studentCount = await prisma.student.count();
    
    return NextResponse.json({
      status: 'ok',
      message: 'Database connection successful',
      count: studentCount,
      env: {
        DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
        NODE_ENV: process.env.NODE_ENV,
        HAS_PRISMA_LIB: process.env.PRISMA_QUERY_ENGINE_LIBRARY ? 'YES' : 'NO'
      }
    });
  } catch (error) {
    console.error('Database Connectivity Error:', error);
    
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown DB error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
