const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.VITE_GOOGLE_AI_API_KEY || "YOUR_API_KEY_HERE";
const genAI = new GoogleGenerativeAI(API_KEY);

async function testModel() {
    try {
        console.log("Testing gemini-1.5-flash...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello");
        const response = await result.response;
        console.log("Success! Response:", response.text());
    } catch (error) {
        console.log("Failed with gemini-1.5-flash");
        console.log("Error:", error.message);
    }
}

testModel();
