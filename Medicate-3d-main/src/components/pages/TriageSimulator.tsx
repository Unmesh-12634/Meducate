import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Heart, Activity, Wind, Thermometer, AlertTriangle,
    CheckCircle2, XCircle, Clock, ChevronRight, Trophy,
    RotateCcw, Stethoscope, Zap, Droplets, Pill
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
interface DecisionNode {
    id: string;
    situation: string;
    options: {
        label: string;
        icon: typeof Heart;
        outcome: string;
        correct: boolean;
        healthDelta: number;
    }[];
    timeLimit: number; // seconds
    tip?: string;
}

interface Vitals {
    hr: number;    // heart rate
    bp: string;    // blood pressure
    spo2: number;  // oxygen saturation
    rr: number;    // respiratory rate
    temp: number;  // temperature °C
}

interface Case {
    id: string;
    title: string;
    icon: string;
    color: string;
    accentColor: string;
    category: string;
    description: string;
    initialVitals: Vitals;
    nodes: DecisionNode[];
}

// ── Case Library ───────────────────────────────────────────────────────────────
const CASES: Case[] = [
    {
        id: 'chest-pain',
        title: 'Suspected STEMI',
        icon: '🫀',
        color: 'from-red-950/80 to-black',
        accentColor: '#EF476F',
        category: 'Cardiology',
        description: '52yr male. Crushing chest pain radiating to left arm. Diaphoresis. Pain 8/10 for 20 minutes.',
        initialVitals: { hr: 108, bp: '90/60', spo2: 94, rr: 22, temp: 36.8 },
        nodes: [
            {
                id: 'n1',
                situation: 'Patient arrives in acute distress. 52yr male, crushing chest pain 20min. BP 90/60, HR 108, SpO2 94%. What is your FIRST action?',
                timeLimit: 30,
                tip: 'Time is muscle — STEMI requires immediate action.',
                options: [
                    { label: 'Aspirin 300mg + 12-lead ECG', icon: Stethoscope, outcome: 'Correct. ECG confirms STEMI. Aspirin started. Activating cath lab.', correct: true, healthDelta: 15 },
                    { label: 'CT scan of chest', icon: Activity, outcome: 'Delay! CT is not first-line for STEMI. Valuable time lost.', correct: false, healthDelta: -20 },
                    { label: 'Pain relief with morphine', icon: Pill, outcome: 'Morphine alone without ECG delays diagnosis. Poor choice.', correct: false, healthDelta: -15 },
                    { label: 'IV access and fluids', icon: Droplets, outcome: 'IV access is needed but fluids alone are not the priority here.', correct: false, healthDelta: -10 },
                ],
            },
            {
                id: 'n2',
                situation: 'ECG confirms anterior STEMI. Patient now in VF. What do you do?',
                timeLimit: 20,
                tip: 'VF = no pulse. Every second counts.',
                options: [
                    { label: 'Defibrillate immediately (200J biphasic)', icon: Zap, outcome: 'Perfect. Shock delivered. ROSC achieved. Patient stabilising.', correct: true, healthDelta: 20 },
                    { label: 'Start CPR then defibrillate', icon: Heart, outcome: 'In shockable rhythm — shock first! CPR delays definitive treatment.', correct: false, healthDelta: -15 },
                    { label: 'Administer Amiodarone', icon: Pill, outcome: 'Amiodarone is used post-shock. Shock must come first.', correct: false, healthDelta: -20 },
                    { label: 'Check pulse again', icon: Activity, outcome: 'No time! In VF, shock is immediate priority.', correct: false, healthDelta: -25 },
                ],
            },
            {
                id: 'n3',
                situation: 'ROSC achieved. BP 100/70. Cath lab ready. What is your next critical choice?',
                timeLimit: 25,
                options: [
                    { label: 'Immediate PCI (Primary Angioplasty)', icon: Zap, outcome: 'Excellent! Primary PCI is gold standard. Door-to-balloon <90min achieved.', correct: true, healthDelta: 20 },
                    { label: 'Thrombolysis (tPA)', icon: Droplets, outcome: 'tPA is appropriate if PCI unavailable but not first choice when cath lab is ready.', correct: false, healthDelta: -5 },
                    { label: 'Admit to ICU and observe', icon: Activity, outcome: 'Observation alone without reperfusion is dangerous for STEMI.', correct: false, healthDelta: -25 },
                    { label: 'Echocardiogram first', icon: Stethoscope, outcome: 'Echo delays reperfusion. Not indicated before primary PCI.', correct: false, healthDelta: -15 },
                ],
            },
        ],
    },
    {
        id: 'respiratory',
        title: 'Acute Respiratory Failure',
        icon: '🫁',
        color: 'from-blue-950/80 to-black',
        accentColor: '#00A896',
        category: 'Pulmonology',
        description: '34yr female. Progressive dyspnoea. SpO2 82%, RR 32/min. History of severe asthma. Unable to complete sentences.',
        initialVitals: { hr: 130, bp: '140/90', spo2: 82, rr: 32, temp: 37.2 },
        nodes: [
            {
                id: 'n1',
                situation: 'SpO2 82%, RR 32, patient unable to complete sentences. Severe asthma attack. Immediate priority?',
                timeLimit: 25,
                tip: 'Hypoxia is the immediate killer.',
                options: [
                    { label: 'High-flow O2 + Salbutamol nebulizer', icon: Wind, outcome: 'Correct! Bronchodilator + O2 immediately. SpO2 improving.', correct: true, healthDelta: 20 },
                    { label: 'CXR and bloods first', icon: Activity, outcome: 'Investigations during hypoxia costs critical time. Treat first!', correct: false, healthDelta: -25 },
                    { label: 'IV aminophylline', icon: Droplets, outcome: 'Not first-line. Salbutamol nebulizer is the immediate choice.', correct: false, healthDelta: -15 },
                    { label: 'Oral prednisolone', icon: Pill, outcome: 'Steroids help but are not the immediate priority when SpO2 is 82%.', correct: false, healthDelta: -10 },
                ],
            },
            {
                id: 'n2',
                situation: 'Salbutamol given x3. SpO2 still 88%. Patient tiring. What next?',
                timeLimit: 30,
                options: [
                    { label: 'IV Magnesium Sulphate + consider NIV', icon: Stethoscope, outcome: 'Good call. MgSO4 as bronchodilator + BiPAP started. SpO2 rising.', correct: true, healthDelta: 15 },
                    { label: 'Intubate immediately', icon: Zap, outcome: 'Intubation in asthma carries high risk. Try IV Mg + NIV first.', correct: false, healthDelta: -10 },
                    { label: 'Increase salbutamol dose', icon: Wind, outcome: 'Repeated doses without escalation is inadequate for severe asthma.', correct: false, healthDelta: -15 },
                    { label: 'Discharge with oral meds', icon: XCircle, outcome: 'This patient is too unwell to discharge. Critical error.', correct: false, healthDelta: -40 },
                ],
            },
            {
                id: 'n3',
                situation: 'SpO2 93% now. Patient stabilising. Ongoing management?',
                timeLimit: 30,
                options: [
                    { label: 'IV hydrocortisone + wean O2 slowly', icon: Pill, outcome: 'Perfect. Systemic steroids + controlled O2 weaning. Full recovery expected.', correct: true, healthDelta: 15 },
                    { label: 'Stop all treatment - patient stable', icon: XCircle, outcome: 'Too early! Asthma can deteriorate rapidly. Continue treatment.', correct: false, healthDelta: -20 },
                    { label: 'Transfer to general ward immediately', icon: Activity, outcome: 'Patient needs continued HDU monitoring before ward transfer.', correct: false, healthDelta: -10 },
                    { label: 'Sedation and intubation for comfort', icon: Stethoscope, outcome: 'Unnecessary intubation when stabilising. Risk without benefit.', correct: false, healthDelta: -20 },
                ],
            },
        ],
    },
    {
        id: 'trauma',
        title: 'Polytrauma — RTA',
        icon: '🚑',
        color: 'from-orange-950/80 to-black',
        accentColor: '#FFD166',
        category: 'Emergency Medicine',
        description: '28yr male. Road traffic accident. GCS 12. BP 80/50, HR 140. Suspected splenic laceration. Open femur fracture.',
        initialVitals: { hr: 140, bp: '80/50', spo2: 96, rr: 24, temp: 35.9 },
        nodes: [
            {
                id: 'n1',
                situation: 'Polytrauma. BP 80/50, HR 140. GCS 12. Hemorrhagic shock. Primary survey — what is the FIRST priority?',
                timeLimit: 20,
                tip: 'ABCDE — Airway, Breathing, Circulation.',
                options: [
                    { label: 'Airway assessment + C-spine protection', icon: Wind, outcome: 'Correct ATLS approach. Airway secure. Continuing primary survey.', correct: true, healthDelta: 15 },
                    { label: 'Rush to CT scanner', icon: Activity, outcome: 'CT before stabilisation in haemorrhagic shock is dangerous.', correct: false, healthDelta: -20 },
                    { label: 'Immediate blood transfusion', icon: Droplets, outcome: 'Circulation is priority 3 in ABCDE. Airway must be secured first.', correct: false, healthDelta: -10 },
                    { label: 'Orthopaedics consult for femur', icon: Stethoscope, outcome: 'Limb injuries are managed after life-threatening injuries stabilised.', correct: false, healthDelta: -15 },
                ],
            },
            {
                id: 'n2',
                situation: 'Airway secure. GCS improved to 14. Now BP 75/40. HR 148. Haemorrhage from suspected splenic laceration. Next?',
                timeLimit: 25,
                options: [
                    { label: 'Massive Transfusion Protocol (1:1:1 PRBCs:FFP:Platelets)', icon: Droplets, outcome: 'Excellent! MTP activated. Permissive hypotension maintained. BP 90/60.', correct: true, healthDelta: 20 },
                    { label: 'Normal saline 2L bolus', icon: Droplets, outcome: 'Crystalloid alone worsens coagulopathy in hemorrhagic shock. Blood products needed.', correct: false, healthDelta: -20 },
                    { label: 'Wait and observe BP', icon: Activity, outcome: 'Active haemorrhage cannot be observed — this is haemorrhagic shock.', correct: false, healthDelta: -30 },
                    { label: 'Vasopressors (noradrenaline)', icon: Zap, outcome: 'Vasopressors without volume in hypovolemia is dangerous.', correct: false, healthDelta: -25 },
                ],
            },
            {
                id: 'n3',
                situation: 'FAST scan confirms free fluid. BP still 85/55 despite MTP. Definitive haemorrhage control?',
                timeLimit: 20,
                options: [
                    { label: 'Emergency splenectomy / IR embolisation', icon: Zap, outcome: 'Correct! Surgical or IR control of bleeding source. Haemostasis achieved.', correct: true, healthDelta: 20 },
                    { label: 'Continue transfusion and hope it stops', icon: Droplets, outcome: 'Ongoing surgical haemorrhage needs definitive control. Continued transfusion alone is inadequate.', correct: false, healthDelta: -25 },
                    { label: 'Admit to ICU for observation', icon: Activity, outcome: 'Active surgical bleeding requires definitive control, not observation.', correct: false, healthDelta: -30 },
                    { label: 'Orthopaedics for interim femur fixation', icon: Stethoscope, outcome: 'Splenic haemorrhage is immediately life-threatening. Deal with it first.', correct: false, healthDelta: -20 },
                ],
            },
        ],
    },
];

