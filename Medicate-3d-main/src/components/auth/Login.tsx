import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, LogIn, GraduationCap, BookOpen, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, password: string, role: 'student' | 'educator') => void;
  onSwitchToSignup: () => void;
  onClose?: () => void;
}

// Google's official SVG logo
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  );
}

export function Login({ onLogin, onSwitchToSignup }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'student' | 'educator'>('student');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin(email, password, role);
    } catch (error: any) {
      let errorMessage = 'Failed to sign in. Please check your credentials.';
      if (error.code === 'auth/invalid-credential') errorMessage = 'Invalid email or password.';
      else if (error.code === 'auth/user-not-found') errorMessage = 'No account found with this email.';
      else if (error.code === 'auth/wrong-password') errorMessage = 'Incorrect password.';
      setErrors({ ...errors, email: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      toast.success(`Welcome, ${user.displayName || user.email}!`);
      onLogin(user.email ?? '', '', role);
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        return; // user dismissed — not an error
      }
      const msg =
        error.code === 'auth/unauthorized-domain'
          ? 'This domain is not authorized. Add it in Firebase Console → Authentication → Settings → Authorized Domains.'
          : 'Google sign-in failed. Please try again.';
      toast.error(msg);
      console.error('Google login error:', error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-[#00A896]/5">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#00A896] to-[#028090] flex items-center justify-center"
            >
              <LogIn size={32} className="text-white" />
            </motion.div>
            <h2 className="text-foreground mb-2">Welcome Back</h2>
            <p className="text-muted-foreground text-sm">
              Sign in to continue your medical learning journey
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm mb-3 text-foreground text-center">Login as</label>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                type="button"
                onClick={() => setRole('student')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'student'
                  ? 'border-[#00A896] bg-[#00A896]/10'
                  : 'border-border hover:border-[#00A896]/50'}`}
              >
                <GraduationCap size={24} className={role === 'student' ? 'text-[#00A896]' : 'text-muted-foreground'} />
                <span className={`text-sm ${role === 'student' ? 'text-[#00A896]' : 'text-muted-foreground'}`}>Student</span>
              </motion.button>

              <motion.button
                type="button"
                onClick={() => setRole('educator')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'educator'
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-border hover:border-emerald-500/50'}`}
              >
                <BookOpen size={24} className={role === 'educator' ? 'text-emerald-500' : 'text-muted-foreground'} />
                <span className={`text-sm ${role === 'educator' ? 'text-emerald-500' : 'text-muted-foreground'}`}>Educator</span>
              </motion.button>
            </div>
          </div>

          {/* ── Google Sign-In ── */}
          <motion.button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            whileHover={{ scale: googleLoading ? 1 : 1.02 }}
            whileTap={{ scale: googleLoading ? 1 : 0.98 }}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 border-border bg-card hover:bg-muted transition-all font-medium text-sm mb-5 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            {googleLoading
              ? <Loader2 size={20} className="animate-spin text-muted-foreground" />
              : <GoogleIcon />
            }
            <span className="text-foreground">
              {googleLoading ? 'Signing in with Google...' : 'Continue with Google'}
            </span>
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or sign in with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-2 text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A896] transition-all"
                />
              </div>
              {errors.email && <p className="text-[#EF476F] text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm mb-2 text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A896] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-[#EF476F] text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="text-right">
              <button type="button" className="text-sm text-[#00A896] hover:underline">
                Forgot password?
              </button>
            </div>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading || googleLoading}
              className={`w-full py-3 text-white rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed ${role === 'student'
                ? 'bg-[#00A896] hover:bg-[#008f7f] shadow-[#00A896]/30'
                : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:shadow-emerald-500/30'}`}
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <LogIn size={20} />}
              {loading ? 'Signing in...' : `Sign In as ${role === 'student' ? 'Student' : 'Educator'}`}
            </motion.button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{' '}
            <button type="button" onClick={onSwitchToSignup} className="text-[#00A896] hover:underline">
              Sign up for free
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          By continuing, you agree to Meducate's Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
