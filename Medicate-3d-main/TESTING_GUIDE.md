# How to Test Your Google Technologies

Follow these steps to verify each feature for your hackathon demo.

## 1. Test Firebase Authentication (Login/Signup)
*   **Goal**: Verify real user accounts work.
*   **Steps**:
    1.  Go to the **Signup Page**.
    2.  Enter a name, email, and password (e.g., `judge@hackathon.com`, `password123`).
    3.  Click **Create Account**.
    4.  **Success**: You should be redirected to the Dashboard.
    5.  **Verify**: Refresh the page. You should stay logged in.
    6.  Click **Logout** and try logging in with the same credentials.

## 2. Test Gemini API (AI Assistant)
*   **Goal**: Verify the AI answers medical questions.
*   **Steps**:
    1.  Log in to the app.
    2.  Click the **Chat Icon** (bottom right).
    3.  Type a question: *"What are the symptoms of a heart attack?"*
    4.  **Success**: The AI should reply with a relevant medical answer.

## 3. Test Google Cloud Text-to-Speech (Voice)
*   **Goal**: Verify the AI speaks.
*   **Steps**:
    1.  Ensure your computer volume is **ON**.
    2.  Ask the AI a question (as above).
    3.  **Success**: When the text reply appears, you should also **hear** the answer spoken aloud.
    *   *Note: If you don't hear anything, check if "Cloud Text-to-Speech API" is enabled in your Google Cloud Console.*

## 4. Test MediaPipe (Hand Tracking)
*   **Goal**: Verify gesture control.
*   **Steps**:
    1.  Go to the **Simulator** or **Play** page.
    2.  Allow camera access when prompted.
    3.  Hold your hand up to the webcam.
    4.  **Success**: You should see landmarks (dots/lines) on your hand in the video feed, or see the 3D model react to your movement.

## Troubleshooting
-   **Console Errors**: Press `F12` to open Developer Tools and look at the "Console" tab for red error messages if something doesn't work.
