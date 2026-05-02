import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export const getGeminiModel = (modelName = "gemini-2.5-flash") => {
  if (!genAI) throw new Error("Gemini API key is not configured.");
  return genAI.getGenerativeModel({ model: modelName });
};
