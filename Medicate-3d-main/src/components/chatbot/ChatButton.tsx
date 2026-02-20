import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';

interface ChatButtonProps {
  onClick: () => void;
}

export function ChatButton({ onClick }: ChatButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-[#00A896] to-[#028090] rounded-full flex items-center justify-center shadow-lg z-50"
      whileHover={{ scale: 1.1, boxShadow: '0 10px 30px rgba(0, 168, 150, 0.4)' }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <MessageCircle size={24} className="text-white" />
      <motion.div
        className="absolute inset-0 rounded-full bg-[#00A896]"
        initial={{ scale: 1, opacity: 0.5 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.button>
  );
}
