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
    console.log(`Generating ${language} paragraph via Groq...`);
    const groqResponse = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const content = groqResponse.choices[0]?.message?.content || "";
    if (content) return content;
    throw new Error("Empty response from Groq");
  } catch (error) {
    console.error("Groq error, trying OpenAI...", error);
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Faster and cheaper than 3.5-turbo
        messages: [{ role: "user", content: prompt }],
      });

      return response.choices[0]?.message?.content || "";
    } catch (oaError) {
      console.error("OpenAI error as well:", oaError);
      return "";
    }
  }
}

/**
 * OpenAI Text-to-Speech for Dictation Mode
 * Converts the paragraph into a high-quality audio stream for the user to listen and type.
 */
export async function getDictationAudio(text: string) {
  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova", // nova, shimmer, echo, onyx are available
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    return buffer;
  } catch (error) {
    console.error("OpenAI TTS Error:", error);
    return null;
  }
}
