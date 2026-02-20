import { Moon, Sun, Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from './ThemeProvider';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout?: () => void;
  userRole?: 'student' | 'educator';
}

export function Navbar({ currentPage, onNavigate, onLogout, userRole = 'student' }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'simulator', label: '3D Lab' },
    { id: 'learn', label: 'Learn' },
    { id: 'play', label: 'Simulator' },
    { id: 'ask', label: 'Ask' },
    { id: 'progress', label: 'Progress' },
    { id: 'profile', label: 'Profile' },
  ];

  const educatorNavItems = [
    { id: 'educator-dashboard', label: 'Dashboard' },
    { id: 'educator-courses', label: 'Courses' },
    { id: 'educator-simulations', label: 'Simulations' },
    { id: 'educator-analytics', label: 'Analytics' },
    { id: 'educator-communication', label: 'Messages' },
    { id: 'educator-assessments', label: 'Assessments' },
    { id: 'educator-resources', label: 'Resources' },
  ];

  const navItems = userRole === 'educator' ? educatorNavItems : studentNavItems;
  const primaryColor = userRole === 'educator' ? '#10B981' : '#00A896';
  const gradientClass = userRole === 'educator' ? 'from-emerald-500 to-green-600' : 'from-[#00A896] to-[#028090]';

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Animation */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate(userRole === 'educator' ? 'educator-dashboard' : 'dashboard')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-lg`}
            >
              <span className="text-white text-lg">M</span>
            </motion.div>
            <div className="flex items-center gap-2">
              <span 
                className="text-lg font-semibold"
                style={{ color: primaryColor }}
              >
                Meducate
              </span>
              {userRole === 'educator' && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-lg border border-emerald-500/20"
                >
                  Educator
                </motion.span>
              )}
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`px-4 py-2 rounded-xl transition-all relative overflow-hidden group ${
                  currentPage === item.id
                    ? userRole === 'educator'
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-gradient-to-r from-[#00A896] to-[#028090] text-white shadow-lg shadow-[#00A896]/30'
                    : 'text-foreground hover:bg-muted'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentPage === item.id && (
                  <motion.div
                    layoutId={`navbar-${userRole}`}
                    className="absolute inset-0 bg-white/10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 text-sm font-medium">{item.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Theme Toggle & User Menu */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-muted hover:bg-accent hover:text-accent-foreground transition-all"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* User Menu */}
            <div className="hidden md:block relative">
              <motion.button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-xl bg-muted hover:bg-accent transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-md`}
                >
                  <span className="text-white text-sm font-medium">
                    {userRole === 'educator' ? 'ED' : 'ST'}
                  </span>
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-card border-2 border-border rounded-2xl shadow-2xl overflow-hidden"
                  >
                    <motion.button
                      onClick={() => {
                        onNavigate(userRole === 'educator' ? 'educator-profile' : 'profile');
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-muted transition-all flex items-center gap-3 group"
                      whileHover={{ x: 5 }}
                    >
                      <User size={16} className="text-muted-foreground group-hover:text-emerald-500" />
                      <span>Profile</span>
                    </motion.button>
                    {onLogout && (
                      <motion.button
                        onClick={() => {
                          onLogout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-red-500/10 transition-all flex items-center gap-3 text-[#EF476F] group"
                        whileHover={{ x: 5 }}
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-muted"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <X size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <Menu size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                    currentPage === item.id
                      ? userRole === 'educator'
                        ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
                        : 'bg-gradient-to-r from-[#00A896] to-[#028090] text-white'
                      : 'text-foreground hover:bg-muted'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.label}
                </motion.button>
              ))}
              {onLogout && (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-[#EF476F] hover:bg-red-500/10 transition-all flex items-center gap-2"
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut size={18} />
                  Logout
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
