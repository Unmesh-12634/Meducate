import { Moon, Sun, LogIn, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from './ThemeProvider';

interface LandingNavbarProps {
  onLogin: () => void;
  onSignup: () => void;
}

export function LandingNavbar({ onLogin, onSignup }: LandingNavbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00A896] to-[#028090] flex items-center justify-center">
              <span className="text-white">M</span>
            </div>
            <span className="text-[#00A896]">Meducate</span>
          </motion.div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-muted hover:bg-accent hover:text-accent-foreground transition-all"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>

            <motion.button
              onClick={onLogin}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-foreground hover:bg-muted transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogIn size={18} />
              Login
            </motion.button>

            <motion.button
              onClick={onSignup}
              className="flex items-center gap-2 px-4 py-2 bg-[#00A896] text-white rounded-xl hover:bg-[#008f7f] transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <UserPlus size={18} />
              Sign Up
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
