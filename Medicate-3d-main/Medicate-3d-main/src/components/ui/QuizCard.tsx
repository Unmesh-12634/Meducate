import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';

interface QuizCardProps {
  question: string;
  options: string[];
  selectedAnswer?: number;
  correctAnswer?: number;
  onSelect: (index: number) => void;
  showResult?: boolean;
}

export function QuizCard({
  question,
  options,
  selectedAnswer,
  correctAnswer,
  onSelect,
  showResult = false,
}: QuizCardProps) {
  return (
    <motion.div
      className="bg-card border border-border rounded-2xl p-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <h3 className="text-foreground mb-6">{question}</h3>
      
      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = correctAnswer === index;
          const showCorrect = showResult && isCorrect;
          const showIncorrect = showResult && isSelected && !isCorrect;

          return (
            <motion.button
              key={index}
              onClick={() => !showResult && onSelect(index)}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                showCorrect
                  ? 'border-green-500 bg-green-500/10'
                  : showIncorrect
                  ? 'border-[#EF476F] bg-[#EF476F]/10'
                  : isSelected
                  ? 'border-[#00A896] bg-[#00A896]/10'
                  : 'border-border hover:border-[#00A896]/50'
              }`}
              whileHover={!showResult ? { x: 5 } : {}}
              whileTap={!showResult ? { scale: 0.98 } : {}}
            >
              <span className={showCorrect || showIncorrect ? 'text-foreground' : ''}>{option}</span>
              {showCorrect && (
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <Check size={16} className="text-white" />
                </div>
              )}
              {showIncorrect && (
                <div className="w-6 h-6 rounded-full bg-[#EF476F] flex items-center justify-center">
                  <X size={16} className="text-white" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
