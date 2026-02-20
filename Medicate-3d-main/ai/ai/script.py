import google.genai as genai
import logging
import json
from google.genai.types import HarmCategory, HarmBlockThreshold

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- Configuration Constants ---
MODEL_NAME = 'gemini-2.5-flash'

# --- EXTREME OPTIMIZATION PROMPT (JURY EDITION) ---
# This prompt enforces strict JSON, complex multi-turn logic, and the requested highlighting.
SYSTEM_INSTRUCTION = """
ROLE & GOAL:
You are the **VitaSim Clinical Reasoning Engine** for postgraduate medical education. Your sole function is to generate highly realistic, evidence-based patient cases and manage a standardized, interactive diagnostic and treatment simulation.

CONSTRAINTS & OUTPUT:
1.  **Strict JSON Output:** The entire response body for ALL turns MUST be a valid JSON object. Do NOT include any conversational text, markdown, or commentary outside the JSON object, unless the session ends (see Flow Step 5).
2.  **Safety Guardrail:** Include the following exact short disclaimer in a designated 'disclaimer' field: "Educational simulation only—not a substitute for clinical judgment."
3.  **Accuracy:** Cases must be current, evidence-based, and internally consistent.

INTERACTIVE FLOW RULES:
1.  **Start/Case Generation:** The user's initial prompt provides RUNTIME PARAMETERS (Specialty, Level, Count). Generate the first patient case immediately.
2.  **Diagnosis (MCQD) Evaluation:** When the user provides a selected option (A-D):
    * **IF Correct (Highlight):** Set `after_choice_response.correct` to `true`. Provide a concise justification (2-4 sentences) explaining the choice and **explicitly highlight the correct option (e.g., 'A. Guillain-Barré Syndrome') with Markdown bolding** within the justification text. Then, immediately present the 4-option Treatment MCQ (MCQT).
    * **IF Incorrect (Reveal):** Set `after_choice_response.correct` to `false`. Provide targeted, non-confrontational feedback (2-4 sentences explaining why the choice is less likely), supply 1-2 hints, and allow the user to retry. The response must state the correct answer and reason if the user asks for a reveal.
3.  **Treatment (MCQT) Evaluation:** Evaluate the user's MCQT choice, provide the outcome and a brief debrief (reasoning, pitfalls, teaching pearls, 1-3 references (e.g., 'Harrison's 2024')).
4.  **Termination:** After the final case (as dictated by the 'PATIENT_COUNT' parameter), output a final summary JSON (overall score, common error category, 3 study recommendations).

JSON SCHEMA:
{
  "patient_id": "<string>",
  "age": <int>,
  "sex": "<M/F/Other>",
  "presenting_complaint": "<short string>",
  "history": {
    "onset": "<string>",
    "progression": "<string>",
    "associated_symptoms": [ "<string>", ... ],
    "past_medical_history": [ "<string>", ... ],
    "medications": [ "<string>", ... ],
    "allergies": "<string or 'none'>",
    "social_history": "<brief string>"
  },
  "vitals": {
    "temperature_C": <number or null>,
    "heart_rate_bpm": <number or null>,
    "blood_pressure_mmHg": "<systolic/diastolic or null>",
    "respiratory_rate_bpm": <number or null>,
    "oxygen_sat_percent": <number or null>
  },
  "physical_exam": {
    "general": "<string>",
    "system_findings": [ "<string>", ... ]
  },
  "ancillary_tests": [
    { "type":"<lab|ecg|xray|ct|us|other>", "summary":"<one-line result>", "key_values": { "<name>":"<value>", ... } }
  ],
  "diagnostic_mcq": {
    "question_text": "<string>",
    "options": [ "A. <text>", "B. <text>", "C. <text>", "D. <text>" ],
    "correct_option": "<'A'|'B'|'C'|'D'>"
  },
  "after_choice_response": null,
  "disclaimer": "<short string, mandatory for all final patient turns>"
}
"""

