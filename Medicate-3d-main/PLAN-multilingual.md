s# Multilingual Support — Hindi & Tamil

## Goal
Add Hindi (हिन्दी) and Tamil (தமிழ்) language support so MediBot responds in the selected language with matching TTS voice, and key AskPage UI strings are translated.

---

## Architecture Decision
- **No i18n library** (too slow for 6-hour hack). Use a simple inline translation object.
- Language state lives in `App.tsx` → passed as a prop down to `Navbar` + `AskPage`.
- Gemini already supports Hindi/Tamil natively — inject language instruction into the prompt.
- TTS uses browser `SpeechSynthesis` with `lang` set to `hi-IN` or `ta-IN`.

---

## Files Affected

| File | Change |
|------|--------|
| `src/App.tsx` | Add `language` state, pass to `Navbar` + `AskPage` |
| `src/components/Navbar.tsx` | Add language pill toggle (EN / हिन्दी / தமிழ்) |
| `src/components/pages/AskPage.tsx` | Use language in Gemini prompt + TTS lang + translate UI strings |
| `src/services/GeminiService.ts` | Accept `language` param in `generateResponse()` |
| `server/server.js` | Accept `language` in `/api/chat` body, inject into system prompt |

---

## Tasks

- [ ] **T1 — App.tsx: Add `language` state + pass to children**
  - Add `const [language, setLanguage] = useState<'en' | 'hi' | 'ta'>('en')`
  - Pass `language` + `setLanguage` to `<Navbar>` and `<AskPage>`
  - → Verify: `console.log(language)` changes when toggled

- [ ] **T2 — Navbar.tsx: Language pill toggle**
  - Add a compact 3-pill toggle after the theme button: `EN | हिन्दी | தமிழ்`
  - Use teal highlight for active pill, muted for inactive
  - Calls `setLanguage('en'|'hi'|'ta')` on click
  - → Verify: Pills render in navbar, click changes active highlight

- [ ] **T3 — server.js: Update `/api/chat` to accept `language`**
  - Accept `{ prompt, language }` in request body
  - Build system prefix: `"Respond ONLY in Hindi (Devanagari script)."` or Tamil equivalent
  - Prepend to prompt before sending to Gemini
  - → Verify: `POST /api/chat` with `{ prompt: "heart", language: "hi" }` → response in Hindi

- [ ] **T4 — GeminiService.ts: Pass `language` to fetch call**
  - Update `generateResponse(prompt, language)` signature
  - Add `language` to the JSON body sent to `/api/chat`
  - → Verify: Network tab shows `language` in request payload

- [ ] **T5 — AskPage.tsx: Wire `language` prop to all Gemini calls**
  - Accept `language` prop (`'en'|'hi'|'ta'`)
  - Pass it to both `handleSend` and `handleSuggestionClick` → `GeminiService.generateResponse(text, language)`
  - Change welcome message based on language:
    - hi: `"नमस्ते! मैं MediBot हूँ, आपका AI मेडिकल असिस्टेंट।"`
    - ta: `"வணக்கம்! நான் MediBot, உங்கள் AI மருத்துவ உதவியாளர்."`
  - → Verify: Change language → send message → response in chosen language

- [ ] **T6 — AskPage.tsx: Fix TTS voice language**
  - In `GeminiService.speakResponse()`, accept `lang` param (`'en-US'|'hi-IN'|'ta-IN'`)
  - Set `utterance.lang = lang` before speaking
  - Filter `voices` by lang for best native voice
  - → Verify: Toggle Hindi → send message → TTS speaks in Hindi accent

- [ ] **T7 — AskPage.tsx: Translate Quick Suggestions + input placeholder**
  - Define translation object for:
    - Quick suggestion titles (Heart, Brain, COPD cards)
    - Input placeholder text
    - "Press Enter" hint
    - Status bar text
  - → Verify: Switch to Tamil → sidebar suggestions show Tamil text

---

## Done When
- [ ] Language toggle renders in Navbar with 3 options (EN / हिन्दी / தமிழ்)
- [ ] MediBot responds in Hindi when Hindi selected
- [ ] MediBot responds in Tamil when Tamil selected
- [ ] TTS speaks in the selected language
- [ ] AskPage welcome message + placeholders change with language

---

## Verification Steps

### Manual Test (5 min)
1. Run `npm run dev` + `cd server && node server.js`
2. Login → go to **Ask** page
3. Click **हिन्दी** pill in Navbar
4. Type: `"दिल के बारे में बताओ"` → press Enter
5. ✅ MediBot responds in Hindi text
6. ✅ TTS reads in Hindi
7. Click **தமிழ்** → type `"இதயம் என்றால் என்ன"` → press Enter
8. ✅ MediBot responds in Tamil
9. Click a Quick Suggestion card → ✅ suggestion text is in Tamil

### Server Test
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Explain the heart","language":"hi"}'
# Expected: JSON with "text" field containing Hindi (Devanagari) text
```

---

## Notes
- Browser must have Hindi/Tamil TTS voices installed (Chrome on Windows has them by default)
- If no native Hindi/Tamil voice found, TTS falls back to English voice reading Hindi text (still works, less ideal)
- The Gemini model (`gemini-flash-latest`) handles Hindi and Tamil natively with high quality
- Total estimated time: **1.5–2 hours**
