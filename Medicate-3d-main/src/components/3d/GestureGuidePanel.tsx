import { motion, AnimatePresence } from 'motion/react';
import { X, Hand, Zap, RotateCw, ZoomIn, Layers, Activity, Check } from 'lucide-react';

interface GestureGuidePanelProps {
    isOpen: boolean;
    onClose: () => void;
    gestureEnabled: boolean;
    currentGesture?: string; // live gesture from HandGestureController
}

const GESTURE_SECTIONS = [
    {
        title: 'Rotate & Navigate',
        color: '#00A896',
        gestures: [
            {
                emoji: '🖐️',
                name: 'Open Palm — Rotate',
                desc: 'Hold 3+ fingers open and move your hand slowly to spin the model.',
                match: 'Open Palm',
            },
            {
                emoji: '👆',
                name: 'Pointing — Precise Rotate',
                desc: 'Extend only your index finger and sweep left/right for fine control.',
                match: 'Pointing',
            },
        ],
    },
    {
        title: 'Zoom',
        color: '#FFD166',
        gestures: [
            {
                emoji: '🤏',
                name: 'Pinch — Zoom In / Out',
                desc: 'Bring thumb and index fingertip together to zoom in; spread apart to zoom out.',
                match: 'Pinch',
            },
        ],
    },
    {
        title: 'View Modes',
        color: '#EF476F',
        gestures: [
            {
                emoji: '✋',
                name: 'All 5 Fingers — Dissection',
                desc: 'Spread all 5 fingers wide apart to enter step-by-step dissection view.',
                match: 'Dissection',
            },
            {
                emoji: '✌️',
                name: 'Peace Sign — Pathology',
                desc: 'Extend only index and middle finger (peace sign) to toggle disease view.',
                match: 'Pathology',
            },
            {
                emoji: '✊',
                name: 'Closed Fist — Normal',
                desc: 'Close all fingers into a fist to reset back to normal anatomy view.',
                match: 'Normal',
            },
        ],
    },
];

export function GestureGuidePanel({
    isOpen,
    onClose,
    gestureEnabled,
    currentGesture = '',
}: GestureGuidePanelProps) {
    const isActive = (match: string) =>
        gestureEnabled && currentGesture.toLowerCase().includes(match.toLowerCase());

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.aside
                        className="fixed right-0 top-16 bottom-0 w-80 z-50 flex flex-col bg-background/98 backdrop-blur-xl border-l border-border shadow-2xl"
                        initial={{ x: 320 }}
                        animate={{ x: 0 }}
                        exit={{ x: 320 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-gradient-to-r from-[#00A896]/10 to-transparent shrink-0">
                            <div className="flex items-center gap-2">
                                <Hand size={18} className="text-[#00A896]" />
                                <h2 className="font-bold text-base">Gesture Guide</h2>
                            </div>
                            <div className="flex items-center gap-3">
                                {gestureEnabled ? (
                                    <span className="flex items-center gap-1.5 text-[10px] font-semibold text-[#00A896] bg-[#00A896]/10 px-2 py-1 rounded-full">
                                        <span className="w-1.5 h-1.5 bg-[#00A896] rounded-full animate-pulse" />
                                        LIVE
                                    </span>
                                ) : (
                                    <span className="text-[10px] text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                        Gestures OFF
                                    </span>
                                )}
                                <button
                                    onClick={onClose}
                                    className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Live gesture indicator */}
                        {gestureEnabled && currentGesture && (
                            <motion.div
                                key={currentGesture}
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mx-4 mt-3 px-3 py-2 rounded-xl bg-[#00A896]/10 border border-[#00A896]/20 text-sm text-[#00A896] font-semibold flex items-center gap-2 shrink-0"
                            >
                                <Zap size={14} className="shrink-0" />
                                <span className="truncate">{currentGesture}</span>
                            </motion.div>
                        )}

                        {/* Gesture Sections */}
                        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5">
                            {GESTURE_SECTIONS.map((section) => (
                                <div key={section.title}>
                                    <p
                                        className="text-[10px] font-bold uppercase tracking-widest mb-2"
                                        style={{ color: section.color }}
                                    >
                                        {section.title}
                                    </p>
                                    <div className="space-y-2">
                                        {section.gestures.map((g) => {
                                            const active = isActive(g.match);
                                            return (
                                                <motion.div
                                                    key={g.name}
                                                    animate={active ? { scale: [1, 1.02, 1] } : {}}
                                                    transition={{ duration: 0.4, repeat: active ? Infinity : 0, repeatDelay: 1 }}
                                                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${active
                                                            ? 'border-[#00A896] bg-[#00A896]/10 shadow-md shadow-[#00A896]/10'
                                                            : 'border-border bg-card hover:bg-muted/40'
                                                        }`}
                                                >
                                                    <span className="text-2xl leading-none mt-0.5 shrink-0">{g.emoji}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-1.5">
                                                            <p className="text-sm font-semibold leading-tight truncate">{g.name}</p>
                                                            {active && (
                                                                <span className="shrink-0">
                                                                    <Check size={12} className="text-[#00A896]" />
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{g.desc}</p>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tips footer */}
                        <div className="shrink-0 px-4 py-4 border-t border-border bg-muted/20">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">💡 Pro Tips</p>
                            <ul className="space-y-1.5">
                                {[
                                    { icon: <Zap size={11} />, tip: 'Good lighting = better detection' },
                                    { icon: <RotateCw size={11} />, tip: 'Move slowly for precision' },
                                    { icon: <ZoomIn size={11} />, tip: 'Hold hand 25–40 cm from camera' },
                                    { icon: <Layers size={11} />, tip: 'Hold gesture for 0.5s to trigger' },
                                    { icon: <Activity size={11} />, tip: 'Plain background improves accuracy' },
                                ].map(({ icon, tip }) => (
                                    <li key={tip} className="flex items-start gap-2 text-xs text-muted-foreground">
                                        <span className="text-[#00A896] mt-0.5 shrink-0">{icon}</span>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
