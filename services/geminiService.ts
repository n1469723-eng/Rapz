
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getSmartPricing(
  origin: string, 
  destination: string, 
  description: string
): Promise<{ suggestedPrice: number; estimatedTime: string; reasoning: string }> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Calcule um valor justo (em Reais) e tempo estimado para uma entrega de ${description} saindo de ${origin} para ${destination}. Considere que o serviço é via motoboy.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedPrice: { type: Type.NUMBER },
            estimatedTime: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          },
          required: ["suggestedPrice", "estimatedTime", "reasoning"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Error calling Gemini:", error);
    // Fallback static pricing logic
    return {
      suggestedPrice: 12.50,
      estimatedTime: "25-35 min",
      reasoning: "Cálculo baseado em distância média estimada."
    };
  }
}

export async function getMarketInsights(): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Dê uma dica curta de 1 frase para um entregador ou dono de delivery para aumentar a eficiência de entregas hoje no Brasil.",
      config: {
        systemInstruction: "Você é um especialista em logística de entregas rápidas.",
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text.trim();
  } catch (error) {
    return "Mantenha a manutenção da moto em dia para evitar atrasos.";
  }
}
