import { OpenAI } from "openai";
import { Groq } from "groq-sdk";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateParagraph(language: string, difficulty: string) {
  const prompt = `Generate a typing practice paragraph in ${language} for a typing exam. 
  Difficulty: ${difficulty}. 
  Length: 80-150 words. 
  Topic: General computer education or professional office work.
  The output should be ONLY the paragraph text.`;

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
