import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: LucideIcon;
  className?: string;
  disabled?: boolean;
}

export function PrimaryButton({
  children,
  onClick,
  icon: Icon,
  className = '',
  disabled = false,
}: PrimaryButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-2xl bg-[#00A896] text-white flex items-center gap-2 justify-center transition-all hover:bg-[#008f7f] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      whileHover={!disabled ? { scale: 1.05, boxShadow: '0 10px 30px rgba(0, 168, 150, 0.3)' } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {Icon && <Icon size={20} />}
      {children}
    </motion.button>
  );
}
