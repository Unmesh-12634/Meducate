import { useState } from 'react';
import { motion } from 'motion/react';
import { Users, MessageCircle, Heart, Activity, TrendingUp, Play, Clock, Star } from 'lucide-react';
import { ScenarioCard } from '../ui/ScenarioCard';

export function MultiplayerLearnPage() {
  const scenarios = [
    {
      id: '1',
      title: 'Emergency Cardiac Arrest',
      description: 'A 65-year-old patient presents with sudden chest pain and loses consciousness. Work as a team to stabilize.',
      difficulty: 'Hard' as const,
      duration: '15 min',
      image: 'https://images.unsplash.com/photo-1758574437870-f83c160efd82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjB0ZWFtJTIwY29sbGFib3JhdGlvbnxlbnwxfHx8fDE3NjE5MTI4MzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '2',
      title: 'Pediatric Respiratory Distress',
      description: 'A 3-year-old child arrives with difficulty breathing. Diagnose and treat as a coordinated team.',
      difficulty: 'Medium' as const,
      duration: '10 min',
      image: 'https://images.unsplash.com/photo-1562411054-261f857a7c62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMG1lZGljYWwlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MTgxNTMwN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '3',
      title: 'Trauma Assessment',
      description: 'Multiple trauma patient from a vehicle accident. Perform primary and secondary survey.',
      difficulty: 'Hard' as const,
      duration: '20 min',
      image: 'https://images.unsplash.com/photo-1743767587835-7a80fe384236?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwYW5hdG9teSUyMDNkfGVufDF8fHx8MTc2MTkxMjgyOXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '4',
      title: 'Post-Op Monitoring',
      description: 'Monitor a patient recovering from surgery. Identify complications early.',
      difficulty: 'Easy' as const,
      duration: '8 min',
    },
    {
      id: '5',
      title: 'Stroke Protocol',
      description: 'Patient showing signs of acute stroke. Time is brain - act fast!',
      difficulty: 'Hard' as const,
      duration: '12 min',
    },
    {
      id: '6',
      title: 'Sepsis Management',
      description: 'Early recognition and treatment of septic patient in the ER.',
      difficulty: 'Medium' as const,
      duration: '18 min',
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-2">Collaborative Learning</h1>
          <p className="text-muted-foreground">
            Team up with peers in realistic multiplayer medical scenarios
          </p>
        </motion.div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-[#00A896]/20 flex items-center justify-center">
              <Users size={24} className="text-[#00A896]" />
            </div>
            <div>
              <p className="text-2xl text-foreground">1,234</p>
              <p className="text-sm text-muted-foreground">Active Players</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FFD166]/20 flex items-center justify-center">
              <Heart size={24} className="text-[#FFD166]" />
            </div>
            <div>
              <p className="text-2xl text-foreground">89%</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-[#EF476F]/20 flex items-center justify-center">
              <TrendingUp size={24} className="text-[#EF476F]" />
            </div>
            <div>
              <p className="text-2xl text-foreground">24</p>
              <p className="text-sm text-muted-foreground">Your Rank</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-[#028090]/20 flex items-center justify-center">
              <Star size={24} className="text-[#028090]" />
            </div>
            <div>
              <p className="text-2xl text-foreground">127</p>
              <p className="text-sm text-muted-foreground">Scenarios Done</p>
            </div>
          </motion.div>
        </div>

        {/* Available Scenarios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="mb-6">Available Scenarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenarios.map((scenario, index) => (
              <ScenarioCard
                key={scenario.id}
                {...scenario}
                onStart={() => alert(`Starting scenario: ${scenario.title}`)}
              />
            ))}
          </div>
        </motion.div>

        {/* Active Session Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3>Join Active Session</h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live Sessions: 12
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-muted rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm">Room: ER-Alpha-7</h4>
                  <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs">Live</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Emergency cardiac arrest scenario in progress. 2/3 players ready.
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex -space-x-2">
                    {[1, 2].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00A896] to-[#028090] border-2 border-background" />
                    ))}
                    <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                      ?
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">Waiting for 1 more player</span>
                </div>
                <button className="w-full py-3 bg-[#00A896] text-white rounded-xl hover:bg-[#008f7f] transition-all flex items-center justify-center gap-2">
                  <Play size={18} />
                  Join as Lead Physician
                </button>
              </div>

              {/* Patient Vitals Panel */}
              <div className="bg-muted rounded-2xl p-6">
                <h4 className="text-sm mb-4">Patient Vitals</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-background rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">Heart Rate</p>
                    <p className="text-2xl text-[#EF476F] flex items-center gap-2">
                      <Activity size={20} />
                      142 bpm
                    </p>
                  </div>
                  <div className="bg-background rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">Blood Pressure</p>
                    <p className="text-2xl">90/60</p>
                  </div>
                  <div className="bg-background rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">O₂ Saturation</p>
                    <p className="text-2xl text-[#FFD166]">88%</p>
                  </div>
                  <div className="bg-background rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">Temperature</p>
                    <p className="text-2xl">38.5°C</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Panel */}
            <div className="bg-muted rounded-2xl p-6 flex flex-col h-[500px]">
              <h4 className="text-sm mb-4">Team Chat</h4>
              <div className="flex-1 space-y-3 overflow-y-auto mb-4">
                <div className="bg-background rounded-xl p-3">
                  <p className="text-xs text-[#00A896] mb-1">Dr. Smith</p>
                  <p className="text-sm">Starting CPR now</p>
                  <p className="text-xs text-muted-foreground mt-1">2 min ago</p>
                </div>
                <div className="bg-background rounded-xl p-3">
                  <p className="text-xs text-[#FFD166] mb-1">Nurse Johnson</p>
                  <p className="text-sm">Administering epinephrine</p>
                  <p className="text-xs text-muted-foreground mt-1">1 min ago</p>
                </div>
                <div className="bg-background rounded-xl p-3">
                  <p className="text-xs text-[#EF476F] mb-1">You</p>
                  <p className="text-sm">Checking airway</p>
                  <p className="text-xs text-muted-foreground mt-1">30 sec ago</p>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type message..."
                  className="flex-1 px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                />
                <button className="p-3 bg-[#00A896] text-white rounded-xl hover:bg-[#008f7f] transition-all">
                  <MessageCircle size={20} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
