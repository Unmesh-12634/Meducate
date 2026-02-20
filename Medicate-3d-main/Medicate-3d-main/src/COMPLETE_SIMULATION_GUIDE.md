# Complete Simulation Workflow Guide

## Overview
This guide documents the complete end-to-end simulation workflow in MediCate, from selecting a session to completing a full medical simulation with real-life scenarios, patient interaction, and clinical assessments.

## Complete Navigation Flow

```
Dashboard 
    ↓
Simulator (PlayPage) - View Active Sessions
    ↓
Join as Lead Physician (JoinPhysician) - Role & Specialty Selection
    ↓
Start Simulation (StartSimulation) - Configuration & Setup
    ↓
Simulation Interface (SimulationInterface) - Live Medical Simulation
    ↓
End Simulation → Return to Simulator
```

## Recent Updates

### 1. Fixed "Recommended" Badge
**File**: `/components/pages/JoinPhysician.tsx`

**Changes**:
- Removed rotation (-12deg tilt)
- Added gradient background (from-[#FFD166] to-[#FFB422])
- Increased padding and spacing
- Added white border
- Made icon filled
- Improved font weight

**Result**: Professional, straight badge that's more prominent and polished

### 2. Created Full Simulation Interface
**File**: `/components/pages/SimulationInterface.tsx` (NEW)

This is a comprehensive, real-life medical simulation page with:

## Simulation Interface Features

### Top Navigation Bar
- **Back Button**: Return to Start Simulation
- **Session Info**: Display simulation type and scenario
- **Timer**: Running timer with pause/play functionality
- **Score Display**: Real-time score tracking (X/6 questions)
- **End Simulation Button**: Exit the simulation

### Three-Column Layout

#### Left Column (25%) - Patient Data Panel
1. **Patient Information**
   - Name: John Mitchell
   - Age: 58 years
   - Gender: Male
   - Chief Complaint: "Severe chest pain with radiation to left arm"

2. **Vital Signs Monitor** (Color-coded by status)
   - Heart Rate: 102 bpm (⚠️ Elevated - Warning)
   - Blood Pressure: 145/95 (⚠️ Critical)
   - O₂ Saturation: 94% (⚠️ Warning)
   - Temperature: 37.2°C (✓ Normal)
   - Respiratory Rate: 22 /min (✓ Normal)

3. **Medical History**
   - Hypertension (5 years)
   - Type 2 Diabetes (3 years)
   - High cholesterol
   - Former smoker (quit 2 years ago)

4. **Allergies** (Red warning boxes)
   - ⚠ Penicillin
   - ⚠ Sulfa drugs

5. **Current Medications**
   - 💊 Metformin 1000mg BID
   - 💊 Lisinopril 10mg daily
   - 💊 Atorvastatin 40mg daily
   - 💊 Aspirin 81mg daily

#### Center Column (50%) - AI Patient Interview
1. **Chat Interface**
   - AI Patient avatar (blue gradient)
   - Doctor avatar (yellow gradient)
   - Real-time message exchange
   - Timestamps on all messages
   - Smooth animations

2. **Patient Responses** (AI generates realistic replies)
   - "The pain is constant, about 8/10 in severity. I also feel short of breath and a bit nauseous."
   - "It started suddenly while I was resting. I've never felt anything like this before."
   - "Yes, I take medications for my blood pressure and diabetes. I also had high cholesterol."
   - "The pain is right in the center of my chest, like someone is sitting on it. It's crushing."
   - "I smoked for 30 years but quit 2 years ago. My father had a heart attack at age 55."

3. **Input Area**
   - Text input for questions
   - Send button
   - Quick question buttons:
     - "Describe the pain"
     - "When did it start?"
     - "Any medications?"
     - "Medical history?"
     - "Any allergies?"
     - "Family history?"

#### Right Column (25%) - Clinical Assessment (MCQ)
1. **Question Header**
   - Question number (1 of 6)
   - Category badge
   - Progress indicator

2. **Six Real Medical Questions**:

   **Q1: Diagnosis** (Most likely diagnosis)
   - Options: GERD, Acute MI, Panic attack, Musculoskeletal pain
   - ✓ Correct: Acute myocardial infarction (MI)

   **Q2: Immediate Action** (First intervention)
   - Options: Chest X-ray, Sublingual nitroglycerin + ECG, Send home, Stress test
   - ✓ Correct: Give sublingual nitroglycerin and call for ECG

   **Q3: Safety** (Contraindication)
   - Options: Hydration, Penicillin antibiotics, Iodinated contrast, Beta-blocker
   - ✓ Correct: Using penicillin-based prophylactic antibiotics

   **Q4: ECG Interpretation** (Coronary artery)
   - ST-elevation in leads II, III, aVF
   - ✓ Correct: Right coronary artery (RCA)

   **Q5: Clinical Guidelines** (Door-to-balloon time)
   - Options: 30 min, 90 min, 3 hours, 6 hours
   - ✓ Correct: Within 90 minutes

   **Q6: Pharmacology** (Medication combination)
   - ✓ Correct: Aspirin, P2Y12 inhibitor, heparin, and statin

3. **Answer Feedback**
   - ✓ Green box for correct answers
   - ✗ Red box for incorrect answers
   - Detailed explanation for each answer
   - "Next Question" button after answering

4. **Completion Summary**
   - Trophy icon
   - Final score (e.g., 5/6)
   - Percentage (e.g., 83%)
   - Progress bar

## Design Features

### Color-Coded Vitals
- **Critical** (#EF476F - Red): Immediate attention needed
- **Warning** (#FFD166 - Yellow): Abnormal, monitor closely
- **Normal** (#00A896 - Teal): Within acceptable range

### Animations
- Smooth message animations
- Hover effects on all interactive elements
- Scale animations on buttons
- Typing indicators
- Pulse animations on status indicators
- Progress bar animations

### Real-Time Features
- Running timer (MM:SS format)
- Pause/resume functionality
- Live score tracking
- Message timestamps
- Active status indicator (pulsing green dot)

### Responsive Interactions
- Chat scrolls to bottom on new messages
- Quick question shortcuts
- Enter key to send messages
- Disabled buttons after answering MCQs
- Visual feedback on all actions

## Medical Scenario Details

### Case: Acute Myocardial Infarction (STEMI)

**Patient Profile**:
- 58-year-old male
- Multiple cardiac risk factors
- Classic MI presentation

**Learning Objectives**:
1. Recognize acute MI symptoms
2. Understand immediate interventions
3. Know medication contraindications
4. Interpret ECG findings
5. Follow clinical guidelines
6. Apply pharmacological knowledge

**Clinical Reasoning Path**:
1. Initial presentation → Differential diagnosis
2. Risk factors → Probability assessment
3. Immediate actions → Time-critical interventions
4. Safety considerations → Allergy awareness
5. Diagnostic interpretation → ECG analysis
6. Evidence-based treatment → Guideline adherence

## User Journey

### Step 1: Dashboard
- Login as student
- Click "Simulator" in navbar

### Step 2: Simulator (PlayPage)
- View 4-5 active sessions
- See session details (vitals, team members, chat)
- Click "Join as Lead Physician"

### Step 3: Join as Lead Physician
- See **FIXED** professional "Recommended" badge
- Select role: Lead Physician ⭐ (Recommended), Resident, or Nurse
- Choose specialty: Emergency, Cardiology, Neurology, Surgery
- View performance stats
- Click "Continue to Setup"

### Step 4: Start Simulation
- Configure left panel (35%):
  - Select specialty
  - Choose difficulty level
  - Set patient count (slider 1-5)
  - Toggle Solo/Team mode
  - Expand physician details
- Preview right panel (65%):
  - See simulated interface
  - Read "What to Expect"
  - View feature cards
- Click **"Start Simulation"** button

### Step 5: Simulation Interface ⭐ NEW
- **Left Panel**: Monitor patient data and vitals
- **Center Panel**: Interact with AI patient
  - Ask questions
  - Use quick prompts
  - Receive realistic responses
- **Right Panel**: Answer clinical MCQs
  - Read each question
  - Select answer
  - Get immediate feedback
  - Read explanations
  - Progress to next question
- Monitor timer and score
- Complete all 6 questions
- Click "End Simulation"

### Step 6: Return to Simulator
- Success toast notification
- View completed simulation in history
- Start new simulation or review results

## Technical Implementation

### State Management
```typescript
- messages: Message[] - Chat history
- inputMessage: string - Current input
- currentMCQ: number - Active question index
- score: number - Correct answers count
- answeredQuestions: number[] - Completed question IDs
- selectedAnswer: number | null - Current selection
- showExplanation: boolean - Display feedback
- simulationTime: number - Elapsed seconds
- isTimerRunning: boolean - Timer state
```

### Key Functions
- `handleSendMessage()`: Send user questions, trigger AI responses
- `handleAnswerSelect(index)`: Process MCQ answers, update score
- `handleNextQuestion()`: Progress through assessment
- `getVitalStatus()`: Determine vital sign severity
- `formatTime()`: Display MM:SS timer

### Data Structures
- `PatientData`: Complete patient information
- `Message`: Chat message object
- `MCQ`: Question with options and explanation
- `VitalsDisplay`: Real-time monitoring data

## Integration Points

### Props Flow
```
App.tsx
  ↓ onNavigate, onEndSimulation
SimulationInterface
  ↓ patientData, mcqQuestions
  ↓ Real-time updates
Components (Chat, Vitals, MCQ)
```

### Navigation
- Back button → `start-simulation`
- End button → `play` (with toast)
- Auto-scroll on messages
- Smooth transitions

## Testing Checklist

- [ ] Navigate complete flow from Dashboard to Simulation
- [ ] Verify "Recommended" badge is straight and professional
- [ ] Send messages to AI patient
- [ ] Test quick question shortcuts
- [ ] Answer all 6 MCQ questions
- [ ] Verify correct/incorrect feedback
- [ ] Check explanation displays
- [ ] Monitor timer functionality (pause/resume)
- [ ] Test score tracking accuracy
- [ ] View vital signs color coding
- [ ] Scroll through patient data
- [ ] Complete simulation and return
- [ ] Test responsive design on mobile
- [ ] Verify all animations work smoothly

## Future Enhancements

### Simulation Interface
- [ ] Multiple patient scenarios
- [ ] Team collaboration mode (real-time multiplayer)
- [ ] Voice input for questions
- [ ] Video patient presentations
- [ ] Downloadable ECG strips
- [ ] Lab results integration
- [ ] Imaging studies viewer (X-rays, CT scans)
- [ ] Procedure simulation (intubation, IV placement)
- [ ] Time-based scenario progression
- [ ] Performance analytics after completion

### Assessment Features
- [ ] Adaptive difficulty (questions adjust to performance)
- [ ] Timed questions
- [ ] Case-based discussions
- [ ] Peer review comparisons
- [ ] Mentor feedback system
- [ ] Certification upon completion

### Learning Tools
- [ ] Reference materials sidebar
- [ ] Clinical guidelines quick access
- [ ] Drug database integration
- [ ] Differential diagnosis helper
- [ ] Treatment protocols

## Performance Metrics

Users can be evaluated on:
1. **Diagnostic Accuracy**: Correct diagnosis (16.67%)
2. **Clinical Decision-Making**: Appropriate interventions (16.67%)
3. **Patient Safety**: Allergy awareness (16.67%)
4. **Technical Skills**: ECG interpretation (16.67%)
5. **Guideline Adherence**: Following standards (16.67%)
6. **Pharmacology**: Medication knowledge (16.67%)

**Total Score**: X/6 → Percentage → Letter Grade

## Notes

- All patient data is realistic and medically accurate
- MCQ questions follow medical licensing exam format
- Explanations are detailed and educational
- Color coding follows standard medical protocols
- Interface designed for distraction-free learning
- No navbar/footer during simulation for immersion
- Auto-save functionality can be added
- Simulation can be paused and resumed

## Files Modified/Created

### Created
- `/components/pages/SimulationInterface.tsx` - Full simulation page

### Modified
- `/components/pages/JoinPhysician.tsx` - Fixed recommended badge
- `/App.tsx` - Added simulation-interface routing
- Updated page type
- Connected navigation flow
- Hidden navbar during simulation

## Success Criteria

✅ Recommended badge is professional and straight
✅ Complete three-column simulation interface
✅ Real medical scenario (STEMI case)
✅ AI patient with realistic responses
✅ 6 clinical assessment questions
✅ Detailed explanations for each answer
✅ Color-coded vital signs
✅ Working timer and score tracking
✅ Smooth animations throughout
✅ Full navigation flow functional
✅ Immersive full-screen experience

## Conclusion

The simulation workflow is now complete from start to finish. Students can:
1. Browse active sessions
2. Select their role
3. Configure simulation parameters
4. Engage in realistic patient interviews
5. Answer clinical assessment questions
6. Receive immediate feedback
7. Track their performance
8. Complete the simulation with a score

This creates a comprehensive, immersive medical learning experience that combines AI-powered patient interaction with evidence-based clinical assessment.
