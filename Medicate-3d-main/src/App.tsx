import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ThemeProvider } from './components/ThemeProvider';
import type { Language } from './services/GeminiService';
import i18n from './i18n';
import { Navbar } from './components/Navbar';
import { LandingNavbar } from './components/LandingNavbar';
import { Footer } from './components/Footer';
import { ChatButton } from './components/chatbot/ChatButton';
import { ChatPanel } from './components/chatbot/ChatPanel';
import { LandingPage } from './components/pages/LandingPage';
import { Login } from './components/auth/Login';
import { Signup } from './components/auth/Signup';
import { DashboardPage } from './components/pages/DashboardPage';
import { SimulatorPage } from './components/pages/SimulatorPage';
import { LearnPage } from './components/pages/LearnPage';
import { PlayPage } from './components/pages/PlayPage';
import { JoinPhysician } from './components/pages/JoinPhysician';
import { StartSimulation } from './components/pages/StartSimulation';
import { SimulationInterface } from './components/pages/SimulationInterface';
import { AskPage } from './components/pages/AskPage';
import { EditableProfilePage } from './components/pages/EditableProfilePage';
import { ProgressPage } from './components/pages/ProgressPage';
import { EducatorDashboard } from './components/pages/educator/EducatorDashboard';
import { CourseManagement } from './components/pages/educator/CourseManagement';
import { SimulationManager } from './components/pages/educator/SimulationManager';
import { AnalyticsPage } from './components/pages/educator/AnalyticsPage';
import { CommunicationPanel } from './components/pages/educator/CommunicationPanel';
import { AssessmentCenter } from './components/pages/educator/AssessmentCenter';
import { ResourceLibrary } from './components/pages/educator/ResourceLibrary';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

import { AuthProvider, useAuth } from './context/AuthContext';

type Page = 'landing' | 'login' | 'signup' | 'dashboard' | 'simulator' | 'learn' | 'play' | 'join-physician' | 'start-simulation' | 'simulation-interface' | 'ask' | 'profile' | 'progress' |
  'educator-dashboard' | 'educator-courses' | 'educator-simulations' | 'educator-analytics' | 'educator-communication' | 'educator-assessments' | 'educator-resources' | 'educator-profile' | 'educator-course-edit';

type UserRole = 'student' | 'educator';

function AppContent() {
  const { user, loading, logout } = useAuth();
  // We can derive role from user profile or custom claims, but for now we'll keep it simple or store it in local state if needed.
  // For this demo, we'll default to 'student' or let the login set it (though context handles the user object).
  // To keep the existing role logic working without a backend database for roles, we might need a small workaround or just assume student for now.
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [chatOpen, setChatOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [userName, setUserName] = useState('Dr. Smith');
  const [sessionData] = useState({
    roomName: 'Room: ER-Alpha-7',
    scenario: 'Emergency cardiac arrest scenario in progress',
    image: 'https://images.unsplash.com/photo-1550831106-f8d5b6f1abe9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWVyZ2VuY3klMjBtZWRpY2FsJTIwdGVhbXxlbnwxfHx8fDE3NjE5NDczMDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  });

  useEffect(() => {
    if (user) {
      setUserName(user.displayName || user.email?.split('@')[0] || 'User');
      if (['landing', 'login', 'signup'].includes(currentPage)) {
        setCurrentPage('dashboard');
      }
    } else {
      if (!['landing', 'login', 'signup'].includes(currentPage)) {
        setCurrentPage('landing');
      }
    }
  }, [user]);

  // Keep i18next in sync with language toggle and persist choice
  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('meducate_lang', language);
  }, [language]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading...</div>;
  }

  const isAuthenticated = !!user;

  const handleShowLogin = () => {
    setCurrentPage('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowSignup = () => {
    setCurrentPage('signup');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (_email: string, _password: string, role: UserRole) => {
    // Firebase handles the actual login in the component, this just updates local UI state if needed
    setUserRole(role);
    // Navigation is handled by the useEffect above
    toast.success(`Welcome back!`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignup = (name: string, _email: string, _password: string, role: UserRole) => {
    // Firebase handles the signup
    setUserRole(role);
    toast.success(`Welcome to Meducate, ${name}!`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await logout();
    setUserRole('student');
    setCurrentPage('landing');
    setUserName('');
    toast.success('You have been logged out.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    if (!isAuthenticated) {
      switch (currentPage) {
        case 'login':
          return <Login onLogin={handleLogin} onSwitchToSignup={handleShowSignup} />;
        case 'signup':
          return <Signup onSignup={handleSignup} onSwitchToLogin={handleShowLogin} />;
        default:
          return <LandingPage onLogin={handleShowLogin} onSignup={handleShowSignup} />;
      }
    }

    // Educator Pages
    if (userRole === 'educator') {
      switch (currentPage) {
        case 'educator-dashboard':
          return <EducatorDashboard onNavigate={handleNavigate} userName={userName} />;
        case 'educator-courses':
          return <CourseManagement onNavigate={handleNavigate} />;
        case 'educator-simulations':
          return <SimulationManager />;
        case 'educator-analytics':
          return <AnalyticsPage />;
        case 'educator-communication':
          return <CommunicationPanel />;
        case 'educator-assessments':
          return <AssessmentCenter />;
        case 'educator-resources':
          return <ResourceLibrary />;
        case 'educator-profile':
        case 'profile':
          return <EditableProfilePage userName={userName} onUpdateName={setUserName} />;
        default:
          return <EducatorDashboard onNavigate={handleNavigate} userName={userName} />;
      }
    }

    // Student Pages
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} userName={userName} />;
      case 'simulator':
        return <SimulatorPage />;
      case 'learn':
        return <LearnPage />;
      case 'play':
        return <PlayPage onNavigate={handleNavigate} />;
      case 'join-physician':
        return (
          <JoinPhysician
            onNavigate={handleNavigate}
            onStartSimulation={() => handleNavigate('start-simulation')}
            sessionData={sessionData}
          />
        );
      case 'start-simulation':
        return (
          <StartSimulation
            onNavigate={handleNavigate}
            onStartFullSimulation={() => {
              handleNavigate('simulation-interface');
              toast.success('Launching simulation interface...');
            }}
            sessionData={sessionData}
          />
        );
      case 'simulation-interface':
        return (
          <SimulationInterface
            onNavigate={handleNavigate}
            onEndSimulation={() => {
              handleNavigate('play');
              toast.success('Simulation ended. Great work!');
            }}
          />
        );
      case 'ask':
        return <AskPage language={language} />;
      case 'profile':
        return <EditableProfilePage userName={userName} onUpdateName={setUserName} />;
      case 'progress':
        return <ProgressPage />;
      default:
        return <DashboardPage onNavigate={handleNavigate} userName={userName} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        {isAuthenticated && currentPage !== 'simulation-interface' ? (
          <Navbar currentPage={currentPage} onNavigate={handleNavigate} onLogout={handleLogout} userRole={userRole} language={language} setLanguage={setLanguage} />
        ) : currentPage === 'landing' && (
          <LandingNavbar onLogin={handleShowLogin} onSignup={handleShowSignup} />
        )}

        <AnimatePresence mode="wait">
          <motion.main
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.main>
        </AnimatePresence>

        {isAuthenticated && currentPage !== 'simulator' && currentPage !== 'ask' && currentPage !== 'start-simulation' && currentPage !== 'simulation-interface' && <Footer />}

        {isAuthenticated && currentPage !== 'ask' && userRole === 'student' && (
          <>
            <ChatButton onClick={() => setChatOpen(true)} />
            <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
          </>
        )}

        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
