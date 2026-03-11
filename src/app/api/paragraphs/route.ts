import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateParagraph } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { language, difficulty } = await req.json();

    const content = await generateParagraph(language, difficulty);

    if (!content) {
      return NextResponse.json({ error: "Failed to generate paragraph" }, { status: 500 });
    }

    const paragraph = await prisma.typingParagraph.create({
      data: {
        language,
        difficulty,
        content,
      },
    });

    return NextResponse.json(paragraph);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const language = searchParams.get("language") || "English";
  
  try {
    const paragraphs = await prisma.typingParagraph.findMany({
      where: { language },
      take: 20,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(paragraphs);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
