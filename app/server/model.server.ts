import { GoogleGenerativeAI } from "@google/generative-ai";

type GeminiModel =
    | "gemini-pro"
    | "gemini-pro-latest"
    | "gemini-pro-vision"
    | "gemini-1.5-pro"
    | "gemini-1.5-pro-latest";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

let model = genAI.getGenerativeModel({ model: "gemini-pro" });

const changeGeminiModel = async (geminiModel: GeminiModel) => {
    model = genAI.getGenerativeModel({ model: geminiModel });
};

export { model, changeGeminiModel };
