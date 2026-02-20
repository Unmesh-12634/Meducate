import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Shield, Camera, CameraOff, AlertTriangle, CheckCircle2,
    Clock, X, Eye, Wifi, User, Monitor,
} from 'lucide-react';

// ─── MCQ Data ─────────────────────────────────────────────────────────────────
const WEEK_QUESTIONS: Record<string, Array<{ q: string; options: string[]; correct: number }>> = {
    'week-1': [
        { q: 'What is the primary goal of the primary survey in emergency medicine?', options: ['Identify all injuries', 'Identify and treat life-threatening conditions', 'Obtain patient history', 'Order lab tests'], correct: 1 },
        { q: 'Which mnemonic is used in the primary survey of emergency patients?', options: ['SAMPLE', 'ABCDE', 'OPQRST', 'CIAMPEDS'], correct: 1 },
        { q: 'A patient with a Glasgow Coma Scale (GCS) of 8 requires:', options: ['Observation only', 'Immediate airway management', 'IV fluids', 'Discharge with instructions'], correct: 1 },
        { q: 'Which of the following is NOT a component of the ABCDE assessment?', options: ['Airway', 'Breathing', 'Circulation', 'Diet'], correct: 3 },
        { q: 'The "Golden Hour" in trauma refers to:', options: ['Hour of peak hospital visits', 'Optimal time window for trauma intervention', 'Duration of surgery', 'Recovery phase'], correct: 1 },
    ],
    'week-2': [
        { q: 'Which cardiac rhythm is characterized by no discernible P waves and an irregular rhythm?', options: ['Sinus bradycardia', 'Atrial fibrillation', 'Bundle branch block', 'Normal sinus rhythm'], correct: 1 },
        { q: 'The correct compression-to-ventilation ratio for adult CPR is:', options: ['15:2', '30:2', '15:1', '5:1'], correct: 1 },
        { q: 'First-line drug for ventricular fibrillation after defibrillation:', options: ['Lidocaine', 'Amiodarone', 'Atropine', 'Adenosine'], correct: 1 },
        { q: 'ST elevation in leads II, III, aVF indicates which myocardial zone?', options: ['Anterior wall', 'Inferior wall', 'Lateral wall', 'Posterior wall'], correct: 1 },
        { q: 'Recommended depth of chest compressions in adults:', options: ['1–2 inches', '2–2.4 inches', '3–4 inches', '0.5–1 inch'], correct: 1 },
    ],
    'week-3': [
        { q: 'Class I indication for needle decompression is:', options: ['Pneumonia', 'Tension pneumothorax', 'Pleural effusion', 'Hemothorax'], correct: 1 },
        { q: 'FAST exam in trauma stands for:', options: ['Focused Assessment with Sonography for Trauma', 'Fast Action Stabilization Technique', 'Flow-Assisted Spinal Traction', 'None of the above'], correct: 0 },
        { q: 'A GCS of 15 indicates:', options: ['Deep coma', 'Normal neurological function', 'Moderate brain injury', 'Vegetative state'], correct: 1 },
        { q: "A positive Cullen's sign indicates:", options: ['Bruising around the navel', 'Bruising over the flank', 'Rigid abdomen', 'Rebound tenderness'], correct: 0 },
        { q: 'Hypotension + distended neck veins + absent breath sounds suggests:', options: ['Cardiac tamponade', 'Tension pneumothorax', 'Hemorrhagic shock', 'Anaphylaxis'], correct: 1 },
    ],
    'week-4': [
        { q: 'In pediatric patients, airway is best maintained using:', options: ['Chin-lift jaw-thrust', 'Head-tilt-chin-lift', 'Nasopharyngeal airway', 'Laryngeal mask'], correct: 0 },
        { q: 'Most common cause of cardiac arrest in children:', options: ['Primary cardiac arrhythmia', 'Respiratory failure', 'Trauma', 'Infection'], correct: 1 },
        { q: 'The Pediatric Assessment Triangle (PAT) includes:', options: ['Airway, Breathing, Circulation', 'Appearance, Work of breathing, Circulation to skin', 'GCS, Pupils, Motor', 'SAMPLE, OPQRST, ABCDE'], correct: 1 },
        { q: 'Normal respiratory rate for a 2-year-old:', options: ['12–16/min', '20–30/min', '40–60/min', '10–14/min'], correct: 1 },
        { q: 'Preferred vascular access when IV fails in pediatric emergencies:', options: ['Central line', 'Intraosseous (IO)', 'Femoral vein', 'Jugular vein'], correct: 1 },
    ],
};

const EXAM_DURATION = 20 * 60;
const MAX_STRIKES = 3;

