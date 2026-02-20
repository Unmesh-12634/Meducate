import { motion } from 'motion/react';
import { Award, Lock } from 'lucide-react';

interface BadgeCardProps {
  title: string;
  description: string;
  unlocked: boolean;
  icon?: string;
}

export function BadgeCard({ title, description, unlocked, icon }: BadgeCardProps) {
  return (
    <motion.div
      className={`bg-card border border-border rounded-2xl p-6 text-center ${
        !unlocked && 'opacity-50'
      }`}
      whileHover={unlocked ? { scale: 1.05 } : {}}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: unlocked ? 1 : 0.5, scale: 1 }}
    >
      <div className="relative">
        <div
          className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
            unlocked
              ? 'bg-gradient-to-br from-[#FFD166] to-[#EF476F]'
              : 'bg-muted'
          }`}
        >
          {unlocked ? (
            <Award size={40} className="text-white" />
          ) : (
            <Lock size={40} className="text-muted-foreground" />
          )}
        </div>
        {unlocked && (
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <div className="w-full h-full rounded-full bg-[#FFD166]/30" />
          </motion.div>
        )}
      </div>
      <h4 className="text-foreground mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
}
