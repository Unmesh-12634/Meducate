import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft,
  ChevronRight,
  Play,
  FileText,
  Users,
  Activity,
  Brain,
  Heart,
  Stethoscope,
  Clock,
  Target,
  Zap,
  User,
  Award,
  Settings,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface StartSimulationProps {
  onNavigate: (page: string) => void;
  onStartFullSimulation: () => void;
  sessionData: {
    roomName: string;
    scenario: string;
    image: string;
  };
}

export function StartSimulation({ onNavigate, onStartFullSimulation, sessionData }: StartSimulationProps) {
  const [selectedLevel, setSelectedLevel] = useState('intermediate');
  const [patientCount, setPatientCount] = useState(1);
  const [mode, setMode] = useState<'solo' | 'team'>('team');
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  const levels = [
    { id: 'beginner', label: 'Beginner', color: '#10B981', description: 'Basic scenarios with guidance' },
    { id: 'intermediate', label: 'Intermediate', color: '#FFD166', description: 'Moderate complexity cases' },
    { id: 'advanced', label: 'Advanced', color: '#EF476F', description: 'Complex multi-system cases' },
    { id: 'expert', label: 'Expert', color: '#7C3AED', description: 'Rare and critical conditions' },
  ];

  const specialties = [
    { id: 'cardiology', label: 'Cardiology', icon: Heart, color: '#EF476F' },
    { id: 'emergency', label: 'Emergency Medicine', icon: Zap, color: '#FFD166' },
    { id: 'neurology', label: 'Neurology', icon: Brain, color: '#00A896' },
    { id: 'surgery', label: 'General Surgery', icon: Activity, color: '#7C3AED' },
  ];

  const [selectedSpecialty, setSelectedSpecialty] = useState('emergency');

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-background to-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Header with Logo and Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00A896] to-[#028090] flex items-center justify-center shadow-lg"
            >
              <span className="text-white text-xl">M</span>
            </motion.div>
            <div>
              <h2 className="text-[#00A896]">Meducate</h2>
              <p className="text-xs text-muted-foreground">Start Simulation</p>
            </div>
          </motion.div>

          {/* Breadcrumb and Back */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <span className="cursor-pointer hover:text-[#00A896] transition-colors" onClick={() => onNavigate('dashboard')}>Dashboard</span>
              <ChevronRight size={14} />
              <span className="cursor-pointer hover:text-[#00A896] transition-colors" onClick={() => onNavigate('play')}>Simulator</span>
              <ChevronRight size={14} />
              <span className="cursor-pointer hover:text-[#00A896] transition-colors" onClick={() => onNavigate('join-physician')}>Join</span>
              <ChevronRight size={14} />
              <span className="text-foreground">Start Simulation</span>
            </div>
            
            <motion.button
              onClick={() => onNavigate('dashboard')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/70 rounded-xl transition-all text-sm"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Setup Summary (35%) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Title */}
            <div>
              <h1 className="mb-2">Simulation Overview</h1>
              <p className="text-muted-foreground">Configure your simulation parameters</p>
            </div>

            {/* Selected Specialty */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <label className="block text-sm mb-3 text-muted-foreground">Selected Specialty</label>
              <div className="space-y-2">
                {specialties.map((specialty, index) => (
                  <motion.button
                    key={specialty.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    onClick={() => setSelectedSpecialty(specialty.id)}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all border ${
                      selectedSpecialty === specialty.id
                        ? 'bg-gradient-to-r from-[#00A896]/20 to-[#028090]/20 border-[#00A896]'
                        : 'bg-muted border-transparent hover:border-border'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${specialty.color}20` }}
                    >
                      <specialty.icon size={20} style={{ color: specialty.color }} />
                    </div>
                    <span className="flex-1 text-left">{specialty.label}</span>
                    {selectedSpecialty === specialty.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 rounded-full bg-[#00A896] flex items-center justify-center"
                      >
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Level Selector */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <label className="block text-sm mb-3 text-muted-foreground">Difficulty Level</label>
              <div className="space-y-2">
                {levels.map((level, index) => (
                  <motion.button
                    key={level.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    onClick={() => setSelectedLevel(level.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left p-4 rounded-xl transition-all border ${
                      selectedLevel === level.id
                        ? 'border-2'
                        : 'border-transparent bg-muted hover:bg-muted/70'
                    }`}
                    style={{
                      borderColor: selectedLevel === level.id ? level.color : 'transparent',
                      backgroundColor: selectedLevel === level.id ? `${level.color}15` : undefined,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium" style={{ color: selectedLevel === level.id ? level.color : undefined }}>
                          {level.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{level.description}</p>
                      </div>
                      {selectedLevel === level.id && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: level.color }}
                        >
                          <Target size={14} className="text-white" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Patient Count Slider */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <label className="block text-sm mb-3 text-muted-foreground">Number of Patients</label>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl text-[#00A896]">{patientCount}</span>
                  <span className="text-sm text-muted-foreground">
                    {patientCount === 1 ? 'Single Patient' : 'Multiple Patients'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={patientCount}
                  onChange={(e) => setPatientCount(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-[#00A896]"
                  style={{
                    background: `linear-gradient(to right, #00A896 0%, #00A896 ${(patientCount - 1) * 25}%, #e5e7eb ${(patientCount - 1) * 25}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
              </div>
            </motion.div>

            {/* Mode Toggle */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <label className="block text-sm mb-3 text-muted-foreground">Simulation Mode</label>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  onClick={() => setMode('solo')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl transition-all border ${
                    mode === 'solo'
                      ? 'bg-gradient-to-r from-[#FFD166]/20 to-[#FFD166]/10 border-[#FFD166]'
                      : 'bg-muted border-transparent'
                  }`}
                >
                  <User size={24} className={mode === 'solo' ? 'text-[#FFD166]' : 'text-muted-foreground'} />
                  <p className="mt-2 font-medium">Solo</p>
                  <p className="text-xs text-muted-foreground mt-1">Practice alone</p>
                </motion.button>

                <motion.button
                  onClick={() => setMode('team')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl transition-all border ${
                    mode === 'team'
                      ? 'bg-gradient-to-r from-[#00A896]/20 to-[#028090]/20 border-[#00A896]'
                      : 'bg-muted border-transparent'
                  }`}
                >
                  <Users size={24} className={mode === 'team' ? 'text-[#00A896]' : 'text-muted-foreground'} />
                  <p className="mt-2 font-medium">Team</p>
                  <p className="text-xs text-muted-foreground mt-1">Collaborate</p>
                </motion.button>
              </div>
            </motion.div>

            {/* Lead Physician Details - Collapsible */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-gradient-to-br from-[#00A896]/10 to-[#028090]/10 border border-[#00A896]/30 rounded-2xl overflow-hidden"
            >
              <motion.button
                onClick={() => setDetailsExpanded(!detailsExpanded)}
                className="w-full p-6 flex items-center justify-between"
                whileHover={{ backgroundColor: 'rgba(0, 168, 150, 0.05)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00A896] to-[#028090] flex items-center justify-center">
                    <Stethoscope size={20} className="text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm">Lead Physician Details</h3>
                    <p className="text-xs text-muted-foreground">Your role configuration</p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: detailsExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={20} className="text-[#00A896]" />
                </motion.div>
              </motion.button>

              <motion.div
                initial={{ height: 0 }}
                animate={{ height: detailsExpanded ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-background/50 rounded-xl">
                    <User size={16} className="text-[#00A896]" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="text-sm">Dr. Alex Johnson</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-background/50 rounded-xl">
                    <Stethoscope size={16} className="text-[#00A896]" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Role</p>
                      <p className="text-sm">Lead Physician</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-background/50 rounded-xl">
                    <Award size={16} className="text-[#00A896]" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Experience Level</p>
                      <p className="text-sm">Advanced (89% Success Rate)</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Column - Preview Panel (65%) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Preview Panel */}
            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="mb-6 flex items-center gap-2">
                <Activity className="text-[#00A896]" size={24} />
                AI Simulation Environment Preview
              </h2>

              {/* Preview Frame */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="bg-muted border-2 border-dashed border-border rounded-2xl p-8 mb-6 relative overflow-hidden"
              >
                {/* Simulated Interface Preview */}
                <div className="space-y-4">
                  {/* Simulated Top Bar */}
                  <div className="flex items-center gap-4 pb-4 border-b border-border">
                    <div className="flex-1 h-8 bg-background rounded-lg flex items-center px-3">
                      <Clock size={14} className="text-muted-foreground mr-2" />
                      <div className="h-3 bg-muted-foreground/20 rounded w-24" />
                    </div>
                    <div className="h-8 w-8 bg-background rounded-lg" />
                  </div>

                  {/* Three Column Layout Simulation */}
                  <div className="grid grid-cols-12 gap-4 h-96">
                    {/* Left: Patient Data */}
                    <div className="col-span-3 bg-background rounded-xl p-4 space-y-3">
                      <div className="h-4 bg-[#00A896]/20 rounded w-3/4" />
                      <div className="space-y-2">
                        <div className="h-16 bg-muted rounded-lg" />
                        <div className="h-16 bg-muted rounded-lg" />
                        <div className="h-16 bg-muted rounded-lg" />
                      </div>
                    </div>

                    {/* Center: AI Chat */}
                    <div className="col-span-6 bg-background rounded-xl p-4 flex flex-col">
                      <div className="h-4 bg-[#EF476F]/20 rounded w-1/2 mb-4" />
                      <div className="flex-1 space-y-3 overflow-hidden">
                        <div className="flex gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00A896] to-[#028090]" />
                          <div className="flex-1 h-12 bg-[#00A896]/10 rounded-lg" />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <div className="flex-1 h-12 bg-[#FFD166]/10 rounded-lg max-w-[80%]" />
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD166] to-[#FFD166]/80" />
                        </div>
                        <div className="flex gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00A896] to-[#028090]" />
                          <div className="flex-1 h-12 bg-[#00A896]/10 rounded-lg" />
                        </div>
                      </div>
                      <div className="h-10 bg-muted rounded-lg mt-4" />
                    </div>

                    {/* Right: MCQ Area */}
                    <div className="col-span-3 bg-background rounded-xl p-4 space-y-3">
                      <div className="h-4 bg-[#FFD166]/20 rounded w-2/3" />
                      <div className="space-y-2">
                        <div className="h-10 bg-muted rounded-lg" />
                        <div className="h-10 bg-muted rounded-lg" />
                        <div className="h-10 bg-muted rounded-lg" />
                        <div className="h-10 bg-muted rounded-lg" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overlay Label */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute top-4 right-4 px-3 py-1 bg-[#00A896] text-white rounded-full text-xs flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Live Preview
                </motion.div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-[#00A896]/10 to-[#028090]/10 border border-[#00A896]/20 rounded-xl p-6"
              >
                <div className="flex items-start gap-3">
                  <MessageSquare size={20} className="text-[#00A896] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="mb-2">What to Expect</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      This simulation will begin with a patient presenting symptoms based on your selected specialty. 
                      You'll interact with an AI patient, analyze vital signs, order tests, and make critical medical 
                      decisions. The interface provides real-time patient data, AI-powered conversation, and decision 
                      validation through multiple-choice assessments.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Additional Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-gradient-to-br from-[#00A896]/20 to-[#028090]/20 border border-[#00A896]/30 rounded-xl p-4"
                >
                  <Brain size={20} className="text-[#00A896] mb-2" />
                  <p className="text-sm font-medium mb-1">AI-Powered</p>
                  <p className="text-xs text-muted-foreground">Realistic patient responses</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-gradient-to-br from-[#FFD166]/20 to-[#FFD166]/10 border border-[#FFD166]/30 rounded-xl p-4"
                >
                  <Target size={20} className="text-[#FFD166] mb-2" />
                  <p className="text-sm font-medium mb-1">Adaptive Learning</p>
                  <p className="text-xs text-muted-foreground">Difficulty adjusts to you</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-gradient-to-br from-[#EF476F]/20 to-[#EF476F]/10 border border-[#EF476F]/30 rounded-xl p-4"
                >
                  <Award size={20} className="text-[#EF476F] mb-2" />
                  <p className="text-sm font-medium mb-1">Real-Time Feedback</p>
                  <p className="text-xs text-muted-foreground">Instant performance metrics</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Section - Centered Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 space-y-6"
        >
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              onClick={onStartFullSimulation}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-16 py-5 bg-gradient-to-br from-[#00A896] to-[#028090] text-white rounded-2xl shadow-xl shadow-[#00A896]/30 flex items-center justify-center gap-3 group relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-white/10"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
              />
              <Play size={24} className="relative z-10" />
              <span className="text-lg font-medium relative z-10">Start Simulation</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="relative z-10"
              >
                <ChevronRight size={24} />
              </motion.div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-5 bg-muted hover:bg-muted/70 text-foreground rounded-2xl flex items-center justify-center gap-2 transition-all"
            >
              <FileText size={20} />
              View Instructions
            </motion.button>
          </div>

          {/* Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-2 text-xs text-muted-foreground"
          >
            <AlertCircle size={14} />
            Ensure your AI model is active before starting
          </motion.div>

          {/* System Status Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-6 text-xs"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-muted-foreground">AI Model: Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-muted-foreground">Server: Connected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-muted-foreground">Session: Ready</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