// ── Vitals Monitor Component ───────────────────────────────────────────────────
function VitalCard({ label, value, unit, color, icon: Icon, pulse = false }: {
    label: string; value: string | number; unit?: string; color: string; icon: typeof Heart; pulse?: boolean;
}) {
    return (
        <div className="bg-black/50 border border-white/5 rounded-xl p-3 relative overflow-hidden">
            <div className="flex items-center gap-1.5 mb-1">
                <Icon size={11} className={`${color}`} />
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className={`text-lg font-mono font-black ${color} ${pulse ? 'animate-pulse' : ''}`}>{value}</span>
                {unit && <span className="text-[10px] text-slate-600">{unit}</span>}
            </div>
        </div>
    );
}

// ── ECG Line (animated SVG) ────────────────────────────────────────────────────
function ECGLine({ color }: { color: string }) {
    return (
        <svg viewBox="0 0 200 40" className="w-full h-8" style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
            <polyline
                points="0,20 20,20 25,5 30,35 35,10 40,20 60,20 80,20 85,5 90,35 95,10 100,20 120,20 140,20 145,5 150,35 155,10 160,20 200,20"
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function TriageSimulator() {
    const [phase, setPhase] = useState<'select' | 'briefing' | 'triage' | 'result'>('select');
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);
    const [nodeIndex, setNodeIndex] = useState(0);
    const [health, setHealth] = useState(70);
    const [timeLeft, setTimeLeft] = useState(30);
    const [score, setScore] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [log, setLog] = useState<{ text: string; correct: boolean; time: number }[]>([]);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<{ text: string; correct: boolean } | null>(null);
    const [vitals, setVitals] = useState<Vitals | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const currentNode = selectedCase?.nodes[nodeIndex] ?? null;

    const stopTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
    }, []);

    const goToNextNode = useCallback((delay = 1800) => {
        setTimeout(() => {
            setSelectedOption(null);
            setFeedback(null);
            if (selectedCase && nodeIndex + 1 < selectedCase.nodes.length) {
                setNodeIndex(i => i + 1);
            } else {
                setPhase('result');
            }
        }, delay);
    }, [selectedCase, nodeIndex]);

    // Timer countdown
    useEffect(() => {
        if (phase !== 'triage' || !currentNode || selectedOption !== null) return;
        setTimeLeft(currentNode.timeLimit);

        timerRef.current = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    stopTimer();
                    // Time's up — auto penalise
                    setHealth(h => Math.max(0, h - 25));
                    setFeedback({ text: '⏰ Time expired! In emergencies, hesitation costs lives.', correct: false });
                    setLog(l => [...l, { text: 'Time expired — no decision made', correct: false, time: 0 }]);
                    goToNextNode();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        return () => stopTimer();
    }, [phase, nodeIndex, selectedOption]);

    // Vitals fluctuation
    useEffect(() => {
        if (!selectedCase || phase !== 'triage') return;
        setVitals({ ...selectedCase.initialVitals });

        const interval = setInterval(() => {
            setVitals(v => {
                if (!v) return v;
                const healthFactor = health / 100;
                return {
                    hr: Math.round(v.hr + (Math.random() - 0.5) * 6 * (2 - healthFactor)),
                    bp: `${Math.round(parseInt(v.bp.split('/')[0]) + (Math.random() - 0.5) * 8)}/${Math.round(parseInt(v.bp.split('/')[1]) + (Math.random() - 0.5) * 4)}`,
                    spo2: Math.min(100, Math.max(70, Math.round(v.spo2 + (Math.random() - 0.4) * 2 * healthFactor + 0.3))),
                    rr: Math.round(v.rr + (Math.random() - 0.5) * 3),
                    temp: Math.round((v.temp + (Math.random() - 0.5) * 0.2) * 10) / 10,
                };
            });
        }, 1500);

        return () => clearInterval(interval);
    }, [phase, selectedCase, health]);

    const handleSelectOption = (idx: number) => {
        if (selectedOption !== null || !currentNode) return;
        stopTimer();
        setSelectedOption(idx);

        const opt = currentNode.options[idx];
        const newHealth = Math.min(100, Math.max(0, health + opt.healthDelta));
        setHealth(newHealth);
        setFeedback({ text: opt.outcome, correct: opt.correct });
        if (opt.correct) {
            setScore(s => s + Math.max(10, timeLeft * 3));
            setCorrectCount(c => c + 1);
        }
        setLog(l => [...l, { text: opt.label, correct: opt.correct, time: timeLeft }]);

        if (newHealth <= 0) {
            setTimeout(() => setPhase('result'), 1800);
        } else {
            goToNextNode();
        }
    };

    const startCase = (c: Case) => {
        setSelectedCase(c);
        setPhase('briefing');
        setHealth(70);
        setScore(0);
        setCorrectCount(0);
        setLog([]);
        setNodeIndex(0);
        setSelectedOption(null);
        setFeedback(null);
    };

    const resetToSelect = () => {
        setPhase('select');
        setSelectedCase(null);
        setNodeIndex(0);
    };

    const getOutcome = () => {
        const pct = correctCount / (selectedCase?.nodes.length ?? 1);
        if (health <= 0) return { label: 'Patient Deceased', color: 'text-red-500', emoji: '💔' };
        if (pct >= 0.9 && health >= 70) return { label: 'Full Recovery — Excellent Care', color: 'text-emerald-400', emoji: '🏆' };
        if (pct >= 0.6) return { label: 'Stabilised — Competent Management', color: 'text-yellow-400', emoji: '⭐' };
        return { label: 'Critical — Review Required', color: 'text-orange-400', emoji: '⚠️' };
    };

    // ── RENDER ─────────────────────────────────────────────────────────────

    // Phase: Case Selection
    if (phase === 'select') {
        return (
            <div className="flex-1 flex flex-col h-full overflow-y-auto p-6"
                style={{ background: 'radial-gradient(ellipse at top, #050d15 0%, #000000 100%)' }}>
                <div className="max-w-4xl mx-auto w-full">
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00A896]/30 text-[#00A896] text-xs font-bold uppercase tracking-widest mb-4 bg-[#00A896]/5">
                            <Stethoscope size={12} /> Emergency Triage Simulator
                        </div>
                        <h1 className="text-4xl font-black text-white mb-2">Select Your Case</h1>
                        <p className="text-slate-500 text-sm">Real clinical scenarios. Time pressure. Consequence. No second chances.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {CASES.map((c) => (
                            <motion.button
                                key={c.id}
                                onClick={() => startCase(c)}
                                whileHover={{ scale: 1.03, y: -4 }}
                                whileTap={{ scale: 0.97 }}
                                className="text-left p-6 rounded-2xl border border-white/5 overflow-hidden relative group"
                                style={{ background: `linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.8) 100%)` }}
                            >
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{ background: `radial-gradient(ellipse at top-left, ${c.accentColor}15 0%, transparent 70%)` }} />
                                <div className="text-4xl mb-3">{c.icon}</div>
                                <div className="inline-block text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full mb-2 font-bold"
                                    style={{ color: c.accentColor, background: c.accentColor + '15', border: `1px solid ${c.accentColor}30` }}>
                                    {c.category}
                                </div>
                                <h3 className="text-lg font-black text-white mb-2">{c.title}</h3>
                                <p className="text-xs text-slate-500 leading-relaxed mb-4">{c.description}</p>
                                <div className="flex items-center gap-2 text-xs font-bold" style={{ color: c.accentColor }}>
                                    <span>{c.nodes.length} Decision Points</span>
                                    <ChevronRight size={14} />
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Phase: Case Briefing
    if (phase === 'briefing' && selectedCase) {
        return (
            <div className="flex-1 flex items-center justify-center p-8"
                style={{ background: 'radial-gradient(ellipse at center, #050d15 0%, #000000 100%)' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-lg w-full"
                >
                    <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                        <div className="text-5xl mb-4">{selectedCase.icon}</div>
                        <div className="inline-block text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full mb-2 font-bold mb-3"
                            style={{ color: selectedCase.accentColor, background: selectedCase.accentColor + '15', border: `1px solid ${selectedCase.accentColor}30` }}>
                            {selectedCase.category}
                        </div>
                        <h2 className="text-3xl font-black text-white mb-4">{selectedCase.title}</h2>
                        <div className="bg-black/40 border border-white/5 rounded-xl p-4 mb-6">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Patient Briefing</p>
                            <p className="text-white leading-relaxed">{selectedCase.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {[
                                { label: 'Decision Points', value: selectedCase.nodes.length, icon: Activity },
                                { label: 'Category', value: selectedCase.category, icon: Stethoscope },
                            ].map(({ label, value, icon: Icon }) => (
                                <div key={label} className="bg-black/30 border border-white/5 rounded-xl p-3">
                                    <Icon size={12} className="text-slate-500 mb-1" />
                                    <p className="text-[10px] text-slate-500">{label}</p>
                                    <p className="text-sm font-bold text-white">{value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-3 mb-6">
                            <p className="text-xs text-red-400"><span className="font-bold">⚠️ Warning:</span> Wrong decisions directly affect the patient. Time pressure is real. Trust your training.</p>
                        </div>

                        <motion.button
                            onClick={() => setPhase('triage')}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full py-4 rounded-xl text-white font-black text-sm flex items-center justify-center gap-2"
                            style={{ background: `linear-gradient(135deg, ${selectedCase.accentColor} 0%, ${selectedCase.accentColor}99 100%)` }}
                        >
                            Enter Emergency Bay <ChevronRight size={16} />
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Phase: Active Triage
    if (phase === 'triage' && selectedCase && currentNode) {
        const healthColor = health > 60 ? '#00A896' : health > 30 ? '#FFD166' : '#EF476F';
        const timerPct = (timeLeft / currentNode.timeLimit) * 100;
        const timerColor = timeLeft > 15 ? '#00A896' : timeLeft > 8 ? '#FFD166' : '#EF476F';

        return (
            <div className="flex-1 flex h-full overflow-hidden" style={{ background: '#000000' }}>

                {/* Left: Vitals Monitor */}
                <div className="w-52 flex-shrink-0 border-r border-white/5 flex flex-col p-4 gap-3"
                    style={{ background: 'rgba(0,5,10,0.95)' }}>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#EF476F] animate-pulse" />
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">Vitals Monitor</span>
                    </div>

                    {/* ECG */}
                    <div className="bg-black/60 border border-white/5 rounded-xl p-2">
                        <p className="text-[9px] text-[#00A896] mb-1 font-mono">ECG LEAD II</p>
                        <ECGLine color="#00A896" />
                    </div>

                    {vitals && (
                        <>
                            <VitalCard label="Heart Rate" value={vitals.hr} unit="bpm" color="text-[#EF476F]" icon={Heart} pulse />
                            <VitalCard label="Blood Pressure" value={vitals.bp} unit="mmHg" color="text-yellow-400" icon={Activity} />
                            <VitalCard label="SpO2" value={`${vitals.spo2}%`} color={vitals.spo2 >= 94 ? 'text-[#00A896]' : 'text-orange-400'} icon={Wind} />
                            <VitalCard label="Resp. Rate" value={vitals.rr} unit="/min" color="text-blue-400" icon={Wind} />
                            <VitalCard label="Temp" value={vitals.temp} unit="°C" color="text-purple-400" icon={Thermometer} />
                        </>
                    )}

                    {/* Patient Health */}
                    <div className="mt-auto bg-black/40 border border-white/5 rounded-xl p-3">
                        <p className="text-[10px] text-slate-500 mb-2">Patient Status</p>
                        <div className="h-2 bg-slate-800 rounded-full mb-1">
                            <div className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${health}%`, background: healthColor }} />
                        </div>
                        <div className="flex justify-between text-[10px]">
                            <span className="text-slate-600">Critical</span>
                            <span className="font-bold" style={{ color: healthColor }}>{health}%</span>
                            <span className="text-slate-600">Stable</span>
                        </div>
                    </div>
                </div>

                {/* Center: Decision Area */}
                <div className="flex-1 flex flex-col overflow-y-auto p-8"
                    style={{ background: 'radial-gradient(ellipse at top, #050d15 0%, #000000 100%)' }}>

                    {/* Timer bar */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Clock size={14} style={{ color: timerColor }} />
                                <span className="text-xs font-bold" style={{ color: timerColor }}>
                                    {selectedOption !== null ? 'Processing...' : `${timeLeft}s`}
                                </span>
                            </div>
                            <span className="text-[10px] text-slate-600">
                                Case {nodeIndex + 1}/{selectedCase.nodes.length} • {selectedCase.title}
                            </span>
                        </div>
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all"
                                style={{ width: `${selectedOption !== null ? 100 : timerPct}%`, background: timerColor }} />
                        </div>
                    </div>

                    {/* Situation card */}
                    <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle size={16} style={{ color: selectedCase.accentColor }} />
                            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: selectedCase.accentColor }}>
                                Situation
                            </span>
                        </div>
                        <p className="text-white text-base leading-relaxed">{currentNode.situation}</p>
                        {currentNode.tip && (
                            <p className="mt-3 text-[11px] text-slate-500 italic border-l-2 border-slate-700 pl-3">
                                💡 {currentNode.tip}
                            </p>
                        )}
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 gap-3 mb-6">
                        <AnimatePresence mode="wait">
                            {currentNode.options.map((opt, idx) => {
                                const isSelected = selectedOption === idx;
                                const showResult = selectedOption !== null;
                                const OptIcon = opt.icon;

                                let btnClass = 'border-slate-800 bg-slate-900/30 hover:border-slate-600 hover:bg-slate-900/60';
                                if (showResult) {
                                    if (isSelected && opt.correct) btnClass = 'border-emerald-500/50 bg-emerald-950/30';
                                    else if (isSelected && !opt.correct) btnClass = 'border-red-500/50 bg-red-950/30';
                                    else if (opt.correct) btnClass = 'border-emerald-500/30 bg-emerald-950/10';
                                    else btnClass = 'border-slate-800/30 bg-black/20 opacity-50';
                                }

                                return (
                                    <motion.button
                                        key={idx}
                                        onClick={() => handleSelectOption(idx)}
                                        disabled={selectedOption !== null}
                                        whileHover={selectedOption === null ? { x: 4 } : {}}
                                        whileTap={selectedOption === null ? { scale: 0.99 } : {}}
                                        className={`w-full text-left flex items-center gap-4 px-5 py-4 rounded-xl border-2 transition-all ${btnClass}`}
                                    >
                                        <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
                                            style={{ background: selectedCase.accentColor + '15' }}>
                                            <OptIcon size={16} style={{ color: selectedCase.accentColor }} />
                                        </div>
                                        <span className="text-sm text-slate-200 flex-1">{opt.label}</span>
                                        {showResult && isSelected && (
                                            opt.correct
                                                ? <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                                                : <XCircle size={18} className="text-red-400 flex-shrink-0" />
                                        )}
                                        {showResult && !isSelected && opt.correct && (
                                            <CheckCircle2 size={16} className="text-emerald-400/50 flex-shrink-0" />
                                        )}
                                    </motion.button>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Feedback */}
                    <AnimatePresence>
                        {feedback && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`rounded-xl p-4 border ${feedback.correct
                                    ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
                                    : 'border-red-500/30 bg-red-950/20 text-red-300'}`}
                            >
                                <p className="text-sm leading-relaxed">{feedback.text}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right: Decision Log */}
                <div className="w-48 flex-shrink-0 border-l border-white/5 flex flex-col p-4"
                    style={{ background: 'rgba(0,5,10,0.95)' }}>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">Action Log</p>
                    <div className="flex-1 overflow-y-auto space-y-2">
                        {log.length === 0 && (
                            <p className="text-[10px] text-slate-700 italic">No actions yet</p>
                        )}
                        {log.map((entry, i) => (
                            <div key={i} className={`p-2 rounded-lg border text-[10px] leading-relaxed ${entry.correct
                                ? 'border-emerald-500/20 bg-emerald-950/20 text-emerald-400'
                                : 'border-red-500/20 bg-red-950/20 text-red-400'}`}>
                                {entry.correct ? '✓' : '✗'} {entry.text}
                                <br />
                                <span className="text-slate-600">{entry.time}s remaining</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto pt-3 border-t border-white/5">
                        <p className="text-[10px] text-slate-500 mb-1">Score</p>
                        <p className="text-2xl font-black text-white font-mono">{score}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Phase: Results
    if (phase === 'result' && selectedCase) {
        const outcome = getOutcome();
        return (
            <div className="flex-1 flex items-center justify-center p-8"
                style={{ background: 'radial-gradient(ellipse at center, #050d15 0%, #000000 100%)' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center"
                >
                    <div className="text-6xl mb-4">{outcome.emoji}</div>
                    <h2 className={`text-2xl font-black mb-2 ${outcome.color}`}>{outcome.label}</h2>
                    <p className="text-slate-500 text-sm mb-8">Case: {selectedCase.title}</p>

                    <div className="grid grid-cols-3 gap-3 mb-8">
                        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4">
                            <Trophy size={18} className="text-yellow-400 mx-auto mb-1" />
                            <p className="text-[10px] text-slate-500">Score</p>
                            <p className="text-xl font-black text-white">{score}</p>
                        </div>
                        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4">
                            <CheckCircle2 size={18} className="text-emerald-400 mx-auto mb-1" />
                            <p className="text-[10px] text-slate-500">Correct</p>
                            <p className="text-xl font-black text-white">{correctCount}/{selectedCase.nodes.length}</p>
                        </div>
                        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4">
                            <Heart size={18} className="text-[#EF476F] mx-auto mb-1" />
                            <p className="text-[10px] text-slate-500">Patient</p>
                            <p className="text-xl font-black text-white">{health}%</p>
                        </div>
                    </div>

                    <div className="space-y-2 mb-8 text-left">
                        {log.map((entry, i) => (
                            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${entry.correct ? 'bg-emerald-950/20 border border-emerald-500/20' : 'bg-red-950/20 border border-red-500/20'}`}>
                                {entry.correct ? <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" /> : <XCircle size={14} className="text-red-400 flex-shrink-0" />}
                                <span className={`text-xs ${entry.correct ? 'text-emerald-300' : 'text-red-300'}`}>{entry.text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <motion.button
                            onClick={() => startCase(selectedCase)}
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            className="flex-1 py-3 rounded-xl border border-white/10 text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                        >
                            <RotateCcw size={14} /> Retry
                        </motion.button>
                        <motion.button
                            onClick={resetToSelect}
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            className="flex-1 py-3 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2"
                            style={{ background: 'linear-gradient(135deg, #00A896 0%, #028090 100%)' }}
                        >
                            New Case <ChevronRight size={14} />
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return null;
}
