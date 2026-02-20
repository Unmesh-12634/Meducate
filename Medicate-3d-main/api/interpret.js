
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Allow CORS helper
const allowCors = (fn) => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    return await fn(req, res);
};

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    if (!API_KEY) {
        return res.status(500).json({ error: "API Key missing in server environment" });
    }

    try {
        const { text, context } = req.body;
        if (!text || !context) {
            return res.status(400).json({ error: "Text and context are required" });
        }

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

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

        return res.status(200).json(parsed);
    } catch (error) {
        console.error("Interpret API Error:", error);
        return res.status(500).json({
            error: "Failed to interpret command",
            details: error.message || "Unknown error"
        });
    }
}

module.exports = allowCors(handler);
