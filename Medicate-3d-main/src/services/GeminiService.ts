



export type Language = 'en' | 'hi' | 'te';

export type AIIntent =
  | { type: 'ACTION'; action: string; params: any; explanation: string }
  | { type: 'RESPONSE'; text: string };

// Maps language codes to BCP-47 locale tags for TTS
const TTS_LOCALE: Record<Language, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  te: 'te-IN',
};

export const GeminiService = {
  /**
   * Interprets a user's voice command to determine if it's an action or a question.
   */
  async interpretCommand(text: string, context: string): Promise<AIIntent> {
    try {
      const response = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, context }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("AI Interpretation Error:", errorData);
        return { type: 'RESPONSE', text: "I'm having trouble processing that request right now." };
      }

      return await response.json();
    } catch (error) {
      console.error("AI Interpretation Error:", error);
      return { type: 'RESPONSE', text: "I'm having trouble processing that request right now." };
    }
  },

  /**
   * Generates a response from MediBot, optionally in a specific language.
   */
  async generateResponse(prompt: string, language: Language = 'en'): Promise<string> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, language }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error generating response:", errorData);
        return "I encountered an error connecting to my neural network.";
      }

      const data = await response.json();
      return data.text;
    } catch (error: any) {
      console.error("Error generating response:", error);
      return "I encountered an error connecting to my neural network.";
    }
  },

  stopSpeech(): void {
    window.speechSynthesis.cancel();
  },

  /**
   * Speaks text using the browser TTS in the correct language/voice.
   */
  async speakResponse(text: string, language: Language = 'en'): Promise<void> {
    this.stopSpeech();
    const locale = TTS_LOCALE[language];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale;

    // Wait for voices if not yet loaded
    let voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      await new Promise<void>((resolve) => {
        window.speechSynthesis.onvoiceschanged = () => resolve();
        setTimeout(resolve, 1000);
      });
      voices = window.speechSynthesis.getVoices();
    }

    // Find a voice matching the locale prefix (e.g. 'hi' for 'hi-IN')
    const langPrefix = locale.split('-')[0];
    const preferredVoice =
      voices.find(v => v.lang === locale) ||
      voices.find(v => v.lang.startsWith(langPrefix));

    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.pitch = 1.0;
    utterance.rate = language === 'en' ? 1.1 : 0.95;

    window.speechSynthesis.speak(utterance);
  }
};
