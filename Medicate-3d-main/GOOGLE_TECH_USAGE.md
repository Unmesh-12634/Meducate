# Google Technologies Used

This project leverages the following Google technologies to provide an advanced, interactive medical simulation experience:

## 1. Google Gemini API (AI Medical Assistant)
We have integrated the **Google Gemini API** (specifically the `gemini-pro` model) to power our **AI Surgical Assistant**.
- **Functionality**: The assistant acts as a virtual copilot in the Operation Theater, answering complex anatomical questions and providing guidance during dissection.
- **Integration**: Implemented using the `@google/generative-ai` SDK.
- **Code Location**: `src/components/3d/AIAssistantOverlay.tsx` and `src/services/GeminiService.ts`.

## 2. MediaPipe (Hand Tracking)
We utilize **Google MediaPipe** for advanced hand tracking and gesture recognition.a
- **Functionality**: Enables users to interact with the 3D medical simulation (rotate, zoom, dissect) using natural hand gestures.
- **Integration**: Uses `@mediapipe/hands` and `@mediapipe/camera_utils`.
- **Code Location**: `src/components/3d/HandGestureController.tsx`.

## 3. Web Speech API (Voice Control)
We leverage the **Google Chrome Web Speech API** (Speech Recognition) for hands-free control.
- **Functionality**: Users can issue voice commands like "Scalpel", "Rotate Left", or "Zoom In" to control the simulation without touching the keyboard.
- **Integration**: Uses `window.webkitSpeechRecognition` (powered by Google's Speech-to-Text engine in Chrome).
- **Code Location**: `src/components/3d/VoiceCommandController.tsx`.

## 4. Firebase Authentication
We use **Firebase Authentication** to manage user accounts securely.
- **Functionality**: Allows users to sign up, log in, and maintain their session state.
- **Integration**: Uses `firebase/auth` SDK with Email/Password provider.
- **Code Location**: `src/lib/firebase.ts` and `src/context/AuthContext.tsx`.

## 5. Google Cloud Text-to-Speech (via Browser)
We use the browser's `SpeechSynthesis` API, which on Google Chrome utilizes **Google's Text-to-Speech voices**.
- **Functionality**: Converts the AI's text responses into natural-sounding speech for the surgical assistant.
- **Code Location**: `src/components/3d/AIAssistantOverlay.tsx`.

---
*This document serves as a reference for the "Which Google technologies did you use?" hackathon requirement.*
