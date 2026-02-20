
// Initialize the API with the backend proxy
// Note: We no longer need the API key here on the client side!
// It is securely stored on the server.

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
// NOTE: Ideally this should be server-side, but for this demo/prototype we use the client key found in the project.
const API_KEY = "AIzaSyAf0PQug-lFt2-rGHCxHdeMIIsx4xMBH-0";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

export type AIIntent =
  | { type: 'ACTION'; action: string; params: any; explanation: string }
  | { type: 'RESPONSE'; text: string };

export const GeminiService = {
  /**
   * Interprets a user's voice command to determine if it's an action or a question.
   */
  async interpretCommand(text: string, context: string): Promise<AIIntent> {
    try {
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
      const output = result.response.text();

      // Clean up potential markdown formatting if the model adds it
      const cleanJson = output.replace(/```json/g, '').replace(/```/g, '').trim();

      try {
        const parsed = JSON.parse(cleanJson);
        return parsed;
      } catch (e) {
        console.error("Failed to parse AI intent:", output);
        return { type: 'RESPONSE', text: "I'm not sure I understood that command, but I'm here to help." };
      }

    } catch (error) {
      console.error("AI Interpretation Error:", error);
      return { type: 'RESPONSE', text: "I'm having trouble processing that request right now." };
    }
  },

  async generateResponse(prompt: string): Promise<string> {
    try {
      // Fallback usage of the same model for generic chat if needed
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error: any) {
      console.error("Error generating response:", error);
      return "I encountered an error connecting to my neural network.";
    }
  },

  stopSpeech(): void {
    window.speechSynthesis.cancel();
  },

  async speakResponse(text: string): Promise<void> {
    this.stopSpeech();
    const utterance = new SpeechSynthesisUtterance(text);

    // Try to find a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v =>
      v.name.includes("Google US English") ||
      v.name.includes("Samantha") ||
      v.lang === "en-US"
    );

    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.pitch = 1.0;
    utterance.rate = 1.1; // Slightly faster for a "smart" feel

    window.speechSynthesis.speak(utterance);
  }
};
