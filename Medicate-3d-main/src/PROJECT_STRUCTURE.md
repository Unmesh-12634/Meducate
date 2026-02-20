# MediVerse - Project Structure & Documentation

## 🎯 Overview
MediVerse is a modern, interactive AI-powered 3D medical simulation and collaborative learning platform built with React, Tailwind CSS, Motion (Framer Motion), and Three.js.

## 📁 Project Structure

```
/
├── App.tsx                          # Main application component with routing
├── styles/
│   └── globals.css                  # Global styles with MediVerse theme
├── components/
│   ├── ThemeProvider.tsx           # Dark/Light mode management
│   ├── Navbar.tsx                   # Main navigation with mobile support
│   ├── Footer.tsx                   # Footer with social links
│   │
│   ├── ui/                          # Reusable UI components
│   │   ├── PrimaryButton.tsx       # Primary action button
│   │   ├── SecondaryButton.tsx     # Secondary action button
│   │   ├── ScenarioCard.tsx        # Medical scenario card
│   │   ├── QuizCard.tsx            # Interactive quiz card
│   │   ├── StatCard.tsx            # Statistics display card
│   │   ├── BadgeCard.tsx           # Achievement badge card
│   │   └── [shadcn components]     # Pre-built UI library
│   │
│   ├── 3d/
│   │   └── Viewer.tsx              # 3D model viewer (Three.js)
│   │
│   ├── chatbot/
│   │   ├── ChatButton.tsx          # Floating chat trigger button
│   │   └── ChatPanel.tsx           # Slide-over chat interface
│   │
│   └── pages/
│       ├── HomePage.tsx            # Landing page
│       ├── SimulatorPage.tsx       # 3D simulation interface
│       ├── LearnPage.tsx           # Gamified learning hub
│       ├── AskPage.tsx             # MediBot Q&A interface
│       └── ProfilePage.tsx         # User profile & achievements
```

## 🎨 Design System

### Color Palette
- **Primary**: `#00A896` (Teal-Green) - Main brand color, CTAs
- **Secondary**: `#FFD166` (Soft Yellow) - Highlights, warnings
- **Accent**: `#EF476F` (Vibrant Pink-Red) - Important actions, errors

### Theme Modes
- **Light Mode**: Cream white background (`#FAF9F6`)
- **Dark Mode**: True black background (`#0A0A0A`) with `#E0E0E0` text

### Typography
- Font Family: Poppins (Google Fonts)
- All elements use default typography from `globals.css`
- Rounded corners: `rounded-2xl` (1rem border-radius)

## 🧩 Page Breakdown

### 1. Home Page (`HomePage.tsx`)
- Hero section with animated background gradients
- Feature showcase (4 key features)
- CTA section with gradient background
- Smooth scroll animations

### 2. 3D Simulator (`SimulatorPage.tsx`)
- **Left Sidebar**: Organ library with search & filtering
- **Main Area**: 3D viewer powered by Three.js
- **Modes**: Normal, Dissection, Pathology
- **Interactive Tools**: Mode-specific floating controls
- **Bottom Panel**: Organ information (slide-up)
- **Quiz Overlay**: Interactive anatomy quiz

### 3. Learn/Play Page (`LearnPage.tsx`)
Two main tabs:
- **Multiplayer Medical Rescue**:
  - Scenario cards with difficulty levels
  - Live session preview with team chat
  - Patient vitals monitoring panel
  - Role-based collaboration
  
- **Adaptive Quiz Engine**:
  - Progress tracking with score
  - Multiple choice questions
  - Instant feedback with correct/incorrect indicators
  - Animated transitions

### 4. Ask Page (`AskPage.tsx`)
Two interfaces:
- **MediBot AI**:
  - Full-screen chat interface
  - AI-powered responses with citations
  - Professional medical assistant UX
  
- **Ask a Professor**:
  - Question submission form
  - Query status tracking (Pending/Answered)
  - Professor response display

