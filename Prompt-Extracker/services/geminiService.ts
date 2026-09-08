
import { GoogleGenAI } from "@google/genai";
import { BreakdownResult } from "../types";
import { GEMINI_MODEL } from "../constants";

export const SYSTEM_INSTRUCTION = `
You are a professional video cinematographer and AI prompt engineer.
Analyze the provided content and create a "Video Breakdown" for recreation.

Output format:
Title: [Creative Title]
Prompt: [One detailed cinematic paragraph]

The prompt must include: Lighting, environment, camera movement, action, character details, color palette, and art style. 
Requirements: Scene-by-scene accuracy, no missing scenes, no invented elements.
`;

// Helper to convert File to Base64 string
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Utility for exponential backoff retries with more aggressive waiting for quota issues
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 5,
  initialDelay = 5000 // 5 seconds initial delay for 429s
): Promise<T> {
  let delay = initialDelay;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const errorMessage = error?.message?.toLowerCase() || "";
      const isQuotaError = errorMessage.includes("429") || errorMessage.includes("quota");
      const isServerError = errorMessage.includes("500") || errorMessage.includes("503") || errorMessage.includes("deadline exceeded");

      if ((isQuotaError || isServerError) && i < maxRetries - 1) {
        // If it's a quota error, we wait even longer
        const waitTime = isQuotaError ? delay * (i + 1) : delay;
        console.warn(`Gemini API Quota/Error (retry ${i + 1}/${maxRetries}). Waiting ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        delay *= 1.5; 
        continue;
      }
      throw error;
    }
  }
  throw new Error("Maximum retries reached. The API quota is still full.");
}

/**
 * Generates a video/image breakdown using Gemini with improved retry logic.
 */
export const generateBreakdown = async (
  imageId: string, 
  base64Data: string, 
  mimeType: string,
  customApiKey?: string
): Promise<BreakdownResult> => {
  return retryWithBackoff(async () => {
    const apiKey = customApiKey?.trim() || process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API Key is missing. Please click 'API Key' in the header to enter your API key.");
    }

    const ai = new GoogleGenAI({ apiKey });

    const contents = {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        {
          text: "Break down this video into a title and a detailed prompt paragraph.",
        },
      ],
    };

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1, // Lower temperature for more stable results
      },
    });

    const text = response.text || "";
    
    const titleMatch = text.match(/Title:\s*(.+)/i);
    const promptMatch = text.match(/Prompt:\s*([\s\S]*)/i);

    const title = titleMatch ? titleMatch[1].trim() : "Analysis Result";
    const prompt = promptMatch ? promptMatch[1].trim() : text;

    return {
      imageId,
      title,
      prompt,
    };
  });
};
