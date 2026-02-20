import { motion } from 'motion/react';
import { Play, Clock, Award } from 'lucide-react';
import { PrimaryButton } from './PrimaryButton';

interface ScenarioCardProps {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration?: string;
  image?: string;
  onStart: () => void;
}

export function ScenarioCard({
  title,
  description,
  difficulty,
  duration,
  image,
  onStart,
}: ScenarioCardProps) {
  const difficultyColors = {
    Easy: 'bg-green-500',
    Medium: 'bg-[#FFD166]',
    Hard: 'bg-[#EF476F]',
  };

  return (
    <motion.div
      className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {image && (
        <div className="h-48 bg-muted overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-foreground">{title}</h3>
          <span className={`px-3 py-1 rounded-full text-white text-sm ${difficultyColors[difficulty]}`}>
            {difficulty}
          </span>
        </div>
        
        <p className="text-muted-foreground text-sm">{description}</p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {duration && (
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{duration}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Award size={16} />
            <span>+{difficulty === 'Easy' ? '50' : difficulty === 'Medium' ? '100' : '200'} XP</span>
          </div>
        </div>
        
        <PrimaryButton onClick={onStart} icon={Play} className="w-full">
          Start Scenario
        </PrimaryButton>
      </div>
    </motion.div>
  );
}