// ─── Warning queue item ────────────────────────────────────────────────────────
interface WarningItem {
    id: number;
    type: 'tab' | 'fullscreen' | 'copy';
    message: string;
    detail: string;
}

interface Props {
    weekId: string;
    weekTitle: string;
    courseTitle: string;
    onClose: () => void;
    onComplete: (weekId: string, score: number) => void;
}

type Phase = 'consent' | 'exam' | 'results' | 'exit-confirm';

// ─── Helper ───────────────────────────────────────────────────────────────────
const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

// ══════════════════════════════════════════════════════════════════════════════
export function ProctorExam({ weekId, weekTitle, courseTitle, onClose, onComplete }: Props) {
    const [phase, setPhase] = useState<Phase>('consent');
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
    const [strikes, setStrikes] = useState(0);
    const [warnings, setWarnings] = useState<WarningItem[]>([]);
    const [activeWarning, setActiveWarning] = useState<WarningItem | null>(null);
    const [cameraOk, setCameraOk] = useState(false);
    const [cameraError, setCameraError] = useState(false);
    const [cameraGranted, setCameraGranted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const warnIdRef = useRef(0);
    const warningQueueRef = useRef<WarningItem[]>([]);
    const showingWarningRef = useRef(false);

    const questions = WEEK_QUESTIONS[weekId] ?? WEEK_QUESTIONS['week-1'];
    const totalQ = questions.length;
    const answered = Object.keys(answers).length;
    const isLow = timeLeft < 300;

    // ── Real clock ────────────────────────────────────────────────────────────
    useEffect(() => {
        const t = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    // ── Warning queue processor ───────────────────────────────────────────────
    const enqueueWarning = useCallback((type: WarningItem['type'], message: string, detail: string) => {
        warnIdRef.current += 1;
        const w: WarningItem = { id: warnIdRef.current, type, message, detail };
        warningQueueRef.current = [...warningQueueRef.current, w];
        setWarnings([...warningQueueRef.current]);
        processQueue();
    }, []); // eslint-disable-line

    const processQueue = useCallback(() => {
        if (showingWarningRef.current || warningQueueRef.current.length === 0) return;
        showingWarningRef.current = true;
        const next = warningQueueRef.current[0];
        setActiveWarning(next);
        setTimeout(() => {
            warningQueueRef.current = warningQueueRef.current.slice(1);
            setWarnings([...warningQueueRef.current]);
            setActiveWarning(null);
            showingWarningRef.current = false;
            processQueue();
        }, 4000);
    }, []);

    // ── Camera ────────────────────────────────────────────────────────────────
    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            streamRef.current = stream;
            if (videoRef.current) videoRef.current.srcObject = stream;
            setCameraOk(true);
            setCameraGranted(true);
        } catch {
            setCameraError(true);
            setCameraGranted(true);
        }
    }, []);

    const stopCamera = useCallback(() => {
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;
        setCameraOk(false);
    }, []);

    // Sync stream → video on phase change
    useEffect(() => {
        if (videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
        }
    }, [phase]);

    // ── Fullscreen ───────────────────────────────────────────────────────────
    const enterFullscreen = useCallback(async () => {
        try {
            await document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } catch { /* browser may block */ }
    }, []);

    const exitFullscreenClean = useCallback(async () => {
        try { if (document.fullscreenElement) await document.exitFullscreen(); } catch { /* */ }
        setIsFullscreen(false);
    }, []);

    // ── Transition consent → exam ─────────────────────────────────────────────
    useEffect(() => {
        if (cameraGranted && phase === 'consent') {
            enterFullscreen();
            setPhase('exam');
        }
    }, [cameraGranted, phase, enterFullscreen]);

    // ── Exam event listeners ──────────────────────────────────────────────────
    useEffect(() => {
        if (phase !== 'exam') return;

        // Timer
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) { doSubmit(); return 0; }
                return prev - 1;
            });
        }, 1000);

        // Tab visibility
        const onVisible = () => {
            if (document.hidden) {
                setStrikes(s => {
                    const next = s + 1;
                    if (next >= MAX_STRIKES) {
                        enqueueWarning('tab', 'EXAM TERMINATED', `You have been flagged ${MAX_STRIKES} times. Exam auto-submitted.`);
                        setTimeout(() => doSubmit(), 2000);
                    } else {
                        enqueueWarning('tab', 'Tab Switch Detected', `You left the exam window. Strike ${next}/${MAX_STRIKES}.`);
                    }
                    return next;
                });
            }
        };
        document.addEventListener('visibilitychange', onVisible);

        // Fullscreen change → warn + re-enter
        const onFsChange = () => {
            if (!document.fullscreenElement) {
                setIsFullscreen(false);
                enqueueWarning('fullscreen', 'Fullscreen Exited', 'Returning to fullscreen mode. Do not exit fullscreen during the exam.');
                setTimeout(() => enterFullscreen(), 800);
            } else {
                setIsFullscreen(true);
            }
        };
        document.addEventListener('fullscreenchange', onFsChange);

        // Block copy / paste / right-click
        const block = (e: Event) => { e.preventDefault(); };
        const onKey = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'u', 'a', 's', 'p'].includes(e.key.toLowerCase())) {
                e.preventDefault();
                enqueueWarning('copy', 'Shortcut Blocked', 'Keyboard shortcuts are disabled during proctored exams.');
            }
            if (e.key === 'PrintScreen') { e.preventDefault(); }
        };
        document.addEventListener('copy', block);
        document.addEventListener('cut', block);
        document.addEventListener('contextmenu', block);
        document.addEventListener('keydown', onKey);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            document.removeEventListener('visibilitychange', onVisible);
            document.removeEventListener('fullscreenchange', onFsChange);
            document.removeEventListener('copy', block);
            document.removeEventListener('cut', block);
            document.removeEventListener('contextmenu', block);
            document.removeEventListener('keydown', onKey);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase]);

    // ── Submit ────────────────────────────────────────────────────────────────
    const doSubmit = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        const correct = questions.reduce((a, q, i) => a + (answers[i] === q.correct ? 1 : 0), 0);
        const pct = Math.round((correct / totalQ) * 100);
        stopCamera();
        exitFullscreenClean();
        setPhase('results');
        onComplete(weekId, pct);
    }, [answers, questions, totalQ, stopCamera, exitFullscreenClean, onComplete, weekId]);

    const doCleanup = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        stopCamera();
        exitFullscreenClean();
        onClose();
    }, [stopCamera, exitFullscreenClean, onClose]);

    const correctCount = questions.reduce((a, q, i) => a + (answers[i] === q.correct ? 1 : 0), 0);
    const scorePct = Math.round((correctCount / totalQ) * 100);
    const timePercent = (timeLeft / EXAM_DURATION) * 100;

    // ══════════════════════════════════════════════════════════════════════════
    return (
        <div
            className="fixed inset-0 z-[9999] flex flex-col"
            style={{
                userSelect: 'none',
                background: 'radial-gradient(ellipse at top, #0d1117 0%, #060810 100%)',
            }}
        >
            {/* ─── CONSENT SCREEN ───────────────────────────────────────────────── */}
            <AnimatePresence>
                {phase === 'consent' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-10 flex items-center justify-center p-6"
                        style={{ background: 'radial-gradient(ellipse at top, #0d1117 0%, #060810 100%)' }}
                    >
                        {/* Subtle grid pattern */}
                        <div className="absolute inset-0 opacity-5" style={{
                            backgroundImage: 'linear-gradient(rgba(0,168,150,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,168,150,0.3) 1px, transparent 1px)',
                            backgroundSize: '50px 50px',
                        }} />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 22 }}
                            className="relative w-full max-w-2xl"
                        >
                            {/* Glow effect */}
                            <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-red-500/20 to-transparent pointer-events-none" />

                            <div className="relative bg-[#0d1117]/90 backdrop-blur border border-slate-800 rounded-3xl overflow-hidden">
                                {/* Top accent */}
                                <div className="h-1 bg-gradient-to-r from-[#EF476F] via-[#EF476F] to-transparent" />

                                <div className="p-8">
                                    {/* Header */}
                                    <div className="flex items-start gap-5 mb-8">
                                        <div className="relative flex-shrink-0">
                                            <div className="w-16 h-16 rounded-2xl bg-[#EF476F]/10 border border-[#EF476F]/30 flex items-center justify-center">
                                                <Shield size={30} className="text-[#EF476F]" />
                                            </div>
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#EF476F] rounded-full flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2.5 py-0.5 bg-[#EF476F]/15 border border-[#EF476F]/40 text-[#EF476F] text-[10px] font-black rounded tracking-[0.2em] uppercase">
                                                    Proctored Exam
                                                </span>
                                                <span className="px-2.5 py-0.5 bg-slate-800 text-slate-400 text-[10px] rounded tracking-wider uppercase">
                                                    Secure Environment
                                                </span>
                                            </div>
                                            <h1 className="text-2xl font-black text-white leading-tight">{weekTitle} Assessment</h1>
                                            <p className="text-sm text-slate-500 mt-1">{courseTitle}</p>
                                        </div>
                                    </div>

                                    {/* Stats row */}
                                    <div className="grid grid-cols-3 gap-3 mb-6">
                                        {[
                                            { icon: <Clock size={14} />, label: 'Duration', value: '20 Minutes' },
                                            { icon: <CheckCircle2 size={14} />, label: 'Questions', value: `${totalQ} MCQ` },
                                            { icon: <Eye size={14} />, label: 'Violations', value: `${MAX_STRIKES} Max` },
                                        ].map(({ icon, label, value }) => (
                                            <div key={label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center">
                                                <div className="flex items-center justify-center gap-1 text-slate-500 mb-1">{icon}<span className="text-[10px] uppercase tracking-wider">{label}</span></div>
                                                <p className="text-white font-bold text-sm">{value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Rules */}
                                    <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 mb-5 space-y-3">
                                        {[
                                            { color: '#EF476F', icon: <Monitor size={13} />, text: 'The exam runs in FULLSCREEN. Exiting triggers an automatic violation.' },
                                            { color: '#00A896', icon: <Camera size={13} />, text: 'Your CAMERA is recorded for identity verification throughout the exam.' },
                                            { color: '#FFD166', icon: <AlertTriangle size={13} />, text: 'Switching tabs or windows is detected and counts as a strike.' },
                                            { color: '#EF476F', icon: <X size={13} />, text: 'Copy, paste, right-click, and keyboard shortcuts are disabled.' },
                                            { color: '#00A896', icon: <Shield size={13} />, text: `${MAX_STRIKES} violations = automatic exam termination.` },
                                        ].map(({ color, icon, text }) => (
                                            <div key={text} className="flex items-start gap-3">
                                                <span className="mt-0.5 flex-shrink-0 p-1 rounded" style={{ color, background: `${color}18` }}>{icon}</span>
                                                <p className="text-sm text-slate-300 leading-relaxed">{text}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Camera notice */}
                                    <div className="flex items-center gap-3 border border-[#00A896]/30 bg-[#00A896]/8 rounded-xl px-4 py-3 mb-6">
                                        <Camera size={16} className="text-[#00A896] flex-shrink-0" />
                                        <p className="text-sm text-[#00A896]">
                                            <strong>Camera required.</strong> Click <em>Allow</em> when your browser asks for permission to start.
                                        </p>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={onClose}
                                            className="flex-1 py-3 rounded-xl border border-slate-700/60 text-slate-400 hover:text-white hover:border-slate-600 hover:bg-slate-800/40 transition-all text-sm font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <motion.button
                                            onClick={startCamera}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="flex-[2] py-3 rounded-xl text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-2xl shadow-red-500/20"
                                            style={{ background: 'linear-gradient(135deg, #EF476F 0%, #c73555 100%)' }}
                                        >
                                            <Shield size={16} />
                                            I Agree — Start Proctored Exam
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── EXAM SCREEN ──────────────────────────────────────────────────── */}
            {phase === 'exam' && (
                <div className="flex flex-col h-full">

                    {/* ── Top Bar ── */}
                    <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-slate-800/70"
                        style={{ background: 'rgba(6,8,16,0.95)', backdropFilter: 'blur(8px)' }}>

                        {/* Left: Branding */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#EF476F]/10 border border-[#EF476F]/30 flex items-center justify-center">
                                <Shield size={15} className="text-[#EF476F]" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-600 uppercase tracking-widest leading-none">Meducate Proctored Exam</p>
                                <p className="text-sm font-bold text-white leading-tight">{weekTitle} — {courseTitle}</p>
                            </div>
                        </div>

                        {/* Center: status indicators */}
                        <div className="flex items-center gap-3">
                            {/* LIVE badge */}
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EF476F]/10 border border-[#EF476F]/30 rounded-full">
                                <div className="w-2 h-2 rounded-full bg-[#EF476F] animate-pulse" />
                                <span className="text-[10px] font-black text-[#EF476F] tracking-[0.18em]">PROCTORED</span>
                            </div>

                            {/* Camera status */}
                            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[11px] font-medium ${cameraOk
                                ? 'border-[#00A896]/30 bg-[#00A896]/8 text-[#00A896]'
                                : 'border-slate-700 bg-slate-800/40 text-slate-500'
                                }`}>
                                {cameraOk ? <Camera size={11} /> : <CameraOff size={11} />}
                                {cameraOk ? 'Camera On' : 'No Camera'}
                            </div>

                            {/* Strikes */}
                            {strikes > 0 && (
                                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/8 text-[11px] font-bold text-yellow-400">
                                    <AlertTriangle size={11} />
                                    {strikes}/{MAX_STRIKES} Strikes
                                </div>
                            )}

                            {/* Time */}
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-mono font-black text-sm ${isLow
                                ? 'bg-[#EF476F]/10 border-[#EF476F]/40 text-[#EF476F] animate-pulse'
                                : 'bg-slate-800/60 border-slate-700 text-white'
                                }`}>
                                <Clock size={13} />
                                {fmt(timeLeft)}
                            </div>

                            {/* Real time */}
                            <span className="text-xs text-slate-600 font-mono tabular-nums hidden lg:block">
                                {currentTime.toLocaleTimeString()}
                            </span>
                        </div>

                        {/* Right: Exit */}
                        <button
                            onClick={() => setPhase('exit-confirm')}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-800 text-slate-500 hover:text-white hover:border-slate-600 hover:bg-slate-800/50 transition-all text-xs font-medium"
                        >
                            <X size={13} />
                            Exit
                        </button>
                    </div>

                    {/* Timer bar */}
                    <div className="flex-shrink-0 h-0.5 bg-slate-900">
                        <div
                            className={`h-full transition-all duration-1000 ${isLow ? 'bg-[#EF476F]' : 'bg-[#00A896]'}`}
                            style={{ width: `${timePercent}%` }}
                        />
                    </div>

                    {/* ── Main Body ── */}
                    <div className="flex-1 flex overflow-hidden">

                        {/* Left sidebar: Question navigator */}
                        <div className="flex-shrink-0 w-56 border-r border-slate-800/50 flex flex-col p-4 gap-4"
                            style={{ background: 'rgba(6,8,16,0.8)' }}>

                            {/* Candidate info */}
                            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-7 h-7 rounded-lg bg-[#00A896]/15 flex items-center justify-center">
                                        <User size={13} className="text-[#00A896]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-600 uppercase tracking-wider">Candidate</p>
                                        <p className="text-xs font-semibold text-white">Med Student</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                                    <Wifi size={10} />
                                    <span>Secure session active</span>
                                </div>
                            </div>

                            {/* Section label */}
                            <div>
                                <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-2 px-1">Questions</p>
                                <div className="grid grid-cols-5 gap-1.5">
                                    {questions.map((_, i) => {
                                        const done = answers[i] !== undefined;
                                        const active = i === currentQ;
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentQ(i)}
                                                className={`h-9 rounded-lg text-xs font-bold transition-all ${active
                                                    ? 'bg-[#00A896] text-white shadow-md shadow-[#00A896]/30 scale-110'
                                                    : done
                                                        ? 'bg-[#00A896]/20 border border-[#00A896]/40 text-[#00A896]'
                                                        : 'bg-slate-800/60 border border-slate-700/50 text-slate-500 hover:border-slate-600 hover:text-white'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="space-y-1.5">
                                {[
                                    { color: 'bg-[#00A896]', label: 'Current' },
                                    { color: 'bg-[#00A896]/20 border border-[#00A896]/40', label: 'Answered' },
                                    { color: 'bg-slate-800/60 border border-slate-700/50', label: 'Not visited' },
                                ].map(({ color, label }) => (
                                    <div key={label} className="flex items-center gap-2">
                                        <div className={`w-5 h-5 rounded-md ${color}`} />
                                        <span className="text-[10px] text-slate-600">{label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Answered progress */}
                            <div className="mt-auto">
                                <div className="flex items-center justify-between text-[10px] text-slate-600 mb-1.5">
                                    <span>Answered</span>
                                    <span className="font-bold text-white">{answered}/{totalQ}</span>
                                </div>
                                <div className="h-1.5 bg-slate-800 rounded-full">
                                    <div className="h-full bg-[#00A896] rounded-full transition-all" style={{ width: `${(answered / totalQ) * 100}%` }} />
                                </div>
                            </div>
                        </div>

                        {/* Center: Question */}
                        <div className="flex-1 flex flex-col overflow-y-auto p-8" style={{ background: 'radial-gradient(ellipse at center, #0d1117 0%, #060810 100%)' }}>
                            {/* Subtle grid */}
                            <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{
                                backgroundImage: 'linear-gradient(rgba(0,168,150,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,168,150,0.5) 1px, transparent 1px)',
                                backgroundSize: '40px 40px',
                            }} />

                            <div className="relative flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
                                {/* Question card */}
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentQ}
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -30 }}
                                        transition={{ duration: 0.18 }}
                                    >
                                        {/* Q header */}
                                        <div className="flex items-center justify-between mb-5">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                                Question {currentQ + 1} of {totalQ}
                                            </span>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${answers[currentQ] !== undefined
                                                ? 'bg-[#00A896]/15 text-[#00A896]'
                                                : 'bg-slate-800 text-slate-500'
                                                }`}>
                                                {answers[currentQ] !== undefined ? 'Answered' : 'Not answered'}
                                            </span>
                                        </div>

                                        {/* Question text */}
                                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-7 mb-5">
                                            <p className="text-white text-lg font-semibold leading-relaxed">
                                                {questions[currentQ].q}
                                            </p>
                                        </div>

                                        {/* Options */}
                                        <div className="space-y-3 mb-8">
                                            {questions[currentQ].options.map((opt, i) => {
                                                const sel = answers[currentQ] === i;
                                                return (
                                                    <motion.button
                                                        key={i}
                                                        onClick={() => setAnswers(p => ({ ...p, [currentQ]: i }))}
                                                        whileHover={{ x: 4 }}
                                                        whileTap={{ scale: 0.99 }}
                                                        className={`w-full text-left flex items-center gap-4 px-5 py-4 rounded-xl border-2 transition-all ${sel
                                                            ? 'border-[#00A896] bg-[#00A896]/10 shadow-lg shadow-[#00A896]/10'
                                                            : 'border-slate-800 bg-slate-900/30 hover:border-slate-600 hover:bg-slate-900/60'
                                                            }`}
                                                    >
                                                        {/* Radio */}
                                                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${sel ? 'border-[#00A896] bg-[#00A896]' : 'border-slate-600'
                                                            }`}>
                                                            {sel && <div className="w-2 h-2 rounded-full bg-white" />}
                                                        </div>
                                                        {/* Label */}
                                                        <span className={`w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-black ${sel ? 'bg-[#00A896]/20 text-[#00A896]' : 'bg-slate-800 text-slate-500'
                                                            }`}>
                                                            {String.fromCharCode(65 + i)}
                                                        </span>
                                                        <span className={`text-sm leading-relaxed ${sel ? 'text-white' : 'text-slate-300'}`}>{opt}</span>
                                                    </motion.button>
                                                );
                                            })}
                                        </div>

                                        {/* Navigation */}
                                        <div className="flex items-center justify-between">
                                            <button
                                                onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
                                                disabled={currentQ === 0}
                                                className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 disabled:opacity-20 hover:bg-slate-800/50 hover:text-white transition-all text-sm font-medium"
                                            >
                                                ← Previous
                                            </button>
                                            {currentQ < totalQ - 1 ? (
                                                <button
                                                    onClick={() => setCurrentQ(q => q + 1)}
                                                    className="px-6 py-2.5 rounded-xl text-white font-bold text-sm transition-all"
                                                    style={{ background: 'linear-gradient(135deg, #00A896 0%, #028090 100%)' }}
                                                >
                                                    Next →
                                                </button>
                                            ) : (
                                                <motion.button
                                                    onClick={doSubmit}
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    className="px-6 py-2.5 rounded-xl text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-red-500/20"
                                                    style={{ background: 'linear-gradient(135deg, #EF476F 0%, #c73555 100%)' }}
                                                >
                                                    <CheckCircle2 size={15} />
                                                    Submit Exam
                                                </motion.button>
                                            )}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Right sidebar: Camera feed */}
                        <div className="flex-shrink-0 w-56 border-l border-slate-800/50 flex flex-col p-4 gap-4"
                            style={{ background: 'rgba(6,8,16,0.8)' }}>

                            <p className="text-[10px] text-slate-600 uppercase tracking-widest">Identity Verification</p>

                            {/* Camera box */}
                            <div className="relative rounded-2xl overflow-hidden border border-[#EF476F]/30 bg-slate-900"
                                style={{ aspectRatio: '4/3', boxShadow: '0 0 24px -4px rgba(239,71,111,0.2)' }}>
                                {cameraError ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                        <CameraOff size={24} className="text-slate-600" />
                                        <p className="text-xs text-slate-600 text-center">Camera<br />unavailable</p>
                                    </div>
                                ) : (
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover scale-x-[-1]"
                                    />
                                )}

                                {/* Overlays */}
                                {/* Corner brackets */}
                                {['top-1 left-1', 'top-1 right-1', 'bottom-1 left-1', 'bottom-1 right-1'].map((pos, i) => (
                                    <div key={i} className={`absolute ${pos} w-5 h-5 border-[#EF476F]/60`} style={{
                                        borderTopWidth: i < 2 ? 2 : 0, borderBottomWidth: i >= 2 ? 2 : 0,
                                        borderLeftWidth: i % 2 === 0 ? 2 : 0, borderRightWidth: i % 2 === 1 ? 2 : 0,
                                        borderTopLeftRadius: i === 0 ? 6 : 0, borderTopRightRadius: i === 1 ? 6 : 0,
                                        borderBottomLeftRadius: i === 2 ? 6 : 0, borderBottomRightRadius: i === 3 ? 6 : 0,
                                    }} />
                                ))}

                                {/* LIVE badge */}
                                <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#EF476F] animate-pulse" />
                                    <span className="text-[9px] text-white font-black tracking-widest">LIVE</span>
                                </div>
                            </div>

                            {/* Camera status indicator */}
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs ${cameraOk
                                ? 'border-[#00A896]/30 bg-[#00A896]/8 text-[#00A896]'
                                : 'border-red-500/30 bg-red-500/8 text-red-400'
                                }`}>
                                {cameraOk ? <Camera size={12} /> : <CameraOff size={12} />}
                                {cameraOk ? 'Recorded' : 'Not recording'}
                            </div>

                            {/* Strikes display */}
                            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                                <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-2">Violations</p>
                                <div className="flex gap-2">
                                    {Array.from({ length: MAX_STRIKES }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={`flex-1 h-2 rounded-full transition-colors ${i < strikes ? 'bg-[#EF476F]' : 'bg-slate-800'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-[10px] text-slate-600 mt-2">
                                    {MAX_STRIKES - strikes} remaining before auto-submit
                                </p>
                            </div>

                            {/* Exam info */}
                            <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-3 space-y-2 mt-auto">
                                <div className="flex justify-between text-[11px]">
                                    <span className="text-slate-600">Section</span>
                                    <span className="text-white font-semibold">{weekTitle}</span>
                                </div>
                                <div className="flex justify-between text-[11px]">
                                    <span className="text-slate-600">Total Marks</span>
                                    <span className="text-white font-semibold">{totalQ * 20}</span>
                                </div>
                                <div className="flex justify-between text-[11px]">
                                    <span className="text-slate-600">Answered</span>
                                    <span className="text-[#00A896] font-bold">{answered}/{totalQ}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── GLOBAL WARNING TOAST (always on top) ─────────────────────────── */}
            <AnimatePresence>
                {activeWarning && (
                    <motion.div
                        key={activeWarning.id}
                        initial={{ opacity: 0, y: -80, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -60, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="fixed top-16 left-1/2 -translate-x-1/2 z-[10000] w-full max-w-md"
                    >
                        <div className="mx-4 rounded-2xl border overflow-hidden shadow-2xl shadow-black/50"
                            style={{
                                background: activeWarning.type === 'tab'
                                    ? 'linear-gradient(135deg, #1a0a0e 0%, #2d0f18 100%)'
                                    : activeWarning.type === 'fullscreen'
                                        ? 'linear-gradient(135deg, #0a1a0e 0%, #0f2d14 100%)'
                                        : 'linear-gradient(135deg, #1a1a0a 0%, #2d2b0f 100%)',
                                borderColor: activeWarning.type === 'tab' ? '#EF476F50' : activeWarning.type === 'fullscreen' ? '#00A89650' : '#FFD16650',
                            }}
                        >
                            {/* Warning top bar */}
                            <div className="h-0.5" style={{
                                background: activeWarning.type === 'tab' ? '#EF476F' : activeWarning.type === 'fullscreen' ? '#00A896' : '#FFD166',
                            }} />

                            <div className="flex items-start gap-4 p-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{
                                        background: activeWarning.type === 'tab' ? '#EF476F18' : activeWarning.type === 'fullscreen' ? '#00A89618' : '#FFD16618',
                                        border: `1px solid ${activeWarning.type === 'tab' ? '#EF476F40' : activeWarning.type === 'fullscreen' ? '#00A89640' : '#FFD16640'}`,
                                    }}>
                                    <AlertTriangle size={18} style={{
                                        color: activeWarning.type === 'tab' ? '#EF476F' : activeWarning.type === 'fullscreen' ? '#00A896' : '#FFD166',
                                    }} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-black text-white text-sm">{activeWarning.message}</p>
                                    <p className="text-xs mt-0.5" style={{
                                        color: activeWarning.type === 'tab' ? '#EF476F' : activeWarning.type === 'fullscreen' ? '#00A896' : '#FFD166',
                                    }}>{activeWarning.detail}</p>
                                </div>
                                {/* Remaining in queue */}
                                {warnings.length > 1 && (
                                    <span className="flex-shrink-0 px-2 py-0.5 bg-slate-800 rounded-full text-[10px] text-slate-400">
                                        +{warnings.length - 1}
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── EXIT CONFIRM ─────────────────────────────────────────────────── */}
            <AnimatePresence>
                {phase === 'exit-confirm' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10001] bg-black/85 backdrop-blur-sm flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.88, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                            className="w-full max-w-md bg-[#0d1117] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="h-0.5 bg-yellow-400" />
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mx-auto mb-5">
                                    <AlertTriangle size={30} className="text-yellow-400" />
                                </div>
                                <h2 className="text-xl font-black text-white mb-2">Exit Proctored Exam?</h2>
                                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                    Exiting before submission means your attempt will be marked as <span className="text-red-400 font-semibold">incomplete</span> and flagged in the proctoring report.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setPhase('exam')}
                                        className="flex-1 py-3 rounded-xl font-bold text-white text-sm transition-all"
                                        style={{ background: 'linear-gradient(135deg, #00A896 0%, #028090 100%)' }}
                                    >
                                        Continue Exam
                                    </button>
                                    <button
                                        onClick={doCleanup}
                                        className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white transition-all text-sm font-medium"
                                    >
                                        Exit Anyway
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── RESULTS SCREEN ───────────────────────────────────────────────── */}
            {phase === 'results' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-10 flex items-center justify-center p-6 overflow-y-auto"
                    style={{ background: 'radial-gradient(ellipse at top, #0d1117 0%, #060810 100%)' }}
                >
                    {/* Grid */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                        backgroundImage: 'linear-gradient(rgba(0,168,150,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,168,150,0.5) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }} />

                    <motion.div
                        initial={{ scale: 0.92, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, type: 'spring', stiffness: 180, damping: 20 }}
                        className="relative w-full max-w-2xl"
                    >
                        {/* Score hero */}
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0, rotate: -90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.3, type: 'spring', stiffness: 180 }}
                                className="relative inline-block"
                            >
                                <div className={`w-40 h-40 rounded-full flex flex-col items-center justify-center border-4 mx-auto mb-5 shadow-2xl ${scorePct >= 70
                                    ? 'border-[#00A896] shadow-[#00A896]/20'
                                    : 'border-[#EF476F] shadow-[#EF476F]/20'
                                    }`}
                                    style={{ background: scorePct >= 70 ? 'radial-gradient(circle, #00A89618 0%, transparent 70%)' : 'radial-gradient(circle, #EF476F18 0%, transparent 70%)' }}>
                                    <span className="text-5xl font-black text-white">{scorePct}</span>
                                    <span className="text-sm text-slate-500 font-medium">/ 100</span>
                                </div>
                            </motion.div>

                            <h1 className="text-3xl font-black text-white mb-1">
                                {scorePct >= 70 ? 'Assessment Passed' : 'Assessment Incomplete'}
                            </h1>
                            <p className="text-slate-500 text-sm">{weekTitle} — {courseTitle}</p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-4 gap-3 mb-6">
                            {[
                                { label: 'Score', value: `${scorePct}%`, color: scorePct >= 70 ? '#00A896' : '#EF476F' },
                                { label: 'Correct', value: `${correctCount}/${totalQ}`, color: '#00A896' },
                                { label: 'Incorrect', value: `${totalQ - correctCount}/${totalQ}`, color: '#EF476F' },
                                { label: 'Violations', value: String(strikes), color: strikes > 0 ? '#FFD166' : '#00A896' },
                            ].map(({ label, value, color }) => (
                                <motion.div
                                    key={label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.45 }}
                                    className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center"
                                >
                                    <p className="text-2xl font-black mb-0.5" style={{ color }}>{value}</p>
                                    <p className="text-[10px] text-slate-600 uppercase tracking-wider">{label}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Review */}
                        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 mb-5">
                            <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-4">Answer Review</p>
                            <div className="space-y-3">
                                {questions.map((q, i) => {
                                    const correct = answers[i] === q.correct;
                                    return (
                                        <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-800/50 last:border-0 last:pb-0">
                                            <span className={`mt-0.5 flex-shrink-0 ${correct ? 'text-[#00A896]' : 'text-[#EF476F]'}`}>
                                                {correct ? <CheckCircle2 size={15} /> : <X size={15} />}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-slate-300 leading-relaxed mb-1">{q.q}</p>
                                                {!correct && (
                                                    <p className="text-[11px] text-[#00A896] font-medium">
                                                        ✓ Correct: {q.options[q.correct]}
                                                    </p>
                                                )}
                                            </div>
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0 ${correct ? 'bg-[#00A896]/15 text-[#00A896]' : 'bg-[#EF476F]/15 text-[#EF476F]'
                                                }`}>
                                                {correct ? '+20' : '0'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <motion.button
                            onClick={onClose}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 rounded-2xl text-white font-black shadow-2xl shadow-teal-500/15"
                            style={{ background: 'linear-gradient(135deg, #00A896 0%, #028090 100%)' }}
                        >
                            Back to Course
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
