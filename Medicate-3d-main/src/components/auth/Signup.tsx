import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, UserPlus, User, GraduationCap, BookOpen } from 'lucide-react';

interface SignupProps {
  onSignup: (name: string, email: string, password: string, role: 'student' | 'educator') => void;
  onSwitchToLogin: () => void;
  onClose?: () => void;
}

export function Signup({ onSignup, onSwitchToLogin, onClose }: SignupProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<'student' | 'educator'>('student');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name) {
      newErrors.name = 'Name is required';
    } else if (name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        onSignup(name, email, password, role);
      } catch (error: any) {
        console.error("Signup error:", error);
        let errorMessage = "Failed to create account.";
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = "Email is already in use.";
        } else if (error.code === 'auth/weak-password') {
          errorMessage = "Password is too weak.";
        }
        setErrors({ ...errors, email: errorMessage });
        toast.error(errorMessage);
      }
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
              <UserPlus size={32} className="text-white" />
            </motion.div>
            <h2 className="text-foreground mb-2">Create Account</h2>
            <p className="text-muted-foreground text-sm">
              Join thousands of medical professionals learning smarter
            </p>
          </div>

          {/* Role Selection Toggle */}
          <div className="mb-6">
            <label className="block text-sm mb-3 text-foreground text-center">Sign up as</label>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                type="button"
                onClick={() => setRole('student')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'student'
                    ? 'border-[#00A896] bg-[#00A896]/10'
                    : 'border-border hover:border-[#00A896]/50'
                  }`}
              >
                <GraduationCap size={24} className={role === 'student' ? 'text-[#00A896]' : 'text-muted-foreground'} />
                <span className={`text-sm ${role === 'student' ? 'text-[#00A896]' : 'text-muted-foreground'}`}>
                  Student
                </span>
              </motion.button>

              <motion.button
                type="button"
                onClick={() => setRole('educator')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'educator'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-border hover:border-emerald-500/50'
                  }`}
              >
                <BookOpen size={24} className={role === 'educator' ? 'text-emerald-500' : 'text-muted-foreground'} />
                <span className={`text-sm ${role === 'educator' ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                  Educator
                </span>
              </motion.button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm mb-2 text-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'student' ? 'John Doe' : 'Dr. John Doe'}
                  className="w-full pl-11 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A896] transition-all"
                />
              </div>
              {errors.name && (
                <p className="text-[#EF476F] text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
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
              {errors.email && (
                <p className="text-[#EF476F] text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
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
              {errors.password && (
                <p className="text-[#EF476F] text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm mb-2 text-foreground">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A896] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[#EF476F] text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className={`w-full py-3 text-white rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg ${role === 'student'
                  ? 'bg-[#00A896] hover:bg-[#008f7f] shadow-[#00A896]/30'
                  : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:shadow-emerald-500/30'
                }`}
            >
              <UserPlus size={20} />
              Create {role === 'student' ? 'Student' : 'Educator'} Account
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Switch to Login */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-[#00A896] hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>

        {/* Privacy Note */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          By signing up, you agree to Meducate's Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
