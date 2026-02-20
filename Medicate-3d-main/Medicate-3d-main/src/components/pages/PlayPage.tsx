import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Trophy, Award, X, Activity, Users, MessageCircle, Send, ChevronRight, Clock, Zap, Target } from 'lucide-react';
import { SessionCard } from '../ui/SessionCard';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface SessionBoardProps {
  session: {
    roomId: string;
    roomName: string;
    scenario: string;
    playersReady: number;
    totalPlayers: number;
    vitals: {
      heartRate: string;
      bloodPressure: string;
      o2Saturation: string;
      temperature: string;
    };
    chatMessages: {
      sender: string;
      message: string;
      color: string;
    }[];
    image: string;
  };
  onClose: () => void;
}

function SessionBoard({ session, onClose }: SessionBoardProps) {
  const [chatInput, setChatInput] = useState('');
  const [localMessages, setLocalMessages] = useState(session.chatMessages);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMessage = {
      sender: 'You',
      message: chatInput,
      color: '#00A896',
    };
    setLocalMessages([...localMessages, newMessage]);
    setChatInput('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-background border-2 border-[#00A896] rounded-3xl overflow-hidden max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header with Image */}
        <div className="relative h-48 overflow-hidden">
          <ImageWithFallback
            src={session.image}
            alt={session.scenario}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-4 right-4 w-10 h-10 bg-background/90 backdrop-blur-sm border border-border rounded-full flex items-center justify-center hover:border-[#EF476F] transition-colors"
          >
            <X size={20} />
          </motion.button>
          <div className="absolute bottom-4 left-6">
            <div className="flex items-center gap-2 mb-2">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="px-3 py-1 bg-green-500 text-white rounded-full text-xs flex items-center gap-1"
              >
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Live Session
              </motion.span>
              <span className="px-3 py-1 bg-background/90 backdrop-blur-sm border border-border rounded-full text-xs">
                {session.playersReady}/{session.totalPlayers} Players
              </span>
            </div>
            <h2 className="text-white drop-shadow-lg">{session.roomName}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Scenario Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#00A896]/10 to-[#028090]/10 border border-[#00A896]/30 rounded-2xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00A896] to-[#028090] flex items-center justify-center flex-shrink-0">
                <Target size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2">Scenario Briefing</h3>
                <p className="text-muted-foreground">{session.scenario}</p>
              </div>
            </div>
          </motion.div>

          {/* Grid: Vitals and Team */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient Vitals */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Activity className="text-[#EF476F]" size={20} />
                <h3>Patient Vitals Monitor</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Heart Rate', value: session.vitals.heartRate, color: '#EF476F', icon: Activity },
                  { label: 'BP', value: session.vitals.bloodPressure, color: '#00A896', icon: Zap },
                  { label: 'O₂ Saturation', value: session.vitals.o2Saturation, color: '#FFD166', icon: Activity },
                  { label: 'Temperature', value: session.vitals.temperature, color: '#00A896', icon: Zap },
                ].map((vital, idx) => (
                  <motion.div
                    key={vital.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + idx * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="bg-muted rounded-xl p-4 border border-border hover:border-[#00A896] transition-all cursor-pointer"
                  >
                    <p className="text-xs text-muted-foreground mb-2">{vital.label}</p>
                    <p className="text-xl" style={{ color: vital.color }}>
                      {vital.value}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Team Members */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Users className="text-[#FFD166]" size={20} />
                <h3>Team Members</h3>
              </div>
              <div className="space-y-3">
                {['Dr. Sarah Chen (Lead)', 'Dr. James Wilson', 'Nurse Emma Davis', 'You (Joining)'].map((member, idx) => (
                  <motion.div
                    key={member}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 p-3 bg-muted rounded-xl hover:bg-muted/70 transition-all cursor-pointer"
                  >
                    <div
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00A896] to-[#028090] flex items-center justify-center text-white"
                    >
                      {member.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{member}</p>
                      {member === 'You (Joining)' && (
                        <motion.div
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="text-xs text-[#00A896]"
                        >
                          Connecting...
                        </motion.div>
                      )}
                    </div>
                    {member === 'Dr. Sarah Chen (Lead)' && (
                      <span className="px-2 py-1 bg-[#FFD166]/20 text-[#FFD166] rounded-lg text-xs">
                        Lead
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Live Chat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="text-[#00A896]" size={20} />
              <h3>Team Communication</h3>
            </div>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {localMessages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-muted rounded-xl p-3"
                >
                  <p className="text-xs mb-1" style={{ color: msg.color }}>
                    {msg.sender}
                  </p>
                  <p className="text-sm text-foreground">{msg.message}</p>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Type your message to the team..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-4 py-3 rounded-xl bg-muted border border-border focus:outline-none focus:border-[#00A896] transition-all"
              />
              <motion.button
                onClick={handleSendMessage}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-br from-[#00A896] to-[#028090] text-white rounded-xl flex items-center gap-2 shadow-lg shadow-[#00A896]/30"
              >
                <Send size={18} />
                Send
              </motion.button>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-4 bg-gradient-to-br from-[#00A896] to-[#028090] text-white rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#00A896]/30"
            >
              <Play size={20} />
              Start Simulation
            </motion.button>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-muted text-foreground rounded-2xl hover:bg-muted/70 transition-all"
            >
              Leave
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface PlayPageProps {
  onNavigate?: (page: string) => void;
}

export function PlayPage({ onNavigate }: PlayPageProps) {
  const [sessionCount, setSessionCount] = useState(4);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  const initialSessions = [
    {
      roomId: '7',
      roomName: 'Room: ER-Alpha-7',
      scenario: 'Emergency cardiac arrest scenario in progress',
      playersReady: 2,
      totalPlayers: 3,
      isLive: true,
      image: 'https://images.unsplash.com/photo-1550831106-f8d5b6f1abe9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWVyZ2VuY3klMjBtZWRpY2FsJTIwdGVhbXxlbnwxfHx8fDE3NjE5NDczMDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      vitals: {
        heartRate: '142 bpm',
        bloodPressure: '90/60',
        o2Saturation: '88%',
        temperature: '38.5°C',
      },
      chatMessages: [
        { sender: 'Dr. Smith', message: 'Starting CPR now', color: '#00A896' },
        { sender: 'Nurse Johnson', message: 'Administering epinephrine', color: '#FFD166' },
      ],
    },
    {
      roomId: '12',
      roomName: 'Room: ICU-Beta-12',
      scenario: 'Post-operative hemorrhage management',
      playersReady: 1,
      totalPlayers: 4,
      isLive: true,
      image: 'https://images.unsplash.com/photo-1631201039086-1405a889c699?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3NwaXRhbCUyMGludGVuc2l2ZSUyMGNhcmV8ZW58MXx8fHwxNzYxODU2Njk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      vitals: {
        heartRate: '118 bpm',
        bloodPressure: '85/55',
        o2Saturation: '92%',
        temperature: '37.2°C',
      },
      chatMessages: [
        { sender: 'Dr. Chen', message: 'Checking vitals', color: '#00A896' },
        { sender: 'Dr. Martinez', message: 'Preparing transfusion', color: '#EF476F' },
      ],
    },
    {
      roomId: '5',
      roomName: 'Room: Trauma-Gamma-5',
      scenario: 'Multi-vehicle accident with multiple casualties',
      playersReady: 3,
      totalPlayers: 5,
      isLive: true,
      image: 'https://images.unsplash.com/photo-1761881917053-a48d16611196?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdHJhdW1hJTIwY2VudGVyfGVufDF8fHx8MTc2MTk0NzMwNHww&ixlib=rb-4.1.0&q=80&w=1080',
      vitals: {
        heartRate: '135 bpm',
        bloodPressure: '70/45',
        o2Saturation: '85%',
        temperature: '36.8°C',
      },
      chatMessages: [
        { sender: 'Dr. Williams', message: 'Priority triage in progress', color: '#00A896' },
        { sender: 'Nurse Davis', message: 'IV access established', color: '#FFD166' },
        { sender: 'Dr. Taylor', message: 'Requesting CT scan', color: '#EF476F' },
      ],
    },
    {
      roomId: '19',
      roomName: 'Room: Peds-Delta-19',
      scenario: 'Pediatric respiratory distress syndrome',
      playersReady: 2,
      totalPlayers: 3,
      isLive: true,
      image: 'https://images.unsplash.com/photo-1631201039086-1405a889c699?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWRpYXRyaWMlMjBob3NwaXRhbHxlbnwxfHx8fDE3NjE5NDczMDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      vitals: {
        heartRate: '165 bpm',
        bloodPressure: '95/65',
        o2Saturation: '90%',
        temperature: '39.1°C',
      },
      chatMessages: [
        { sender: 'Dr. Anderson', message: 'Administering oxygen', color: '#00A896' },
        { sender: 'Nurse Brown', message: 'Monitoring closely', color: '#FFD166' },
      ],
    },
  ];

  const extraSession = {
    roomId: '23',
    roomName: 'Room: Surgery-Epsilon-23',
    scenario: 'Complex surgical procedure with complications',
    playersReady: 1,
    totalPlayers: 4,
    isLive: true,
    image: 'https://images.unsplash.com/photo-1632679090212-612ac1f4d76f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwY29tcGV0aXRpb24lMjB0cm9waHl8ZW58MXx8fHwxNzYxOTQ3MzA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    vitals: {
      heartRate: '128 bpm',
      bloodPressure: '110/70',
      o2Saturation: '94%',
      temperature: '37.8°C',
    },
    chatMessages: [
      { sender: 'Dr. Roberts', message: 'Preparing surgical field', color: '#00A896' },
    ],
  };

  const activeSessions = sessionCount === 5 ? [...initialSessions, extraSession] : initialSessions;

  const handleJoinAsLead = () => {
    if (onNavigate) {
      onNavigate('join-physician');
    } else {
      setSessionCount(5);
    }
  };

  return (
    <>
      <div className="min-h-screen pt-20 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
              >
                <Play className="text-[#00A896]" size={32} />
              </motion.div>
              <h1>Join Active Session</h1>
            </div>
            <p className="text-muted-foreground">
              Jump into live medical scenarios and collaborate with other healthcare professionals
            </p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-gradient-to-br from-[#00A896]/20 to-[#028090]/20 border border-[#00A896]/30 rounded-2xl p-4 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Active Sessions</p>
                  <motion.p
                    key={sessionCount}
                    initial={{ scale: 1.5, color: '#00A896' }}
                    animate={{ scale: 1, color: 'inherit' }}
                    className="text-2xl text-foreground"
                  >
                    {sessionCount}
                  </motion.p>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Play className="text-[#00A896]" size={32} />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-gradient-to-br from-[#FFD166]/20 to-[#FFD166]/10 border border-[#FFD166]/30 rounded-2xl p-4 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Players Online</p>
                  <p className="text-2xl text-foreground">247</p>
                </div>
                <Trophy className="text-[#FFD166]" size={32} />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-gradient-to-br from-[#EF476F]/20 to-[#EF476F]/10 border border-[#EF476F]/30 rounded-2xl p-4 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Your Success Rate</p>
                  <p className="text-2xl text-foreground">89%</p>
                </div>
                <Award className="text-[#EF476F]" size={32} />
              </div>
            </motion.div>
          </motion.div>

          {/* Active Sessions Grid - 2 per row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {activeSessions.map((session, index) => (
                <motion.div
                  key={session.roomId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="group"
                >
                  <SessionCard
                    {...session}
                    onJoin={() => setSelectedSession(session)}
                    onJoinAsLead={handleJoinAsLead}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* No Sessions Message (if empty) */}
          {activeSessions.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Play className="mx-auto mb-4 text-muted-foreground" size={64} />
              <h3 className="text-muted-foreground mb-2">No Active Sessions</h3>
              <p className="text-muted-foreground text-sm">
                Check back soon or create your own session from the Learn section
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Session Board Modal */}
      <AnimatePresence>
        {selectedSession && (
          <SessionBoard
            session={selectedSession}
            onClose={() => setSelectedSession(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
