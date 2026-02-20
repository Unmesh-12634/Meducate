# MediVerse Authentication Flow & New Features

## Overview
MediVerse has been restructured with a proper authentication flow, landing page, dashboard, and enhanced features.

## Application Flow

### 1. Landing Page (Public)
- **Route**: Default entry point when not authenticated
- **Features**:
  - Hero section with "See. Interact. Practice. Collaborate." tagline
  - Feature showcase (3D simulations, collaborative learning, AI assistance, adaptive quizzes)
  - Login and Sign Up buttons
  - Statistics (10,000+ students, 500+ scenarios, 95% pass rate)
  - Call-to-action sections
- **Navigation**: Simple navbar with logo, theme toggle, login, and signup buttons

### 2. Authentication
- **Login**: Click "Login" button → Simulated authentication → Redirected to Dashboard
- **Sign Up**: Click "Sign Up" button → Simulated registration → Redirected to Dashboard
- **Note**: Currently uses simulated authentication. In production, integrate with Supabase or your preferred auth provider.

### 3. Dashboard (Authenticated)
- **Route**: Main hub after login
- **Features**:
  - Welcome message with study streak
  - Quick stats (Study Streak, Quiz Score, Rank, Hours This Week)
  - Recommended content based on user progress
  - Recent activity feed
  - Upcoming challenges/tournaments
  - Quick action buttons (Enter 3D Lab, Join Multiplayer, Ask MediBot)
- **Navigation**: Full navbar with Dashboard, 3D Lab, Play, Ask, Profile

### 4. Main Sections (Authenticated Only)

#### 3D Lab (formerly Simulator)
- Interactive 3D anatomical models
- Organ library with detailed information
- Multiple viewing modes
- Ready for Unity WebGL or Three.js integration

#### Play (Gamified Learning)
- **Multiplayer Tab**: Collaborative medical scenarios
  - Active sessions with live player indicators
  - Team chat
  - Patient vitals monitoring
  - Emergency scenarios
  
- **Tournaments Tab** (NEW):
  - Weekly Championship (live tournaments)
  - Daily Blitz Challenge
  - Monthly Masters League
  - Specialty Tournaments (Cardiology Cup, Trauma Challenge)
  
- **Speed Run Tab** (NEW):
  - CPR Mastery challenge
  - Diagnosis Sprint
  - Anatomy Race
  - Medication Match
  - Triage Challenge
  - Real-time leaderboards
  
- **Quiz Tab**: Adaptive quizzes with progress tracking

#### Ask (MediBot)
- AI-powered Q&A system
- Context-aware responses
- Quick suggestions
- Medical knowledge base

#### Profile (Editable)
- **View Mode**:
  - User information display
  - Level and XP progress
  - Stats (Quiz Accuracy, Procedures Done, Win Rate, Study Time)
  - Achievements/Badges
  - Leaderboards (Quiz Rankings, Multiplayer)
  
- **Edit Mode** (NEW):
  - Editable fields:
    - Full Name
    - Email
    - Institution
    - Specialty
    - Graduation Year
    - Location
    - Bio
  - Avatar upload button
  - Save/Cancel actions
  - Form validation ready

### 5. Logout
- **Desktop**: Click avatar → Dropdown menu → Logout
- **Mobile**: Menu → Logout button
- Returns to Landing Page

## New Components

### Pages
- `/components/pages/LandingPage.tsx` - Public landing page
- `/components/pages/DashboardPage.tsx` - Main authenticated dashboard
- `/components/pages/EditableProfilePage.tsx` - Profile with edit functionality

### Navigation
- `/components/LandingNavbar.tsx` - Simplified navbar for public pages
- Updated `/components/Navbar.tsx` - Full navbar with user menu and logout

### Updated Features
- `/components/pages/LearnPage.tsx` - Now includes 4 tabs:
  - Multiplayer (existing)
  - Tournaments (new)
  - Speed Run (new)
  - Quiz (existing)

## Key Changes

### Navigation Updates
1. **Simulator** → **3D Lab** (renamed in navbar)
2. **Home** → **Dashboard** (for authenticated users)
3. Added user avatar menu with Profile and Logout options

### Competition Types
Previously had only 2 types (Multiplayer, Quiz), now includes:
- **Multiplayer**: Team-based medical scenarios
- **Tournaments**: Competitive events with prizes
- **Speed Run**: Time-based challenges with leaderboards
- **Quiz**: Adaptive learning assessments

### Profile Enhancements
- Fully editable profile information
- Bio/description field
- Avatar upload capability
- Professional information (specialty, graduation year)
- Save/Cancel functionality

## Theme System
- Maintains existing light/dark mode
- Teal (#00A896), Yellow (#FFD166), Pink-Red (#EF476F) color scheme
- Light mode: Cream background (#FAF9F6)
- Dark mode: True black background (#0A0A0A)
- Poppins font family

## Technical Implementation

### State Management
```typescript
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [currentPage, setCurrentPage] = useState<Page>('landing');
```

### Authentication Functions
- `handleLogin()`: Simulates login, sets authenticated state
- `handleSignup()`: Simulates signup, sets authenticated state
- `handleLogout()`: Clears authenticated state, returns to landing

### Conditional Rendering
```typescript
{isAuthenticated ? (
  <Navbar onLogout={handleLogout} />
) : (
  <LandingNavbar onLogin={handleLogin} onSignup={handleSignup} />
)}
```

## Next Steps for Production

### Backend Integration
1. Replace simulated auth with real authentication (Supabase recommended)
2. Connect profile edit to API endpoints
3. Implement real-time features for multiplayer
4. Add tournament registration and management
5. Integrate leaderboard with live data

### Features to Add
1. Password reset functionality
2. Email verification
3. OAuth providers (Google, GitHub)
4. User settings page
5. Notification system
6. Achievement tracking system

### Data Persistence
1. Save user progress
2. Store competition results
3. Track badges and achievements
4. Maintain leaderboard rankings
5. Store 3D viewer preferences

## File Structure
```
/components
  /pages
    - LandingPage.tsx (new)
    - DashboardPage.tsx (new)
    - EditableProfilePage.tsx (new)
    - LearnPage.tsx (updated)
    - SimulatorPage.tsx
    - AskPage.tsx
  - LandingNavbar.tsx (new)
  - Navbar.tsx (updated)
  - ThemeProvider.tsx
  - Footer.tsx
  /chatbot
  /3d
  /ui
```

## Design Philosophy
The application follows the MediVerse philosophy:
**"See. Interact. Practice. Collaborate."**

- **See**: Visual 3D anatomy and clear UI
- **Interact**: Hands-on simulations and challenges
- **Practice**: Speed runs, quizzes, and scenarios
- **Collaborate**: Multiplayer sessions and tournaments
