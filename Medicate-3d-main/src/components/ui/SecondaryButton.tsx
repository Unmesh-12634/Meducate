import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface SecondaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: LucideIcon;
  className?: string;
  disabled?: boolean;
}

export function SecondaryButton({
  children,
  onClick,
  icon: Icon,
  className = '',
  disabled = false,
}: SecondaryButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-2xl border-2 border-[#00A896] text-[#00A896] flex items-center gap-2 justify-center transition-all hover:bg-[#00A896] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {Icon && <Icon size={20} />}
      {children}
    </motion.button>
  );
}
