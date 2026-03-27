import { OpenAI } from "openai";
import { Groq } from "groq-sdk";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateParagraph(language: string, difficulty: string, type: string = "full_text") {
  let prompt = "";
  
  if (type === "beginner") {
    prompt = `Generate a sequence of ${language === 'Hindi' ? 'Hindi Mangal characters' : 'characters'} for a BEGINNER typing drill. 
    Format: 3 characters followed by a semicolon and space. Repeat this pattern for about 100-150 groups. 
    Examples: ${language === 'Hindi' ? 'कखग; कखग; कखग; ' : 'asd; asd; asd; '}. 
    Focus on home row keys if possible. 
    Output ONLY the characters.`;
  } else if (type === "intermediate") {
    prompt = `Generate a sequence of 5-6 random characters (not necessarily words) for an INTERMEDIATE typing drill in ${language}. 
    Format: 5-6 characters followed by a semicolon and space. Repeat for 100 groups. 
    Output ONLY text.`;
  } else if (type === "short_words") {
    prompt = `Generate a large block of SHORT words (2-4 characters) in ${language} for typing practice. 
    Words must be simple and common. Repeat and mix them for about 400-500 words total. 
    Output ONLY text.`;
  } else if (type === "long_words") {
    prompt = `Generate a large block of MEDIUM to LONG words (5-8 characters) in ${language} for advanced typing practice. 
    Repeat and mix them for about 400-500 words total. 
    Output ONLY text.`;
  } else {
    // Full text - multi subject
    const subjects = ["History of World", "Modern Politics", "Inspirational Stories", "Scientific Discoveries", "Global Economy", "Environmental Conservation", "Classical Literature"];
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    
    prompt = `Generate a VERY LONG (around 1000 words) typing practice text in ${language}. 
    Topic: ${subject}. 
    Tone: Engaging and professional. 
    Format: Continuous flowing text without paragraph breaks, headers, or lists. 
    Strictness: MUST be around 1000 words. 
    Output ONLY the text.`;
  }

  try {
    console.log(`Generating ${language} ${type} text via Groq...`);
    if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY is missing");
    
    const groqResponse = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.8, // Slightly higher for more variety
      max_tokens: 4096, // Increased for 1000 words
    });

    const content = groqResponse.choices[0]?.message?.content || "";
    if (content) return content;
    throw new Error("Groq returned empty content");
  } catch (error) {
    console.error("Groq fail:", error);
    
    try {
      if (!process.env.OPEN_AI_API_KEY) throw new Error("OPEN_AI_API_KEY is missing");
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4096,
      });

      const content = response.choices[0]?.message?.content || "";
      if (content) return content;
      throw new Error("OpenAI returned empty content");
    } catch (oaError) {
      console.error("AI Generation Critical Failure:", oaError);
      throw new Error(`AI Providers failed. Groq: ${error instanceof Error ? error.message : 'Unknown'}. OpenAI: ${oaError instanceof Error ? oaError.message : 'Unknown'}`);
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
