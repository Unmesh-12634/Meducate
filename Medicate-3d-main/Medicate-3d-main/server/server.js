const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini API
const API_KEY = process.env.GOOGLE_AI_API_KEY;

if (!API_KEY) {
    console.error("CRITICAL ERROR: GOOGLE_AI_API_KEY is missing in .env file");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

// Routes

// 1. Chat Endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ text });
    } catch (error) {
        console.error("Chat API Error:", error);
        res.status(500).json({
            error: "Failed to generate response",
            details: error.message
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
