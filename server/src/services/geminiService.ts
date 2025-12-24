import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY || "");

export const analyzeImageForWishes = async (imageBuffer: Buffer, mimeType: string) => {

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
            You are an advanced OCR AI for Santa's workshop. 
            Analyze this image of a handwritten letter to Santa.
            
            Extract the following information:
            1. The name of the person sending the letter (look for "Love, [Name]", "From [Name]", "I am [Name]", or signature). If unknown, return "Unknown Child".
            2. The specific "wish" or gift request found in the text.
            3. The sentiment or tone of the letter (e.g., "Polite", "Excited", "Demanding", "Sweet").

            Return ONLY a valid JSON object with the following structure:
            {
                "personName": "string",
                "wish": "string",
                "sentiment": "string",
                "confidence": number (0-1)
            }
            Do not include markdown formatting like \`\`\`json. Just the raw JSON string.
        `;

        const imagePart = {
            inlineData: {
                data: imageBuffer.toString("base64"),
                mimeType,
            },
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(cleanText);

    } catch (error: any) {
        throw new Error(`Failed to analyze image with AI: ${error.message || error}`);
    }
};
