import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export interface PersonalityScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface PersonalityResult {
  archetype: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  growthTips: string[];
}

export async function getPersonalityAnalysis(scores: PersonalityScores): Promise<PersonalityResult> {
  const prompt = `Based on the following Big Five personality scores (on a scale of 1-5), generate a creative personality profile.
  Scores:
  - Openness: ${scores.openness}
  - Conscientiousness: ${scores.conscientiousness}
  - Extraversion: ${scores.extraversion}
  - Agreeableness: ${scores.agreeableness}
  - Emotional Stability (Inverse of Neuroticism): ${6 - scores.neuroticism}

  Create a unique "Archetype" name, a detailed summary of their persona, their top strengths, potential blind spots, and 3 actionable growth tips.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          archetype: { type: Type.STRING },
          description: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          growthTips: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["archetype", "description", "strengths", "weaknesses", "growthTips"],
      },
    },
  });

  if (!response.text) {
    throw new Error("Failed to generate personality analysis");
  }

  return JSON.parse(response.text.trim()) as PersonalityResult;
}
