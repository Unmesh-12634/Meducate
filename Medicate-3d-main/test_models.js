const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.VITE_GOOGLE_AI_API_KEY || "YOUR_API_KEY_HERE";
const genAI = new GoogleGenerativeAI(API_KEY);

async function testModel(modelName) {
    try {
        console.log(`Testing ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello");
        const response = await result.response;
        console.log(`Success with ${modelName}!`);
        return true;
    } catch (error) {
        console.log(`Failed with ${modelName}`);
        return false;
    }
}

async function runTests() {
    await testModel("gemini-1.5-flash");
    await testModel("gemini-pro");
    await testModel("gemini-1.0-pro");
    await testModel("gemini-1.5-pro");
}

runTests();
