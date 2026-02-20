import { motion } from 'motion/react';
import { 
  Play, 
  Users, 
  Brain, 
  Stethoscope, 
  GraduationCap, 
  Zap, 
  LogIn, 
  UserPlus,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Award,
  Globe,
  Clock,
  Target,
  Sparkles,
  Quote
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

export function LandingPage({ onLogin, onSignup }: LandingPageProps) {
  const features = [
    {
      icon: Stethoscope,
      title: '3D Medical Simulations',
      description: 'Explore detailed 3D anatomical models with interactive controls',
    },
    {
      icon: Users,
      title: 'Collaborative Learning',
      description: 'Team up with peers in multiplayer medical scenarios',
    },
    {
      icon: Brain,
      title: 'AI-Powered Assistance',
      description: 'Get instant answers from MediBot, your 24/7 medical AI',
    },
    {
      icon: GraduationCap,
      title: 'Adaptive Quizzes',
      description: 'Personalized learning paths that adapt to your progress',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Active Students', icon: Users },
    { value: '500+', label: 'Medical Scenarios', icon: Stethoscope },
    { value: '95%', label: 'Pass Rate', icon: TrendingUp },
    { value: '24/7', label: 'AI Support', icon: Brain },
  ];

  const steps = [
    {
      step: 1,
      title: 'See',
      description: 'Visualize complex anatomy in stunning 3D detail',
      icon: Target,
      color: '#00A896',
    },
    {
      step: 2,
      title: 'Interact',
      description: 'Manipulate models and explore every angle',
      icon: Users,
      color: '#FFD166',
    },
    {
      step: 3,
      title: 'Practice',
      description: 'Apply knowledge in realistic scenarios',
      icon: Brain,
      color: '#EF476F',
    },
    {
      step: 4,
      title: 'Collaborate',
      description: 'Learn together with global medical students',
      icon: Globe,
      color: '#028090',
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Medical Student, Harvard',
      avatar: '👩‍⚕️',
      quote: 'MeduCate transformed my learning experience. The 3D visualizations helped me ace anatomy!',
      rating: 5,
    },
    {
      name: 'Mike Rodriguez',
      role: 'Pre-Med, Stanford',
      avatar: '👨‍⚕️',
      quote: 'The collaborative scenarios are incredibly realistic. It feels like actual clinical practice.',
      rating: 5,
    },
    {
      name: 'Emma Watson',
      role: 'Medical Student, Oxford',
      avatar: '👩‍⚕️',
      quote: 'MediBot is like having a professor available 24/7. Absolutely game-changing!',
      rating: 5,
    },
  ];

  const benefits = [
    'Master complex anatomy with interactive 3D models',
    'Practice emergency scenarios in a safe environment',
    'Track your progress with detailed analytics',
    'Compete in global medical tournaments',
    'Access 500+ peer-reviewed scenarios',
    'Learn at your own pace with adaptive AI',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00A896]/10 via-background to-[#EF476F]/10" />
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00A896]/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#EF476F]/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/2 right-1/3 w-64 h-64 bg-[#FFD166]/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#00A896]/10 border border-[#00A896]/30 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Sparkles size={16} className="text-[#00A896]" />
              <span className="text-[#00A896] text-sm">Welcome to the Future of Medical Education</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl text-foreground max-w-4xl mx-auto">
              Learn. Simulate.{' '}
              <motion.span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A896] to-[#028090]"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                Heal.
              </motion.span>
            </h1>

            <motion.p 
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Redefining Medical Learning Through Immersive Intelligence. 
              AI. 3D. Realism. The Future of Medical Education.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                onClick={onSignup}
                className="px-8 py-4 bg-[#00A896] text-white rounded-2xl hover:bg-[#008f7f] transition-all flex items-center gap-2 shadow-lg shadow-[#00A896]/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <UserPlus size={20} />
                Sign Up Free
                <ArrowRight size={20} />
              </motion.button>
              <motion.button
                onClick={onLogin}
                className="px-8 py-4 bg-transparent border-2 border-border text-foreground rounded-2xl hover:bg-muted transition-all flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogIn size={20} />
                Login
              </motion.button>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {stats.slice(0, 3).map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                >
                  <stat.icon size={16} className="text-[#FFD166]" />
                  <span className="text-foreground">{stat.value}</span>
                  <span>{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 text-center"
              >
                <stat.icon size={32} className="mx-auto mb-3 text-[#00A896]" />
                <h3 className="text-3xl text-foreground mb-1">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our proven 4-step methodology that helps medical students excel
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -10 }}
                className="relative bg-card border border-border rounded-2xl p-6 text-center"
              >
                <div 
                  className="absolute -top-4 -right-4 w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-lg"
                  style={{ backgroundColor: step.color }}
                >
                  {step.step}
                </div>
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${step.color}20` }}
                >
                  <step.icon size={32} style={{ color: step.color }} />
                </div>
                <h3 className="text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase with Images */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl text-foreground mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A comprehensive platform designed to transform how you learn and practice medicine
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#00A896]/20 flex items-center justify-center mb-4">
                <Stethoscope size={28} className="text-[#00A896]" />
              </div>
              <h3 className="text-2xl mb-3">Interactive 3D Simulations</h3>
              <p className="text-muted-foreground mb-4">
                Explore anatomical structures in stunning detail with our cutting-edge 3D technology. 
                Rotate, zoom, and dissect virtual models to understand complex medical concepts.
              </p>
              <ul className="space-y-2">
                {['High-fidelity 3D models', 'Real-time manipulation', 'Layer-by-layer exploration'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle size={16} className="text-[#00A896]" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden shadow-xl"
            >
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1656428964836-78d54bf76231?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMG1lZGljYWwlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MTk5Mzc0MHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="3D Medical Technology"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Feature 2 - Reversed */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden shadow-xl order-2 lg:order-1"
            >
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1758574437870-f83c160efd82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3JzJTIwY29sbGFib3JhdGlvbiUyMHRlYW18ZW58MXx8fHwxNzYxOTkzNzQxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Doctors Collaboration"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center order-1 lg:order-2"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#FFD166]/20 flex items-center justify-center mb-4">
                <Users size={28} className="text-[#FFD166]" />
              </div>
              <h3 className="text-2xl mb-3">Collaborative Learning</h3>
              <p className="text-muted-foreground mb-4">
                Join forces with medical students worldwide in multiplayer scenarios. Practice teamwork, 
                communication, and decision-making in realistic clinical situations.
              </p>
              <ul className="space-y-2">
                {['Real-time collaboration', 'Global student network', 'Peer learning sessions'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle size={16} className="text-[#FFD166]" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#EF476F]/20 flex items-center justify-center mb-4">
                <Brain size={28} className="text-[#EF476F]" />
              </div>
              <h3 className="text-2xl mb-3">AI-Powered Learning</h3>
              <p className="text-muted-foreground mb-4">
                Get instant answers and personalized guidance from MediBot, available 24/7. 
                Our AI adapts to your learning style and helps you master difficult concepts.
              </p>
              <ul className="space-y-2">
                {['Instant AI responses', 'Adaptive learning paths', 'Personalized recommendations'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle size={16} className="text-[#EF476F]" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden shadow-xl"
            >
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1758691462848-ba1e929da259?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBoZWFsdGhjYXJlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjE5OTM3NDF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Modern Healthcare Technology"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-card border border-border rounded-2xl p-6 text-center"
              >
                <motion.div 
                  className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#00A896] to-[#028090] flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon size={28} className="text-white" />
                </motion.div>
                <h3 className="text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl text-foreground mb-4">
              Loved by Medical Students Worldwide
            </h2>
            <p className="text-muted-foreground text-lg">
              See what students are saying about MeduCate
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -5 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-[#FFD166] fill-[#FFD166]" />
                  ))}
                </div>
                <Quote size={24} className="text-[#00A896]/30 mb-3" />
                <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00A896]/20 flex items-center justify-center text-xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl text-foreground mb-4">
              Why Choose MeduCate?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 bg-card border border-border rounded-2xl p-4"
              >
                <CheckCircle size={24} className="text-[#00A896] flex-shrink-0" />
                <p className="text-sm">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-[#00A896] to-[#028090] rounded-3xl overflow-hidden relative"
        >
          <div className="absolute inset-0 opacity-10">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1659353887222-630895f23cc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwYWNoaWV2ZW1lbnQlMjBzdWNjZXNzfGVufDF8fHx8MTc2MTk5Mzc0Mnww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Success"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative p-12 text-center text-white">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6 backdrop-blur-sm"
            >
              <Award size={16} />
              <span className="text-sm">Join 10,000+ Medical Students</span>
            </motion.div>
            <h2 className="text-4xl mb-4">Ready to Transform Your Learning?</h2>
            <p className="text-white/90 text-lg mb-8">
              Join thousands of medical students who are already learning smarter, not harder
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={onSignup}
                className="px-8 py-3 bg-white text-[#00A896] rounded-2xl hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Free
                <ArrowRight size={20} />
              </motion.button>
              <motion.button
                onClick={onLogin}
                className="px-8 py-3 border-2 border-white text-white rounded-2xl hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login to Dashboard
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
