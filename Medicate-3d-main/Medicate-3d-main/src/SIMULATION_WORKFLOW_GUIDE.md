# Simulation Workflow Implementation Guide

## Overview
This document describes the complete simulation workflow implementation for MediCate, from the student dashboard through to the full simulation setup interface.

## Navigation Flow

```
Dashboard 
    ↓
Simulator (PlayPage - renamed from "Play") 
    ↓
Join as Lead Physician (JoinPhysician) 
    ↓
Start Simulation (StartSimulation) 
    ↓
Full Simulation Interface (to be implemented)
```

## Changes Made

### 1. Navbar Updates
- **File**: `/components/Navbar.tsx`
- **Change**: Updated student navigation from `'Play'` to `'Simulator'`
- Line 22: `{ id: 'play', label: 'Simulator' }`

### 2. New Page: Join Physician
- **File**: `/components/pages/JoinPhysician.tsx`
- **Purpose**: Role selection and simulation configuration before starting
- **Features**:
  - Three role cards: Lead Physician (recommended), Resident Physician, Nurse
  - Specialty selection: Emergency Medicine, Cardiology, Neurology, Surgery
  - Performance stats display
  - Animated cards with hover effects
  - Breadcrumb navigation
  - Continue to Setup button → navigates to Start Simulation

### 3. New Page: Start Simulation
- **File**: `/components/pages/StartSimulation.tsx`
- **Purpose**: Final setup screen before launching the simulation
- **Layout**: Two-column design (35% / 65%)

#### Left Column - Setup Summary:
1. **Selected Specialty**: Cards for Cardiology, Emergency, Neurology, Surgery
2. **Difficulty Level**: Beginner, Intermediate, Advanced, Expert with descriptions
3. **Number of Patients**: Slider from 1-5 patients
4. **Simulation Mode**: Toggle between Solo and Team
5. **Lead Physician Details**: Collapsible section with name, role, experience

#### Right Column - Preview Panel:
1. **AI Simulation Environment Preview**: Visual mockup of the simulation interface
   - Shows three-column layout: Patient Data | AI Chat | MCQ Area
   - Simulated interface elements
   - "Live Preview" indicator
2. **What to Expect**: Description of simulation features
3. **Info Cards**: AI-Powered, Adaptive Learning, Real-Time Feedback

#### Footer Section:
- **Large Start Simulation Button**: Primary CTA with animations
- **View Instructions Button**: Secondary action
- **System Status**: AI Model, Server, Session status indicators
- **Note**: "Ensure your AI model is active before starting"

### 4. App.tsx Updates
- **File**: `/App.tsx`
- **Changes**:
  - Added imports for JoinPhysician and StartSimulation components
  - Added 'join-physician' and 'start-simulation' to Page type
  - Added sessionData state to store session information
  - Added routing cases for both new pages
  - Updated Footer visibility to hide on start-simulation page
  - Connected PlayPage with onNavigate prop

### 5. PlayPage Updates
- **File**: `/components/pages/PlayPage.tsx`
- **Changes**:
  - Added onNavigate prop
  - Updated handleJoinAsLead to navigate to 'join-physician' page
  - Maintains backward compatibility

## User Journey

### Step 1: Dashboard
User clicks on "Simulator" in the navigation (renamed from "Play")

### Step 2: Simulator (PlayPage)
- Displays active simulation sessions
- Shows session cards with patient vitals and team chat
- User clicks "Join as Lead Physician" button on any session card

### Step 3: Join as Lead Physician
- User selects their role (Lead Physician recommended)
- Chooses preferred specialty
- Views their performance stats
- Clicks "Continue to Setup"

### Step 4: Start Simulation
- **Left Side**: Configure simulation parameters
  - Select specialty (visual cards with icons)
  - Choose difficulty level (4 levels with descriptions)
  - Set number of patients (1-5 slider)
  - Toggle Solo/Team mode
  - View/expand lead physician details
  
- **Right Side**: Preview the simulation interface
  - See mockup of the actual simulation workspace
  - Read "What to Expect" description
  - View feature highlights (AI-Powered, Adaptive, Real-Time Feedback)

- **Footer**: 
  - Click "Start Simulation" to launch (shows toast for now)
  - Click "View Instructions" for help
  - See system status (all green indicators)

## Design Features

### Animations & Interactions
- **Smooth page transitions** with motion/react
- **Hover effects** on all interactive cards
- **Scale animations** on buttons
- **Collapsible sections** with smooth height transitions
- **Pulse animations** on status indicators
- **Gradient backgrounds** matching MediCate theme

### Color Scheme
- **Primary (Teal)**: #00A896 - Main actions, selected states
- **Secondary (Yellow)**: #FFD166 - Highlights, secondary actions
- **Accent (Pink-Red)**: #EF476F - Important metrics, warnings
- **Additional**: #7C3AED - Expert level, special features

### Responsive Design
- Two-column layout on desktop (35% / 65%)
- Stacked layout on mobile
- All cards scale properly
- Touch-friendly button sizes

## Integration Points

### Session Data
```typescript
sessionData: {
  roomName: string;
  scenario: string;
  image: string;
}
```
Passed through: PlayPage → JoinPhysician → StartSimulation

### Navigation Callbacks
- `onNavigate(page: string)`: Navigate between pages
- `onStartSimulation()`: Progress from JoinPhysician to StartSimulation
- `onStartFullSimulation()`: Launch actual simulation (to be implemented)

## Next Steps

### To Complete Full Workflow:
1. **Create Simulation Interface Component**: The actual AI-powered simulation workspace
2. **Implement Real-Time Features**: WebSocket connections for team mode
3. **Add Backend Integration**: Connect to simulation engine
4. **Store User Selections**: Save configuration before launching
5. **Add Instructions Modal**: Detailed help for "View Instructions" button

### Suggested Enhancements:
- Save favorite configurations
- Quick start with previous settings
- Simulation history and replay
- Team formation interface for multiplayer
- Pre-simulation briefing videos

## File Structure
```
/components/pages/
├── PlayPage.tsx (Simulator - Active Sessions)
├── JoinPhysician.tsx (Role Selection)
├── StartSimulation.tsx (Final Setup)
└── [SimulationInterface.tsx] (To be created)
```

## Testing Checklist
- [ ] Navigate from Dashboard to Simulator
- [ ] Click "Join as Lead Physician" on session card
- [ ] Select different roles and specialties
- [ ] Progress to Start Simulation page
- [ ] Interact with all configuration options
- [ ] Test collapsible physician details
- [ ] Verify all animations work smoothly
- [ ] Test responsive design on mobile
- [ ] Verify breadcrumb navigation works
- [ ] Test "Back to Dashboard" button
- [ ] Click "Start Simulation" button (shows toast)

## Notes
- All components use motion/react for animations
- Design follows MediCate's rounded-2xl card style
- Color scheme matches student portal theme
- All interactions are smooth and provide visual feedback
- Fully responsive with proper mobile support