### 5. Profile Page (`ProfilePage.tsx`)
- User header with level & XP progress
- Stats grid (4 key metrics)
- Achievement badges (6 total, unlockable)
- Dual leaderboards:
  - Quiz Rankings
  - Multiplayer Team Rankings
- Animated rank transitions

## 🔧 Key Components

### Theme Management
```tsx
import { useTheme } from './components/ThemeProvider';
const { theme, toggleTheme } = useTheme();
```

### 3D Viewer Integration
- Uses Three.js for 3D rendering
- Placeholder geometry (ready for Unity WebGL / Babylon.js)
- Mode-aware rendering (normal, dissection, pathology)
- Responsive and performance-optimized

### Chatbot System
- Floating button (bottom-right)
- Slide-over panel (doesn't interrupt workflow)
- Mock AI responses (ready for backend integration)
- "Ask a Professor" modal with form submission

## 🎭 Animations & Interactions

All animations use Motion (Framer Motion):
- Page transitions: Fade + slide
- Hover effects: Scale (1.05) + shadow
- Card reveals: Stagger animation with delay
- Loading states: Skeleton screens
- Smooth scroll behavior enabled globally

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: `sm:`, `md:`, `lg:`
- Mobile menu for navigation
- Stack layouts for small screens
- Touch-friendly button sizes (min 44x44px)

## 🔌 Backend Integration Points

### Ready for Connection:
1. **3D Viewer** (`/components/3d/Viewer.tsx`)
   - Replace placeholder geometry with Unity WebGL or real models
   - Add model loading from API

2. **Chatbot** (`/components/chatbot/ChatPanel.tsx`)
   - Connect to AI backend (OpenAI, custom model)
   - Add real-time streaming responses

3. **Quiz System** (`LearnPage.tsx`, `SimulatorPage.tsx`)
   - Fetch questions from database
   - Save user progress & scores

4. **User Profile** (`ProfilePage.tsx`)
   - Load user data from authentication system
   - Update stats, badges, leaderboard from API

5. **Multiplayer** (`LearnPage.tsx`)
   - WebSocket integration for real-time collaboration
   - Shared state management

## 🚀 Key Features

✅ Full dark/light mode with persistence
✅ Smooth page transitions
✅ Interactive 3D viewer (Three.js)
✅ Gamified learning system
✅ AI chatbot interface
✅ Multiplayer scenario preview
✅ Achievement system
✅ Leaderboards
✅ Responsive design
✅ Custom scrollbar styling
✅ Loading states
✅ Toast notifications (Sonner)
✅ Modular component architecture

## 🎯 Next Steps for Production

1. **Backend Integration**
   - Set up authentication (Firebase, Supabase, Auth0)
   - Create REST or GraphQL API for data
   - Add WebSocket for multiplayer

2. **3D Models**
   - Integrate real anatomical 3D models
   - Add Unity WebGL build or Babylon.js scenes
   - Implement model streaming

3. **AI/ML**
   - Connect to medical AI model
   - Add adaptive quiz algorithm
   - Implement personalized learning paths

4. **Database**
   - User profiles & progress
   - Quiz questions & scenarios
   - Leaderboard data
   - Chat history

5. **Analytics**
   - Track user engagement
   - Monitor learning progress
   - A/B testing for features

## 📝 Code Conventions

- TypeScript for type safety
- Functional components with hooks
- Props interfaces defined inline
- Motion for all animations
- Tailwind for all styling (no inline styles except where necessary)
- Component-based architecture
- Reusable UI components in `/components/ui/`

## 🌐 Philosophy

**"See. Interact. Practice. Collaborate."**

Every element supports this core philosophy:
- **See**: 3D visualization with multiple viewing modes
- **Interact**: Touch-based controls, quizzes, simulations
- **Practice**: Scenarios, quizzes, adaptive learning
- **Collaborate**: Multiplayer scenarios, team chat, leaderboards

---

**Built with ❤️ for medical students worldwide**
