import { motion, AnimatePresence } from 'motion/react';
import {
    X,
    Hand,
    Keyboard,
    Mic2,
    Brain,
    MessageCircle,
    Award,
    Lightbulb,
    ChevronRight,
    Target,
    Clock,
    AlertTriangle,
    Activity,
    FileText,
} from 'lucide-react';

interface SimulationGuidePanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const SECTIONS = [
    {
        id: 'keyboard',
        icon: Keyboard,
        title: 'Keyboard Shortcuts',
        color: '#00A896',
        tips: [
            { key: 'Enter', action: 'Send your message to the patient' },
            { key: 'Tab', action: 'Cycle through quick-question chips' },
            { key: 'Space', action: 'Select highlighted quick question' },
            { key: 'Esc', action: 'Clear current input / close dialogs' },
        ],
    },
    {
        id: 'interview',
        icon: MessageCircle,
        title: 'Interview Strategy',
        color: '#FFD166',
        tips: [
            { key: 'OLDCARTS', action: 'Onset, Location, Duration, Character, Aggravating, Relieving, Timing, Severity' },
            { key: 'Chief Complaint', action: 'Always clarify onset and severity first' },
            { key: 'Red Flags', action: 'Ask about radiation, associated symptoms, and allergies early' },
            { key: 'History', action: 'Medical → Medications → Allergies → Family → Social' },
        ],
    },
    {
        id: 'vitals',
        icon: Activity,
        title: 'Vital Signs Guide',
        color: '#EF476F',
        tips: [
            { key: 'HR > 100', action: 'Tachycardia — investigate for fever, pain, or cardiac event' },
            { key: 'SpO₂ < 94%', action: 'Hypoxemia — consider O₂ supplementation' },
            { key: 'BP > 140/90', action: 'Stage 2 hypertension — assess for end-organ damage' },
            { key: 'RR > 20', action: 'Tachypnea — rule out pulmonary or metabolic cause' },
        ],
    },
    {
        id: 'scoring',
        icon: Award,
        title: 'Scoring System',
        color: '#06D6A0',
        tips: [
            { key: '+1 pt', action: 'Each correct MCQ answer' },
            { key: 'Bonus', action: 'Complete all questions under 10 minutes' },
            { key: 'No penalty', action: 'Wrong answers do not deduct points' },
            { key: 'Explanation', action: 'Always read explanation — it counts toward your learning log' },
        ],
    },
    {
        id: 'clinical',
        icon: Brain,
        title: 'Clinical Tips',
        color: '#A78BFA',
        tips: [
            { key: 'AMI Pearls', action: 'Chest pain + ST elevation = STEMI → call cath lab in < 90 min' },
            { key: 'Drug Safety', action: 'Cross-check patient allergies before recommending medications' },
            { key: 'ECG Leads', action: 'II, III, aVF = inferior · V1–V4 = anterior · I, aVL = lateral' },
            { key: 'MONA', action: 'Morphine, O₂, Nitroglycerin, Aspirin — legacy ACS mnemonic' },
        ],
    },
];

