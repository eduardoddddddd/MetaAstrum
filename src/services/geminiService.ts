import { GoogleGenAI } from "@google/genai";
import { ChartData, ProfectionData, FirdariaPeriod } from "../types";

function getAI() {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) return null;
  try {
    return new GoogleGenAI({ apiKey });
  } catch {
    return null;
  }
}

export async function getGlobalInterpretation(data: ChartData, type: string) {
  try {
    const ai = getAI();
    if (!ai) return "Interpretación IA no disponible (configura GEMINI_API_KEY).";
    const prompt = `Actúa como un astrólogo profesional experto en astrología clásica y helenística. 
    Analiza los siguientes datos técnicos de una ${type} y proporciona un detalle global elegante y profundo en español.
    
    DATOS:
    Planetas: ${JSON.stringify(data.planets)}
    Casas: ${JSON.stringify(data.houses)}
    Aspectos: ${JSON.stringify(data.aspects)}
    Ascendente: ${data.ascendant.sign} a ${data.ascendant.degree}°
    
    INSTRUCCIONES:
    - Usa un tono profesional, místico pero serio.
    - No uses listas, escribe párrafos fluidos.
    - Enfócate en la síntesis de la personalidad y el destino.
    - Máximo 300 palabras.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
    });

    return response.text || "No se pudo generar la interpretación en este momento.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Error al conectar con el motor de interpretación.";
  }
}

export async function getTechniqueInterpretation(technique: string, technicalData: any) {
  try {
    const ai = getAI();
    if (!ai) return "";
    const prompt = `Explica la siguiente técnica astrológica (${technique}) basada en estos datos: ${JSON.stringify(technicalData)}.
    Proporciona un texto breve, profesional y elegante en español que explique qué significa este período o configuración para el consultante.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
    });

    return response.text || "";
  } catch (error) {
    return "";
  }
}
