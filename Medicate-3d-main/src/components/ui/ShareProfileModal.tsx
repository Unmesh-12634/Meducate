import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Download, Share2, QrCode, Check } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

interface ShareProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userLevel: number;
  userAvatar?: string;
}

export function ShareProfileModal({ isOpen, onClose, userName, userLevel, userAvatar }: ShareProfileModalProps) {
  const [copied, setCopied] = useState(false);
  
  // Generate a unique profile URL (in production, this would be real)
  const profileUrl = `https://meducate.app/profile/${userName.toLowerCase().replace(/\s+/g, '-')}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    // In production, this would generate and download an actual QR code
    alert('QR Code download feature - would download the QR code image');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="bg-background border-2 border-[#00A896] rounded-3xl overflow-hidden max-w-md w-full shadow-2xl"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-[#00A896] to-[#028090] p-6 text-white">
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X size={20} />
              </motion.button>
              
              <div className="flex items-center gap-2 mb-4">
                <Share2 size={24} />
                <h2>Share Profile</h2>
              </div>
              <p className="text-white/80 text-sm">Share your MeduCate profile with others</p>
            </div>

            {/* Profile Card */}
            <div className="p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-card to-muted border-2 border-border rounded-2xl p-6 mb-6"
              >
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="w-16 h-16 border-4 border-[#00A896]/30">
                    <AvatarImage src={userAvatar} />
                    <AvatarFallback className="bg-gradient-to-br from-[#00A896] to-[#028090] text-white text-xl">
                      {userName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="mb-1">{userName}</h3>
                    <p className="text-sm text-muted-foreground">Level {userLevel} • MeduCate</p>
                  </div>
                </div>

                {/* QR Code Placeholder */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-xl mb-4 flex items-center justify-center border-2 border-dashed border-[#00A896]/30"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="w-32 h-32 mx-auto mb-3 bg-gradient-to-br from-[#00A896] to-[#028090] rounded-xl flex items-center justify-center"
                    >
                      <QrCode size={64} className="text-white" />
                    </motion.div>
                    <p className="text-sm text-muted-foreground">Scan to view profile</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      QR Code for {userName}
                    </p>
                  </div>
                </motion.div>

                {/* Profile Link */}
                <div className="bg-muted rounded-xl p-4 border border-border">
                  <p className="text-xs text-muted-foreground mb-2">Profile URL</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm flex-1 truncate text-[#00A896]">{profileUrl}</p>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleCopyLink}
                      className={`p-2 rounded-lg transition-all ${
                        copied 
                          ? 'bg-green-500 text-white' 
                          : 'bg-[#00A896] text-white hover:bg-[#008f7f]'
                      }`}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopyLink}
                  className="py-3 bg-gradient-to-br from-[#00A896] to-[#028090] text-white rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#00A896]/30"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownloadQR}
                  className="py-3 border-2 border-[#00A896] text-[#00A896] rounded-xl flex items-center justify-center gap-2 hover:bg-[#00A896]/10 transition-all"
                >
                  <Download size={18} />
                  <span>Save QR</span>
                </motion.button>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 p-3 bg-[#FFD166]/10 border border-[#FFD166]/30 rounded-xl"
              >
                <p className="text-xs text-center text-muted-foreground">
                  Anyone with this link or QR code can view your public profile
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