// Floating trigger button (rendered separately so it can be outside the panel)
export function SimulationGuideButton({
    isOpen,
    onClick,
}: {
    isOpen: boolean;
    onClick: () => void;
}) {
    return (
        <motion.button
            onClick={onClick}
            title="Simulation Guide"
            className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-1.5 px-2 py-4 rounded-l-2xl shadow-2xl border border-r-0 transition-all ${isOpen
                    ? 'bg-[#00A896] text-white border-[#00A896]'
                    : 'bg-card text-foreground border-border hover:bg-[#00A896]/10 hover:border-[#00A896]/40'
                }`}
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
        >
            {/* Animated hand icon */}
            <motion.div
                animate={isOpen ? {} : { rotate: [0, -15, 15, -10, 10, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 3 }}
            >
                <Hand size={18} />
            </motion.div>
            <span
                className="text-[10px] font-bold tracking-widest uppercase"
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            >
                Guide
            </span>
        </motion.button>
    );
}

export function SimulationGuidePanel({ isOpen, onClose }: SimulationGuidePanelProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Side Panel */}
                    <motion.aside
                        className="fixed right-0 top-0 bottom-0 w-96 z-50 flex flex-col shadow-2xl"
                        style={{ background: 'var(--background)' }}
                        initial={{ x: 420 }}
                        animate={{ x: 0 }}
                        exit={{ x: 420 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                    >
                        {/* Gradient header */}
                        <div className="relative overflow-hidden px-5 pt-6 pb-5 border-b border-border shrink-0">
                            {/* Background glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#00A896]/15 via-transparent to-[#028090]/10 pointer-events-none" />
                            <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#00A896]/10 rounded-full blur-2xl pointer-events-none" />

                            <div className="relative flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00A896] to-[#028090] flex items-center justify-center shadow-lg shadow-[#00A896]/30">
                                            <FileText size={15} className="text-white" />
                                        </div>
                                        <h2 className="font-bold text-lg">Simulation Guide</h2>
                                    </div>
                                    <p className="text-xs text-muted-foreground ml-10">
                                        Tips, shortcuts & clinical pearls
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Quick stat bar */}
                            <div className="relative flex items-center gap-2 mt-4 p-3 bg-muted/60 rounded-xl border border-border/50">
                                <Clock size={12} className="text-[#00A896] shrink-0" />
                                <span className="text-xs text-muted-foreground">Target time</span>
                                <span className="text-xs font-bold text-[#00A896] ml-auto">≤ 10 min</span>
                                <div className="w-px h-3 bg-border" />
                                <Target size={12} className="text-[#FFD166] shrink-0" />
                                <span className="text-xs text-muted-foreground">Max score</span>
                                <span className="text-xs font-bold text-[#FFD166]">6 pts</span>
                            </div>
                        </div>

                        {/* Section list */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                            {SECTIONS.map((section, si) => (
                                <motion.div
                                    key={section.id}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: si * 0.06 }}
                                    className="rounded-2xl border border-border overflow-hidden"
                                >
                                    {/* Section header */}
                                    <div
                                        className="flex items-center gap-3 px-4 py-3"
                                        style={{ background: `${section.color}10`, borderBottom: `1px solid ${section.color}25` }}
                                    >
                                        <div
                                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                            style={{ background: `${section.color}20` }}
                                        >
                                            <section.icon size={14} style={{ color: section.color }} />
                                        </div>
                                        <h3
                                            className="text-sm font-bold"
                                            style={{ color: section.color }}
                                        >
                                            {section.title}
                                        </h3>
                                    </div>

                                    {/* Tips */}
                                    <div className="bg-card divide-y divide-border/50">
                                        {section.tips.map((tip, ti) => (
                                            <motion.div
                                                key={ti}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: si * 0.06 + ti * 0.04 }}
                                                className="flex items-start gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors group"
                                            >
                                                <span
                                                    className="shrink-0 mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded border"
                                                    style={{
                                                        color: section.color,
                                                        borderColor: `${section.color}40`,
                                                        background: `${section.color}10`,
                                                    }}
                                                >
                                                    {tip.key}
                                                </span>
                                                <ChevronRight size={12} className="text-muted-foreground shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform" />
                                                <p className="text-xs text-muted-foreground leading-relaxed">{tip.action}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Footer - pro tips */}
                        <div className="shrink-0 px-4 py-4 border-t border-border bg-muted/20">
                            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FFD166]/10 border border-[#FFD166]/25">
                                <Lightbulb size={13} className="text-[#FFD166] shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[11px] font-bold text-[#FFD166] mb-0.5">Pro Tip</p>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                                        Read every explanation after answering — understanding WHY matters more than the score.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2.5 p-3 mt-2 rounded-xl bg-[#EF476F]/10 border border-[#EF476F]/25">
                                <AlertTriangle size={13} className="text-[#EF476F] shrink-0 mt-0.5" />
                                <p className="text-[11px] text-muted-foreground leading-relaxed">
                                    Always check allergies <strong className="text-foreground">before</strong> prescribing any drug in the simulation.
                                </p>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                                <span className="text-[10px] text-muted-foreground">Meducate AI Lab</span>
                                <div className="flex items-center gap-1">
                                    <Mic2 size={10} className="text-[#00A896]" />
                                    <span className="text-[10px] text-[#00A896] font-medium">Voice-enabled</span>
                                </div>
                            </div>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
