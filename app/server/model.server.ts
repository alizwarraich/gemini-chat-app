import { GoogleGenerativeAI } from "@google/generative-ai";

type GeminiModel =
    | "gemini-1.0-pro" // Natural language tasks, multi-turn text and code chat, and code generation | Tunable | Text only
    | "gemini-1.5-flash" // Fast and versatile performance across a diverse variety of tasks | Tunable | All formats
    | "gemini-1.5-pro"; // Complex reasoning tasks such as code and text generation, text editing, problem solving, data extraction and generation | NOT tunable | All formats

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

let model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const changeGeminiModel = async (geminiModel: GeminiModel) => {
    model = genAI.getGenerativeModel({ model: geminiModel });
};

export { model, changeGeminiModel };
