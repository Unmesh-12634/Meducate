import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ChevronRight, 
  User, 
  Stethoscope, 
  Activity, 
  Brain, 
  Heart,
  Award,
  Clock,
  Users,
  Target,
  Zap
} from 'lucide-react';

interface JoinPhysicianProps {
  onNavigate: (page: string) => void;
  onStartSimulation: () => void;
  sessionData: {
    roomName: string;
    scenario: string;
    image: string;
  };
}

export function JoinPhysician({ onNavigate, onStartSimulation, sessionData }: JoinPhysicianProps) {
  const roleOptions = [
    {
      id: 'lead',
      title: 'Lead Physician',
      description: 'Take charge of the medical team and make critical decisions',
      icon: Stethoscope,
      color: '#00A896',
      bgColor: 'from-[#00A896]/20 to-[#028090]/20',
      borderColor: 'border-[#00A896]/30',
      recommended: true,
    },
    {
      id: 'resident',
      title: 'Resident Physician',
      description: 'Support the lead physician and learn from the experience',
      icon: User,
      color: '#FFD166',
      bgColor: 'from-[#FFD166]/20 to-[#FFD166]/10',
      borderColor: 'border-[#FFD166]/30',
      recommended: false,
    },
    {
      id: 'nurse',
      title: 'Registered Nurse',
      description: 'Provide essential patient care and assist the medical team',
      icon: Heart,
      color: '#EF476F',
      bgColor: 'from-[#EF476F]/20 to-[#EF476F]/10',
      borderColor: 'border-[#EF476F]/30',
      recommended: false,
    },
  ];

  const specialties = [
    { id: 'emergency', label: 'Emergency Medicine', icon: Zap },
    { id: 'cardiology', label: 'Cardiology', icon: Heart },
    { id: 'neurology', label: 'Neurology', icon: Brain },
    { id: 'surgery', label: 'General Surgery', icon: Activity },
  ];

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-background to-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground"
        >
          <motion.button
            onClick={() => onNavigate('dashboard')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hover:text-[#00A896] transition-colors"
          >
            Dashboard
          </motion.button>
          <ChevronRight size={16} />
          <motion.button
            onClick={() => onNavigate('play')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hover:text-[#00A896] transition-colors"
          >
            Simulator
          </motion.button>
          <ChevronRight size={16} />
          <span className="text-foreground">Join as Lead Physician</span>
        </motion.div>

        {/* Back Button */}
        <motion.button
          onClick={() => onNavigate('play')}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-[#00A896] transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Sessions
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="mb-2">Select Your Role</h1>
          <p className="text-muted-foreground">
            Choose your role for {sessionData.roomName} - {sessionData.scenario}
          </p>
        </motion.div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {roleOptions.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className={`relative bg-gradient-to-br ${role.bgColor} border ${role.borderColor} rounded-2xl p-6 cursor-pointer group overflow-hidden`}
            >
              {role.recommended && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                  className="absolute top-4 right-4 bg-gradient-to-r from-[#FFD166] to-[#FFB422] text-white px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-lg border-2 border-white/20"
                >
                  <Award size={14} className="fill-white" />
                  Recommended
                </motion.div>
              )}

              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${
                  role.id === 'lead' ? 'from-[#00A896] to-[#028090]' :
                  role.id === 'resident' ? 'from-[#FFD166] to-[#FFD166]/80' :
                  'from-[#EF476F] to-[#EF476F]/80'
                } flex items-center justify-center mb-4 shadow-lg`}
              >
                <role.icon className="text-white" size={32} />
              </motion.div>

              <h3 className="mb-2">{role.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{role.description}</p>

              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-2 text-sm"
                style={{ color: role.color }}
              >
                Select Role
                <ChevronRight size={16} />
              </motion.div>

              {/* Hover Effect */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 2, opacity: 0.1 }}
                className="absolute inset-0 bg-gradient-to-br"
                style={{
                  background: `radial-gradient(circle at center, ${role.color}, transparent)`,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Additional Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-2xl p-8 mb-8"
        >
          <h2 className="mb-6">Simulation Configuration</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Specialty Selection */}
            <div>
              <label className="block text-sm mb-3 flex items-center gap-2">
                <Target size={16} className="text-[#00A896]" />
                Preferred Specialty
              </label>
              <div className="space-y-2">
                {specialties.map((specialty, index) => (
                  <motion.button
                    key={specialty.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 p-4 bg-muted rounded-xl hover:bg-[#00A896]/10 hover:border-[#00A896] border border-transparent transition-all group"
                  >
                    <specialty.icon size={20} className="text-muted-foreground group-hover:text-[#00A896] transition-colors" />
                    <span className="flex-1 text-left">{specialty.label}</span>
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="w-5 h-5 rounded-full border-2 border-[#00A896] flex items-center justify-center"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00A896]" />
                    </motion.div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div>
              <label className="block text-sm mb-3 flex items-center gap-2">
                <Activity size={16} className="text-[#EF476F]" />
                Your Performance Stats
              </label>
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-[#00A896]/20 to-[#028090]/20 border border-[#00A896]/30 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                    <Award size={16} className="text-[#00A896]" />
                  </div>
                  <p className="text-2xl text-[#00A896]">89%</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.75 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-[#FFD166]/20 to-[#FFD166]/10 border border-[#FFD166]/30 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Simulations Completed</span>
                    <Target size={16} className="text-[#FFD166]" />
                  </div>
                  <p className="text-2xl text-[#FFD166]">47</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-[#EF476F]/20 to-[#EF476F]/10 border border-[#EF476F]/30 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Avg. Response Time</span>
                    <Clock size={16} className="text-[#EF476F]" />
                  </div>
                  <p className="text-2xl text-[#EF476F]">2.4s</p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <motion.button
            onClick={onStartSimulation}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-12 py-4 bg-gradient-to-br from-[#00A896] to-[#028090] text-white rounded-2xl shadow-lg shadow-[#00A896]/30 flex items-center justify-center gap-3 group"
          >
            <span className="text-lg">Continue to Setup</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ChevronRight size={24} />
            </motion.div>
          </motion.button>

          <motion.button
            onClick={() => onNavigate('play')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-8 py-4 bg-muted hover:bg-muted/70 text-foreground rounded-2xl transition-all"
          >
            Cancel
          </motion.button>
        </motion.div>

        {/* Info Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Users size={14} />
            3 team members are waiting in the session
          </p>
        </motion.div>
      </div>
    </div>
  );
}
