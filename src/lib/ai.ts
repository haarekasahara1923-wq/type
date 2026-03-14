import { OpenAI } from "openai";
import { Groq } from "groq-sdk";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateParagraph(language: string, difficulty: string) {
  const prompt = `Generate a long typing practice paragraph in ${language} for a professional typing examination. 
  Difficulty: ${difficulty}. 
  Length: 200-300 words. 
  Topic: Professional workplace scenarios, computer technology, or academic literature.
  The content must be continuous and flowing, avoiding lists or bullet points. 
  Output ONLY the paragraph text without any headers or quotes.`;


  try {
    // Try Groq first (faster)
    const groqResponse = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "mixtral-8x7b-32768",
    });

    return groqResponse.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Groq error, trying OpenAI...", error);
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0]?.message?.content || "";
  }
}
