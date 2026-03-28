import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronLeft, ChevronRight, Layers, Eye, Activity, Play, Hand, Mic, Bot, BookOpen, Building2, Stethoscope } from 'lucide-react';
import { Viewer } from '../3d/Viewer';
import { HandGestureController, type NormalizedLandmark, type GestureControls } from '../3d/HandGestureController';
import { VoiceCommandController } from '../3d/VoiceCommandController';
import { AIAssistantOverlay } from '../3d/AIAssistantOverlay';
import { GestureGuidePanel } from '../3d/GestureGuidePanel';
import { OrganExplainerCard } from '../3d/OrganExplainerCard';
import { PrimaryButton } from '../ui/PrimaryButton';
import { QuizCard } from '../ui/QuizCard';
import { TriageSimulator } from './TriageSimulator';

export function SimulatorPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mode, setMode] = useState<'normal' | 'dissection' | 'pathology'>('normal');
  const [selectedOrgan, setSelectedOrgan] = useState<OrganId>('heart');
  const [selectedTool, setSelectedTool] = useState<string>('Scalpel');
  const [infoPanelOpen, setInfoPanelOpen] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number>();
  const [gestureEnabled, setGestureEnabled] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiAssistantTrigger, setAiAssistantTrigger] = useState<string | null>(null);
  const [aiScreenshot, setAiScreenshot] = useState<string | null>(null);
  const [gestureControls, setGestureControls] = useState<GestureControls | null>(null);
  const [lastVoiceCommand, setLastVoiceCommand] = useState<any>(null);
  const [gestureGuideOpen, setGestureGuideOpen] = useState(false);
  const [handLandmarks, setHandLandmarks] = useState<NormalizedLandmark[][] | null>(null);
  const currentGesture = gestureEnabled ? (gestureControls ? 'Gesture Active' : 'Show your hand') : '';
  const [explainerOpen, setExplainerOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(true);
  // ── NEW: Lab mode tabs ────────────────────────────────────────────────────
  const [labMode, setLabMode] = useState<'anatomy' | 'triage'>('anatomy');
  // OR Theater environment toggle
  const [orTheaterMode, setOrTheaterMode] = useState(true);
  // Anatomy layer system removed

  // Dissection undo/restore all refs (passed to Viewer)
  const undoRef = useRef<(() => void) | null>(null);
  const restoreAllRef = useRef<(() => void) | null>(null);

  const organs = [
    { id: 'full_body', name: 'Full Anatomy', category: 'General' },
    { id: 'heart', name: 'Heart', category: 'Cardiovascular' },
    { id: 'brain', name: 'Brain', category: 'Nervous' },
    { id: 'lungs', name: 'Lungs', category: 'Respiratory' },
    { id: 'liver', name: 'Liver', category: 'Digestive' },
    { id: 'kidneys', name: 'Kidneys', category: 'Urinary' },
    { id: 'stomach', name: 'Stomach', category: 'Digestive' },
  ];

  type OrganId = 'full_body' | 'heart' | 'brain' | 'lungs' | 'liver' | 'kidneys' | 'stomach';
  type OrganInfo = {
    [key in OrganId]: {
      name: string;
      description: string;
      facts: string[];
    };
  };

  const organInfo: OrganInfo = {
    full_body: {
      name: 'Full Body Anatomy',
      description: 'The complete human body structure using standard anatomical position. View muscles, skeletal system, and organs.',
      facts: ['206 bones in adult skeleton', '>600 muscles in the body', 'Skin is the largest organ'],
    },
    heart: {
      name: 'Heart',
      description: 'The heart is a muscular organ that pumps blood throughout the body via the circulatory system.',
      facts: ['Beats ~100,000 times per day', 'Pumps ~5 liters of blood per minute', '4 chambers: 2 atria, 2 ventricles'],
    },
    brain: {
      name: 'Brain',
      description: 'The brain is the control center of the nervous system, responsible for thought, memory, and emotion.',
      facts: ['Contains ~86 billion neurons', 'Weighs about 1.4 kg', 'Controls all bodily functions'],
    },
    lungs: {
      name: 'Lungs',
      description: 'The lungs are organs of respiration, responsible for gas exchange between air and blood.',
      facts: ['Right lung has 3 lobes, left has 2', 'Surface area ~70 m²', 'Essential for oxygenation'],
    },
    liver: {
      name: 'Liver',
      description: 'The liver is a vital organ that processes nutrients, detoxifies, and produces bile.',
      facts: ['Largest internal organ', 'Regenerates itself', 'Over 500 functions'],
    },
    kidneys: {
      name: 'Kidneys',
      description: 'The kidneys filter blood, remove waste, and balance fluids and electrolytes.',
      facts: ['About 1 million nephrons each', 'Regulate blood pressure', 'Produce urine'],
    },
    stomach: {
      name: 'Stomach',
      description: 'The stomach breaks down food with acid and enzymes before it enters the intestines.',
      facts: ['Can expand to hold ~1 liter', 'Secretes gastric acid', 'Starts protein digestion'],
    },
  };

  const quizQuestion = {
    question: 'Which chamber of the heart receives oxygenated blood from the lungs?',
    options: ['Right Atrium', 'Left Atrium', 'Right Ventricle', 'Left Ventricle'],
    correctAnswer: 1,
  };

  const handleSelectObject = (name: string, screenshot?: string) => {
    setAiAssistantOpen(true);
    setAiScreenshot(screenshot || null);
    setAiAssistantTrigger(`Explain the anatomy and function of the ${name}. Keep it very brief, under 2 sentences, as if you are a surgical assistant providing quick context during a dissection.`);

    // Speak it immediately
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`Target acquired: ${name}`);
    utterance.rate = 1.0;
    utterance.pitch = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // ── If Triage tab is active, render Triage Simulator full-screen ─────────
  if (labMode === 'triage') {
    return (
      <div className="fixed inset-0 top-16 flex flex-col" style={{ background: '#000' }}>
        {/* Mini tab bar */}
        <div className="flex items-center gap-2 px-6 py-2 border-b border-white/5" style={{ background: 'rgba(0,5,10,0.95)' }}>
          <button onClick={() => setLabMode('anatomy')} className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white">
            <Layers size={14} /> Anatomy Lab
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-[#EF476F]/10 text-[#EF476F] border border-[#EF476F]/30">
            <Stethoscope size={14} /> Emergency Triage
          </button>
        </div>
        <TriageSimulator />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 top-16 flex">
      {/* Sidebar - Organ Library */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="w-80 bg-background/95 backdrop-blur-xl border-r border-border flex flex-col z-20 shadow-2xl"
          >
            <div className="p-6 border-b border-border bg-[#00A896]/5">
              <h3 className="mb-4 text-xl font-bold bg-gradient-to-r from-[#00A896] to-[#028090] bg-clip-text text-transparent">Organ Library</h3>
              {/* Anatomy Layer Toggle Removed */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 transition-colors group-hover:text-[#00A896]" size={18} />
                <input
                  type="text"
                  placeholder="Search organs..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-background/50 border border-border focus:outline-none focus:ring-2 focus:ring-[#00A896]/50 transition-all shadow-sm focus:shadow-md"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {organs.map((organ) => (
                <motion.button
                  key={organ.id}
                  onClick={() => {
                    setSelectedOrgan(organ.id as OrganId);
                    setExplainerOpen(true);
                  }}
                  className={`w-full text-left p-4 rounded-xl transition-all border ${selectedOrgan === organ.id
                    ? 'bg-[#00A896] text-white border-[#00A896] shadow-lg shadow-[#00A896]/20'
                    : 'bg-card hover:bg-muted/80 border-transparent hover:border-border/50 hover:shadow-md'
                    }`}
                  whileHover={{ x: 5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-base">{organ.name}</p>
                      <p className={`text-xs mt-1 ${selectedOrgan === organ.id ? 'text-white/80' : 'text-muted-foreground'}`}>
                        {organ.category}
                      </p>
                    </div>
                    <ChevronRight size={18} className={selectedOrgan === organ.id ? 'text-white' : 'text-muted-foreground'} />
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="p-6 border-t border-border bg-muted/20 backdrop-blur-sm space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground tracking-wide uppercase text-[10px]">View Mode</h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'normal', label: 'Normal', icon: Eye },
                  { id: 'dissection', label: 'Dissect', icon: Layers },
                  { id: 'pathology', label: 'Disease', icon: Activity },
                ].map((modeOption) => (
                  <button
                    key={modeOption.id}
                    onClick={() => setMode(modeOption.id as any)}
                    className={`p-3 rounded-xl text-xs flex flex-col items-center gap-2 transition-all border ${mode === modeOption.id
                      ? 'bg-[#00A896] text-white border-[#00A896] shadow-md'
                      : 'bg-background hover:bg-muted border-border/50 hover:border-border'
                      }`}
                  >
                    <modeOption.icon size={20} />
                    <span className="font-medium">{modeOption.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main 3D Viewer */}
      <div className="flex-1 flex flex-col relative"> {/* Added relative for overlays */}
        {/* Toolbar */}
        <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6 z-30 relative">
          {/* Left: sidebar toggle + lab mode tabs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl bg-muted hover:bg-muted/80"
            >
              {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
            {/* Lab mode tab switcher */}
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl">
              <button
                onClick={() => setLabMode('anatomy')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${labMode === 'anatomy' ? 'bg-[#00A896] text-white' : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Layers size={13} /> Anatomy Lab
              </button>
              <button
                onClick={() => setLabMode('triage')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${'triage' === (labMode as string) ? 'bg-[#EF476F] text-white' : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Stethoscope size={13} /> Triage Sim
              </button>
            </div>
          </div>
          {/* Right: tools */}
          <div className="flex items-center gap-2">

            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${voiceEnabled
                ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                : 'bg-muted hover:bg-muted/80'
                }`}
              title="Voice Control"
            >
              <Mic size={18} />
              {voiceEnabled && <span className="text-[10px] uppercase font-bold tracking-wider">REC</span>}
            </button>
            <button
              onClick={() => setAiAssistantOpen(!aiAssistantOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${aiAssistantOpen
                ? 'bg-[#00A896]/10 text-[#00A896] border border-[#00A896]/20'
                : 'bg-muted hover:bg-muted/80'
                }`}
              title="AI Surgical Assistant"
            >
              <Bot size={18} />
            </button>
            <div className="w-px h-6 bg-border mx-1" />
            <button
              onClick={() => setGestureGuideOpen(!gestureGuideOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${gestureGuideOpen
                ? 'bg-[#00A896]/10 text-[#00A896] border border-[#00A896]/20'
                : 'bg-muted hover:bg-muted/80'
                }`}
              title="Gesture Guide"
            >
              <BookOpen size={16} />
              <span className="hidden sm:inline text-xs">Guide</span>
            </button>
            <button
              onClick={() => {
                if (gestureEnabled) {
                  // Turn off: reset gesture controls and force model back to normal
                  setGestureEnabled(false);
                  setGestureControls(null);
                  setHandLandmarks(null);
                  setMode('normal');
                } else {
                  setGestureEnabled(true);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${gestureEnabled
                ? 'bg-[#00A896] text-white'
                : 'bg-muted hover:bg-muted/80'
                }`}
            >
              <Hand size={16} />
              {gestureEnabled ? 'Gesture' : 'Gesture'}
            </button>
            {/* OR Theater toggle */}
            <button
              onClick={() => setOrTheaterMode(!orTheaterMode)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${orTheaterMode ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-muted hover:bg-muted/80'
                }`}
              title="Toggle OR Theater Environment"
            >
              <Building2 size={16} />
              <span className="hidden sm:inline text-xs">OR Theater</span>
            </button>
            <PrimaryButton onClick={() => setQuizMode(!quizMode)} icon={Play} className="text-sm px-4 py-2">
              Start Quiz
            </PrimaryButton>
          </div>
        </div>

        {/* 3D Viewer */}
        <div className="flex-1 relative p-0 overflow-hidden bg-black/90"> {/* Darker background for 'Theater' feel */}
          <Viewer
            mode={gestureControls?.mode || mode}
            selectedOrgan={selectedOrgan}
            selectedTool={selectedTool}
            gestureControls={gestureControls}
            gestureEnabled={gestureEnabled}
            voiceEnabled={voiceEnabled}
            lastCommand={lastVoiceCommand}
            onSelectObject={handleSelectObject}
            orTheater={orTheaterMode}
            handLandmarks={handLandmarks}
            onUndoRef={undoRef}
            onRestoreAllRef={restoreAllRef}
          />

          {/* New Controllers */}
          <VoiceCommandController
            enabled={voiceEnabled}
            context={`${organInfo[selectedOrgan]?.name} - ${mode} Mode`}
            onAIResponse={(_text) => {
              // relying on TTS
            }}
            onCommand={(cmd: any) => {
              // Pass command to Viewer via state
              setLastVoiceCommand(cmd);

              if (cmd.type === 'ROTATE') {
                // Log for debug
                console.log("Rotating", cmd.direction);
              }
              if (cmd.type === 'MODE') setMode(cmd.mode.toLowerCase() as any);
              if (cmd.type === 'TOOL') setSelectedTool(cmd.tool === 'NONE' ? 'None' : cmd.tool.charAt(0) + cmd.tool.slice(1).toLowerCase());
            }}
          />

          <AIAssistantOverlay
            isOpen={aiAssistantOpen}
            onClose={() => setAiAssistantOpen(false)}
            context={`${organInfo[selectedOrgan]?.name} - ${mode} Mode`}
            triggerQuery={aiAssistantTrigger}
            screenshotBase64={aiScreenshot}
            onQueryProcessed={() => {
              setAiAssistantTrigger(null);
              setAiScreenshot(null);
            }}
          />

          <HandGestureController
            enabled={gestureEnabled}
            onGestureChange={(controls) => {
              setGestureControls(controls);
              if (controls.mode !== mode) setMode(controls.mode);
              // Bind tool selection from Hand Palette
              if (controls.activeTool && controls.activeTool !== 'None' && controls.activeTool !== selectedTool) {
                setSelectedTool(controls.activeTool);
              }
            }}
            onHandLandmarks={setHandLandmarks}
          />

          {/* Organ Explainer Card */}
          <OrganExplainerCard
            organ={explainerOpen ? {
              name: organInfo[selectedOrgan]?.name,
              emoji: selectedOrgan === 'heart' ? '❤️' : selectedOrgan === 'brain' ? '🧠' : selectedOrgan === 'lungs' ? '🫁' : selectedOrgan === 'liver' ? '🫀' : selectedOrgan === 'kidneys' ? '🫘' : selectedOrgan === 'stomach' ? '🫃' : '🦴',
              system: selectedOrgan === 'heart' || selectedOrgan === 'lungs' ? 'Cardiovascular / Respiratory' : selectedOrgan === 'brain' ? 'Nervous System' : selectedOrgan === 'liver' || selectedOrgan === 'stomach' ? 'Digestive System' : selectedOrgan === 'kidneys' ? 'Urinary System' : 'Musculoskeletal',
              description: organInfo[selectedOrgan]?.description,
              facts: organInfo[selectedOrgan]?.facts,
            } : null}
            onClose={() => setExplainerOpen(false)}
          />

          {/* Gesture Guide Panel */}
          <GestureGuidePanel
            isOpen={gestureGuideOpen}
            onClose={() => setGestureGuideOpen(false)}
            gestureEnabled={gestureEnabled}
            currentGesture={currentGesture}
          />

          {/* Floating Surgical Tools Panel - ONLY visible in dissect mode on the right side */}
          {mode === 'dissection' && (
            <div className="absolute right-4 top-20 z-[100] flex flex-col items-end pointer-events-auto">
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className="mb-2 px-4 py-2 bg-black/80 backdrop-blur-md border border-[#00A896]/40 rounded-xl text-white text-sm font-bold shadow-xl flex items-center gap-2 hover:bg-black/90 transition-colors ring-1 ring-[#00A896]/20"
              >
                🛠️ Surgical Tools {isToolsOpen ? '▲' : '▼'}
              </button>

              {isToolsOpen && (
                <div className="bg-black/85 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl w-44">
                  <div className="text-[10px] text-white/50 bg-white/5 px-2 py-1 rounded text-center mb-3">
                    Voice: "Select Scalpel"
                  </div>
                  <div className="flex flex-col gap-2">
                    {[
                      { name: 'Scalpel', icon: '🔪', desc: 'Cut tissue' },
                      { name: 'Forceps', icon: '🥢', desc: 'Grip & drag' },
                      { name: 'Scissors', icon: '✂️', desc: 'Snip layers' },
                      { name: 'Retractor', icon: '🔧', desc: 'Pull apart' },
                      { name: 'Cautery', icon: '🔥', desc: 'Cauterize' }
                    ].map((tool) => (
                      <button
                        key={tool.name}
                        onClick={() => setSelectedTool(tool.name)}
                        className={`flex items-center gap-3 w-full h-11 px-3 rounded-xl transition-all text-sm font-semibold border ${
                          selectedTool === tool.name
                            ? 'bg-[#00A896] border-[#00A896] text-white shadow-lg shadow-[#00A896]/20'
                            : 'bg-white/5 border-white/10 hover:bg-white/15 text-white/80'
                        }`}
                      >
                        <span className="text-lg">{tool.icon}</span>
                        <div className="flex flex-col items-start">
                          <span className="leading-tight text-xs">{tool.name}</span>
                          <span className={`text-[9px] leading-tight ${selectedTool === tool.name ? 'text-white/70' : 'text-white/40'}`}>{tool.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Incision Depth */}
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <label className="text-[10px] font-bold text-white/50 block text-center mb-1">Incision Depth</label>
                    <input type="range" className="w-full accent-[#00A896]" min="0" max="100" />
                  </div>

                  {/* Undo / Restore All - only in dissection mode */}
                  <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-white/10">
                    <button
                      onClick={() => undoRef.current?.()}
                      className="w-full py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-colors"
                    >
                      ↩️ Undo Last
                    </button>
                    <button
                      onClick={() => restoreAllRef.current?.()}
                      className="w-full py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors"
                    >
                      🔄 Restore All
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {mode === 'pathology' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-10 bottom-10 bg-card/90 backdrop-blur-sm border border-border rounded-2xl p-4 z-30"
            >
              <h4 className="text-sm mb-3">Condition View</h4>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-xl bg-green-500 text-white text-sm">
                  Healthy
                </button>
                <button className="px-4 py-2 rounded-xl bg-muted hover:bg-[#EF476F] hover:text-white transition-all text-sm">
                  Diseased
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Info Panel */}
        <AnimatePresence>
          {infoPanelOpen && (
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              className="h-64 bg-card border-t border-border p-6 overflow-y-auto z-20"
            >
              <div className="max-w-4xl mx-auto">
                <div className="flex items-start justify-between mb-4">
                  <h3>{organInfo[selectedOrgan]?.name}</h3>
                  <button onClick={() => setInfoPanelOpen(false)} className="text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="rotate-90" size={20} />
                  </button>
                </div>
                <p className="text-muted-foreground mb-4">{organInfo[selectedOrgan]?.description}</p>
                <h4 className="mb-2">Key Facts</h4>
                <ul className="space-y-1 text-muted-foreground text-sm">
                  {organInfo[selectedOrgan]?.facts?.map((fact, i) => (
                    <li key={i}>• {fact}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>


      </div>

      {/* Quiz Overlay */}
      <AnimatePresence>
        {quizMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-16 bg-black/50 backdrop-blur-sm flex items-center justify-center z-60 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-2xl w-full"
            >
              <QuizCard
                question={quizQuestion.question}
                options={quizQuestion.options}
                selectedAnswer={selectedAnswer}
                correctAnswer={quizQuestion.correctAnswer}
                onSelect={setSelectedAnswer}
                showResult={selectedAnswer !== undefined}
              />
              {selectedAnswer !== undefined && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex gap-3 justify-end"
                >
                  <button
                    onClick={() => setSelectedAnswer(undefined)}
                    className="px-6 py-2 bg-muted rounded-xl hover:bg-muted/80"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => setQuizMode(false)}
                    className="px-6 py-2 bg-[#00A896] text-white rounded-xl hover:bg-[#008f7f]"
                  >
                    Continue
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
}
