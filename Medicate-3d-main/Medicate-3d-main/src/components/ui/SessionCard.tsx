import { motion } from 'motion/react';
import { Users, Activity, Send, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface SessionCardProps {
  roomId: string;
  roomName: string;
  scenario: string;
  playersReady: number;
  totalPlayers: number;
  isLive: boolean;
  image: string;
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
  onJoin?: () => void;
  onJoinAsLead?: () => void;
}

export function SessionCard({
  roomId,
  roomName,
  scenario,
  playersReady,
  totalPlayers,
  isLive,
  image,
  vitals,
  chatMessages,
  onJoin,
  onJoinAsLead,
}: SessionCardProps) {
  const [message, setMessage] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleJoinAsLead = () => {
    if (onJoinAsLead) onJoinAsLead();
    if (onJoin) onJoin();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-card border border-border rounded-2xl overflow-hidden hover:border-[#00A896] hover:shadow-xl hover:shadow-[#00A896]/10 transition-all"
    >
      {/* Image Header */}
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={scenario}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        {isLive && (
          <motion.div
            animate={{ scale: isHovered ? 1.1 : 1 }}
            className="absolute top-4 right-4"
          >
            <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs flex items-center gap-2 shadow-lg">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-2 h-2 rounded-full bg-white"
              />
              Live
            </span>
          </motion.div>
        )}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white drop-shadow-lg mb-1">{roomName}</h3>
          <p className="text-white/90 text-sm drop-shadow-md">
            {scenario}
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Player Avatars & Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {Array.from({ length: playersReady }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.2, zIndex: 10 }}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00A896] to-[#028090] border-2 border-background cursor-pointer"
                />
              ))}
              {Array.from({ length: totalPlayers - playersReady }).map((_, i) => (
                <motion.div
                  key={`empty-${i}`}
                  whileHover={{ scale: 1.2, zIndex: 10 }}
                  className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs text-muted-foreground cursor-pointer"
                >
                  ?
                </motion.div>
              ))}
            </div>
            <div>
              <p className="text-sm">{playersReady}/{totalPlayers} Players</p>
              <p className="text-xs text-muted-foreground">
                {totalPlayers - playersReady} slot{totalPlayers - playersReady !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Users className="text-[#FFD166]" size={24} />
          </motion.div>
        </div>

        {/* Grid Layout for Vitals and Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Patient Vitals */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-muted rounded-xl p-4"
          >
            <h4 className="text-sm mb-3 flex items-center gap-2">
              <Activity size={16} className="text-[#EF476F]" />
              Patient Vitals
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-background rounded-lg p-3 cursor-pointer"
              >
                <p className="text-xs text-muted-foreground mb-1">Heart Rate</p>
                <p className="text-lg text-[#EF476F] flex items-center gap-1">
                  <Activity size={16} />
                  {vitals.heartRate}
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-background rounded-lg p-3 cursor-pointer"
              >
                <p className="text-xs text-muted-foreground mb-1">Blood Pressure</p>
                <p className="text-lg">{vitals.bloodPressure}</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-background rounded-lg p-3 cursor-pointer"
              >
                <p className="text-xs text-muted-foreground mb-1">O₂ Saturation</p>
                <p className="text-lg text-[#FFD166]">{vitals.o2Saturation}</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-background rounded-lg p-3 cursor-pointer"
              >
                <p className="text-xs text-muted-foreground mb-1">Temperature</p>
                <p className="text-lg">{vitals.temperature}</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Team Chat Preview */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-muted rounded-xl p-4 flex flex-col"
          >
            <h4 className="text-sm mb-3">Team Chat</h4>
            <div className="flex-1 space-y-2 mb-3 min-h-[120px] max-h-[150px] overflow-y-auto">
              {chatMessages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ x: 2 }}
                  className="bg-background rounded-lg p-2 cursor-pointer"
                >
                  <p className="text-xs mb-1" style={{ color: msg.color }}>
                    {msg.sender}
                  </p>
                  <p className="text-sm">{msg.message}</p>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Quick message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#00A896] transition-all text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-[#00A896] text-white rounded-lg hover:bg-[#008f7f] transition-all"
              >
                <Send size={16} />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Join Button */}
        <motion.button
          onClick={handleJoinAsLead}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-gradient-to-br from-[#00A896] to-[#028090] text-white rounded-xl hover:shadow-lg hover:shadow-[#00A896]/30 transition-all flex items-center justify-center gap-2 group"
        >
          <span>Join as Lead Physician</span>
          <motion.div
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronRight size={20} />
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  );
}
