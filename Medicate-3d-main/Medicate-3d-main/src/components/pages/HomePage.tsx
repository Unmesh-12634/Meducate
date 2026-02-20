import { motion } from 'motion/react';
import { Play, Users, Brain, Stethoscope, GraduationCap, Zap } from 'lucide-react';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
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
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              className="inline-block px-4 py-2 bg-[#00A896]/10 border border-[#00A896]/30 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-[#00A896] text-sm">Welcome to the Future of Medical Education</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl text-foreground max-w-4xl mx-auto">
              See. Interact. Practice.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A896] to-[#028090]">
                Collaborate.
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience medical education like never before with AI-powered 3D simulations,
              collaborative learning, and adaptive assessments.
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <PrimaryButton onClick={() => onNavigate('simulator')} icon={Play}>
                Enter Simulation
              </PrimaryButton>
              <SecondaryButton onClick={() => onNavigate('learn')}>
                Join Community
              </SecondaryButton>
            </motion.div>

            <motion.div
              className="flex items-center justify-center gap-8 text-sm text-muted-foreground mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-[#FFD166]" />
                <span>10,000+ Students</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-[#FFD166]" />
                <span>500+ Scenarios</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-[#FFD166]" />
                <span>95% Pass Rate</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-card border border-border rounded-2xl p-6 text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#00A896] to-[#028090] flex items-center justify-center">
                  <feature.icon size={28} className="text-white" />
                </div>
                <h3 className="text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
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
          className="max-w-4xl mx-auto bg-gradient-to-br from-[#00A896] to-[#028090] rounded-3xl p-12 text-center text-white"
        >
          <h2 className="text-4xl mb-4">Ready to Transform Your Learning?</h2>
          <p className="text-white/90 text-lg mb-8">
            Join thousands of medical students who are already learning smarter, not harder
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('simulator')}
              className="px-8 py-3 bg-white text-[#00A896] rounded-2xl hover:bg-white/90 transition-all"
            >
              Get Started Free
            </button>
            <button
              onClick={() => onNavigate('learn')}
              className="px-8 py-3 border-2 border-white text-white rounded-2xl hover:bg-white/10 transition-all"
            >
              View Demo
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