class AITrainer:
    """
    Manages the Gemini chat session, training examples, and conversation history.
    Uses the modern google.genai Client structure and API key handling.
    """
    def __init__(self, system_instruction: str = SYSTEM_INSTRUCTION):
        
        # API Key (use your specific key)
        self.api_key = "AIzaSyBDYxzNHBx6CZXYgk8gAAu6x2yhoXRqObw"
        self.system_instruction = system_instruction
        
        # 1. Initialize the Client object with the API key
        self.client = genai.Client(api_key=self.api_key)
        
        self.conversation_history = []
        self.chat_session = self._create_chat_session()
        logger.info(f"AI Trainer initialized with model: {MODEL_NAME}")
    
    def _create_chat_session(self):
        """
        Creates a new chat session, passing the system_instruction and config 
        within the config parameter, which is required by the current SDK syntax.
        """
        return self.client.chats.create(
            model=MODEL_NAME, 
            history=self.conversation_history,
            # ALL GENERATION PARAMETERS (including system_instruction) go inside config
            config=genai.types.GenerateContentConfig(
                system_instruction=self.system_instruction, 
                response_mime_type="application/json", # Enforce JSON output
                safety_settings=[
                    genai.types.SafetySetting(
                        category=HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, 
                        threshold=HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
                    ),
                ]
            )
        )

    def add_training_example(self, user_input: str, expected_output: str):
        """Adds a new Q&A pair to the *conversation history* (few-shot examples)."""
        
        self.conversation_history.append({
            "role": "user",
            "parts": [{"text": user_input}]
        })
        self.conversation_history.append({
            "role": "model",
            "parts": [{"text": expected_output}]
        })
    
    def get_ai_response(self, user_input: str) -> str:
        """Sends the user message to the *existing* chat session to maintain context."""
        
        if not self.chat_session:
            self.chat_session = self._create_chat_session()
            logger.info("Chat session re-established with history.")
            
        try:
            response = self.chat_session.send_message(user_input)
            
            # Attempt to parse and pretty-print JSON responses for presentation quality
            try:
                # Note: This attempt to load JSON here is for formatting only.
                # The model *should* be strictly outputting JSON as per the prompt.
                parsed_json = json.loads(response.text)
                return json.dumps(parsed_json, indent=2)
            except json.JSONDecodeError:
                # Fallback if the model breaks the JSON format (e.g., during the final summary)
                return response.text
            
        except Exception as e:
            logger.error(f"API call failed: {e}")
            return f"Error: Could not get a response from the AI. Details: {e}"

    def train_with_dataset(self, training_data: list):
        """Loads a list of (question, answer) tuples into the history."""
        print("🧠 Adding examples to conversation history...")
        for i, (question, answer) in enumerate(training_data, 1):
            self.add_training_example(question, answer)
            print(f"✅ Example {i} loaded: {question[:50]}...")
            
        # Re-create the session to load the new examples into the chat context
        self.chat_session = self._create_chat_session()
        
        print(f"🎯 Training completed! {len(training_data)} examples loaded.")
    
    def clear_history(self):
        """Clear conversation history and restart the chat session."""
        self.conversation_history = []
        self.chat_session = self._create_chat_session()
        print("🗑️ Conversation history and chat session cleared!")

    def show_stats(self):
        """Show training statistics."""
        exchanges = len(self.conversation_history) // 2
        print(f"📊 Training Statistics:")
        print(f"   - Model: **{MODEL_NAME}**")
        print(f"   - Base Exchanges (Training): **{exchanges}**")
        # Truncate the long system prompt for clean display
        print(f"   - System Instruction: **{self.system_instruction[:50]}...**") 

def main():
    try:
        # Initialize AI Trainer
        ai_trainer = AITrainer()
        
        print("\n" + "=" * 50)
        print("🩺 **VitaSim Clinical Reasoning Engine Ready!**")
        print("🔥 Optimized for JSON output and Jury presentation.")
        print("=" * 50)
        print("Commands: 'train', 'clear', 'stats', 'quit'")
        print("⭐ **To START the simulation, send a structured command like:**")
        print("   'Specialty: Internal Medicine, Level: advanced, Patient_Count: 3. Action: Generate case 1.'")
        print("-" * 50)
        
        while True:
            user_input = input("\n💬 You: ").strip()
            
            if user_input.lower() == 'quit':
                print("👋 Goodbye! Presentation success is guaranteed.")
                break
            elif user_input.lower() == 'clear':
                ai_trainer.clear_history()
                continue
            elif user_input.lower() == 'stats':
                ai_trainer.show_stats()
                continue
            elif user_input.lower() == 'train':
                print("\n🎓 Training Mode - Enter Q&A pairs (type 'done' to finish):")
                new_training_data = []
                while True:
                    question = input("Question: ").strip()
                    if question.lower() == 'done':
                        break
                    answer = input("Answer: ").strip()
                    if answer.lower() == 'done':
                        break
                    new_training_data.append((question, answer))
                
                if new_training_data:
                     ai_trainer.train_with_dataset(new_training_data)
                continue
            elif not user_input:
                continue
            
            # Get AI response
            response = ai_trainer.get_ai_response(user_input)
            print(f"🤖 AI:\n{response}")
            
    except Exception as e:
        logger.critical(f"A fatal error occurred in main: {e}")
        print(f"\n❌ **Fatal Error:** {e}")

if __name__ == "__main__":
    main()
