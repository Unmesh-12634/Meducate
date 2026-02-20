const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const fs = require('fs');

// Point dotenv to the root directory .env if not found in server
const envPath = fs.existsSync(path.join(__dirname, '.env'))
    ? path.join(__dirname, '.env')
    : path.join(__dirname, '../.env');
dotenv.config({ path: envPath });

const app = express();
const PORT = process.env.PORT || 5000;

// Force restart trigger
// Middleware
app.use(cors());
app.use(express.json());

// Logging (Simplified)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

// Initialize Gemini API
const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY; // Support both names

if (!API_KEY) {
    console.error("CRITICAL ERROR: GEMINI_API_KEY is missing in .env file");
}
const genAI = new GoogleGenerativeAI(API_KEY);
// Use gemini-1.0-pro as a reliable fallback
// Use reliable latest alias
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });


// Routes
// 1. Interpret Command Endpoint
app.post('/api/interpret', async (req, res) => {
    try {
        const { text, context } = req.body;

        if (!text || !context) {
            return res.status(400).json({ error: "Text and context are required" });
        }

        const prompt = `
        You are Jarvis, an advanced AI Surgical Assistant.
        Current Context: ${context}.
        User Input: "${text}"

        Your job is to classify this input into one of two categories:
        1. ACTION: The user wants to control the simulator (rotate, zoom, change tool, change mode, select organ).
        2. RESPONSE: The user is asking a question or making conversation.

        Available Actions (JSON format):
        - { "action": "ROTATE", "params": { "direction": "LEFT" | "RIGHT" | "UP" | "DOWN" } }
        - { "action": "ZOOM", "params": { "direction": "IN" | "OUT" } }
        - { "action": "SET_TOOL", "params": { "tool": "Scalpel" | "Forceps" | "Retractor" | "None" } }
        - { "action": "SET_MODE", "params": { "mode": "normal" | "dissection" | "pathology" } }
        - { "action": "RESET_VIEW", "params": {} }
        
        If it's an ACTION, return ONLY the raw JSON object. 
        Example: { "type": "ACTION", "action": "ROTATE", "params": { "direction": "LEFT" }, "explanation": "Rotating left as requested." }

        If it's a RESPONSE (question/chat), return a JSON with type RESPONSE.
        Example: { "type": "RESPONSE", "text": "The aorta is the main artery..." }

        Keep responses concise (under 2 sentences).
        RETURN ONLY JSON. DO NOT USE MARKDOWN BLOCKS.
      `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const output = response.text();
        const cleanJson = output.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);

        res.json(parsed);
    } catch (error) {
        console.error("Interpret API Error:", error);
        res.status(500).json({
            error: "Failed to interpret command",
            details: error.message
        });
    }
});

// Language system instructions for multilingual support
const LANGUAGE_INSTRUCTIONS = {
    hi: `You are MediBot, an AI-powered medical learning assistant. 
CRITICAL: You MUST respond ONLY in Hindi language using Devanagari script (हिन्दी). 
Do not use any English words except for medical terms that have no Hindi equivalent.
Keep explanations clear, educational, and suitable for medical students.`,
    ta: `You are MediBot, an AI-powered medical learning assistant.
CRITICAL: You MUST respond ONLY in Tamil language using Tamil script (தமிழ்).
Do not use any English words except for medical terms that have no Tamil equivalent.
Keep explanations clear, educational, and suitable for medical students.`,
    en: `You are MediBot, an expert AI medical learning assistant for MeduCate.
You help medical students understand complex medical concepts clearly and accurately.
Provide educational, cited, and helpful responses. Use markdown formatting where helpful.
Always encourage further study and remind students to verify critical information.`,
};

// 1. Chat Endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { prompt, language = 'en' } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        const systemInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.en;
        const fullPrompt = `${systemInstruction}\n\nUser Question: ${prompt}`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        res.json({ text });
    } catch (error) {
        console.error("Chat API Error:", error);
        res.status(500).json({
            error: "Failed to generate response",
            details: error.message || "Unknown error"
        });
    }
});



// Health check
app.get('/', (req, res) => {
    res.send('Meducate AI Server is Running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
