import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction to guide the persona and output format
const SYSTEM_INSTRUCTION = `
You are an expert educational assistant specializing in summarizing video content.
Your task is to analyze the provided video or audio and generate a structured summary in Chinese (Simplified).

Rules:
1. Identify the core topic and main takeaway of the content.
2. Create a list of key points with timestamps (approximate or based on content flow).
3. The tone should be professional, concise, and easy to study from.
4. Output strictly in JSON format matching the schema provided.
`;

export const analyzeMedia = async (
  base64Data: string, 
  mimeType: string
): Promise<AnalysisResult> => {
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: "请分析这个视频/音频的核心内容。用中文总结，并提供带有时间戳的关键点列表。"
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A suitable title for the summary in Chinese" },
            summary: { type: Type.STRING, description: "A brief paragraph summarizing the entire video in Chinese" },
            points: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timestamp: { type: Type.STRING, description: "Timestamp in MM:SS format" },
                  content: { type: Type.STRING, description: "Description of the key point in Chinese" }
                },
                required: ["timestamp", "content"]
              }
            }
          },
          required: ["title", "summary", "points"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
