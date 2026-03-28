import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, VolumeX, RefreshCw, Sparkles } from 'lucide-react';
import { GeminiService } from '../../services/GeminiService';

interface OrganData {
    name: string;
    emoji: string;
    system: string;
    description: string;
    facts: string[];
}

interface OrganExplainerCardProps {
    organ: OrganData | null;
    onClose: () => void;
}

export function OrganExplainerCard({ organ, onClose }: OrganExplainerCardProps) {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [hasSpokeOnce, setHasSpokeOnce] = useState(false);
    const speakingRef = useRef(false);

    // Auto-speak when a new organ is selected
    useEffect(() => {
        if (!organ) return;
        setHasSpokeOnce(false);

        const timer = setTimeout(() => {
            GeminiService.stopSpeech();
            speakingRef.current = true;
            setIsSpeaking(true);
            setHasSpokeOnce(true);
            GeminiService.speakResponse(
                `${organ.name}. ${organ.description}`,
                'en'
            ).then(() => {
                if (speakingRef.current) setIsSpeaking(false);
            });
        }, 400);

        return () => {
            clearTimeout(timer);
            speakingRef.current = false;
            GeminiService.stopSpeech();
            setIsSpeaking(false);
        };
    }, [organ?.name]);

    const handleToggleTTS = () => {
        if (isSpeaking) {
            GeminiService.stopSpeech();
            speakingRef.current = false;
            setIsSpeaking(false);
        } else if (organ) {
            speakingRef.current = true;
            setIsSpeaking(true);
            GeminiService.speakResponse(
                `${organ.name}. ${organ.description}`,
                'en'
            ).then(() => {
                if (speakingRef.current) setIsSpeaking(false);
            });
        }
    };

    const handleReplay = () => {
        if (!organ) return;
        GeminiService.stopSpeech();
        speakingRef.current = true;
        setIsSpeaking(true);
        GeminiService.speakResponse(
            `${organ.name}. ${organ.description}`,
            'en'
        ).then(() => {
            if (speakingRef.current) setIsSpeaking(false);
        });
    };

    return (
        <AnimatePresence>
            {organ && (
                <motion.div
                    key={organ.name}
                    className="absolute bottom-6 left-6 z-40 w-80"
                    initial={{ opacity: 0, y: 30, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 25 }}
                >
                    <div className="bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="relative bg-gradient-to-br from-[#00A896]/20 to-[#028090]/10 px-4 pt-4 pb-3">
                            {/* Glow */}
                            <div className="absolute inset-0 bg-[#00A896]/5 pointer-events-none" />

                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{organ.emoji}</span>
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <h3 className="font-bold text-base">{organ.name}</h3>
                                            {isSpeaking && (
                                                <motion.span
                                                    animate={{ opacity: [1, 0.3, 1] }}
                                                    transition={{ duration: 1, repeat: Infinity }}
                                                >
                                                    <Sparkles size={12} className="text-[#00A896]" />
                                                </motion.span>
                                            )}
                                        </div>
                                        <span className="text-[11px] font-medium text-[#00A896] bg-[#00A896]/10 px-2 py-0.5 rounded-full">
                                            {organ.system}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                    {hasSpokeOnce && (
                                        <button
                                            onClick={handleReplay}
                                            title="Replay narration"
                                            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                        >
                                            <RefreshCw size={13} />
                                        </button>
                                    )}
                                    <button
                                        onClick={handleToggleTTS}
                                        title={isSpeaking ? 'Stop narration' : 'Play narration'}
                                        className={`p-1.5 rounded-lg transition-colors ${isSpeaking
                                            ? 'bg-[#00A896]/10 text-[#00A896]'
                                            : 'hover:bg-muted text-muted-foreground'
                                            }`}
                                    >
                                        {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            GeminiService.stopSpeech();
                                            setIsSpeaking(false);
                                            onClose();
                                        }}
                                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground relative z-50 pointer-events-auto cursor-pointer"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="px-4 py-3">
                            <p className="text-sm text-muted-foreground leading-relaxed">{organ.description}</p>
                        </div>

                        {/* Key Facts */}
                        <div className="px-4 pb-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Key Facts</p>
                            <div className="flex flex-wrap gap-2">
                                {organ.facts.map((fact, i) => (
                                    <motion.span
                                        key={fact}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.15 + i * 0.08 }}
                                        className="text-xs bg-[#00A896]/10 text-[#00A896] px-2.5 py-1 rounded-full border border-[#00A896]/20 font-medium"
                                    >
                                        {fact}
                                    </motion.span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
