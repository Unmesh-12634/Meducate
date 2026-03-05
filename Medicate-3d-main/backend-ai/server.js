const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
// We need a larger limit for receiving base64 image snapshots
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Initialize Gemini Client
// Requires GEMINI_API_KEY to be set in the environment (.env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_API_KEY_HERE");

app.get('/health', (req, res) => {
    res.status(200).send('Gemini Backend is healthy!');
});

app.post('/evaluate-surgery', async (req, res) => {
    try {
        const { screenshotBase64, contextPrompt } = req.body;

        if (!contextPrompt) {
            return res.status(400).json({ error: 'Missing contextPrompt' });
        }

        const systemInstruction = `You are an expert AI surgical tutor observing a student in a 3D medical simulator. 
You will receive a screenshot of their perspective and a text prompt describing the action they just took.
Provide helpful, professional, and concise feedback on their surgical technique. Let them know if they are using the correct instrument for the organ they are operating on. Do not hallucinate medical consequences, but be educational. Keep your response under 3 sentences for quick reading in VR.`;

        const contents = [];

        // If the frontend sent a screenshot payload
        if (screenshotBase64) {
            // Remove the data URI prefix if it exists (e.g. data:image/png;base64,.....)
            const base64Data = screenshotBase64.replace(/^data:image\/\w+;base64,/, "");

            contents.push({
                role: 'user',
                parts: [
                    { text: contextPrompt },
                    {
                        inlineData: {
                            mimeType: 'image/png', // Assuming PNG from canvas
                            data: base64Data
                        }
                    }
                ]
            });
        } else {
            contents.push({
                role: 'user',
                parts: [{ text: contextPrompt }]
            });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent({
            contents: contents,
            systemInstruction: systemInstruction,
            generationConfig: {
                temperature: 0.2, // Keep it deterministic and factual
            }
        });

        const response = await result.response;

        res.json({
            feedback: response.text()
        });

    } catch (error) {
        console.error('Error querying Gemini:', error);
        res.status(500).json({ error: 'Failed to process surgery evaluation', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Cloud Run Gemini backend listening on port ${port}`);
});
