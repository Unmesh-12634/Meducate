import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Send,
  Activity,
  Heart,
  Droplet,
  Thermometer,
  User,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Stethoscope,
  Brain,
  Zap,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  ChevronRight,
  Award,
  Target,
  BookOpen,
  Mic,
  Pause,
  Play
} from 'lucide-react';

interface SimulationInterfaceProps {
  onNavigate: (page: string) => void;
  onEndSimulation: () => void;
}

interface Message {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

interface MCQ {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

interface PatientData {
  name: string;
  age: number;
  gender: string;
  chiefComplaint: string;
  vitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    respiratoryRate: number;
    o2Saturation: number;
  };
  medicalHistory: string[];
  allergies: string[];
  currentMedications: string[];
}

export function SimulationInterface({ onNavigate, onEndSimulation }: SimulationInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      text: "Hello Doctor, I'm experiencing severe chest pain that started about 2 hours ago. It feels like pressure and radiates to my left arm.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentMCQ, setCurrentMCQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const patientData: PatientData = {
    name: 'John Mitchell',
    age: 58,
    gender: 'Male',
    chiefComplaint: 'Severe chest pain with radiation to left arm',
    vitals: {
      heartRate: 102,
      bloodPressure: '145/95',
      temperature: 37.2,
      respiratoryRate: 22,
      o2Saturation: 94
    },
    medicalHistory: [
      'Hypertension (5 years)',
      'Type 2 Diabetes (3 years)',
      'High cholesterol',
      'Former smoker (quit 2 years ago)'
    ],
    allergies: ['Penicillin', 'Sulfa drugs'],
    currentMedications: [
      'Metformin 1000mg BID',
      'Lisinopril 10mg daily',
      'Atorvastatin 40mg daily',
      'Aspirin 81mg daily'
    ]
  };

  const mcqQuestions: MCQ[] = [
    {
      id: 1,
      question: 'Based on the patient\'s presentation (chest pain radiating to left arm, elevated HR and BP), what is the MOST likely diagnosis?',
      options: [
        'Gastroesophageal reflux disease (GERD)',
        'Acute myocardial infarction (MI)',
        'Panic attack',
        'Musculoskeletal pain'
      ],
      correctAnswer: 1,
      explanation: 'The patient presents with classic symptoms of acute MI: chest pain radiating to the left arm, elevated heart rate, elevated blood pressure, and significant risk factors (hypertension, diabetes, former smoker). This requires immediate intervention.',
      category: 'Diagnosis'
    },
    {
      id: 2,
      question: 'What is the FIRST immediate intervention you should order?',
      options: [
        'Order chest X-ray',
        'Give sublingual nitroglycerin and call for ECG',
        'Send patient home with antacids',
        'Order stress test for next week'
      ],
      correctAnswer: 1,
      explanation: 'In suspected MI, immediate actions include: administering aspirin (if not already given), sublingual nitroglycerin, obtaining a 12-lead ECG within 10 minutes, and continuous cardiac monitoring. Time is muscle in MI management.',
      category: 'Immediate Action'
    },
    {
      id: 3,
      question: 'Given the patient\'s allergy to Penicillin, which cardiac catheterization preparation is CONTRAINDICATED?',
      options: [
        'Pre-procedure hydration',
        'Using penicillin-based prophylactic antibiotics',
        'Iodinated contrast media (with proper premedication)',
        'Beta-blocker administration'
      ],
      correctAnswer: 1,
      explanation: 'Penicillin-based antibiotics should be avoided in patients with documented penicillin allergy. Alternative prophylactic antibiotics (if needed) should be chosen. The other options are standard preparations for cardiac catheterization.',
      category: 'Safety'
    },
    {
      id: 4,
      question: 'The ECG shows ST-segment elevation in leads II, III, and aVF. Which coronary artery is MOST likely affected?',
      options: [
        'Left anterior descending (LAD) artery',
        'Right coronary artery (RCA)',
        'Left circumflex artery',
        'Left main coronary artery'
      ],
      correctAnswer: 1,
      explanation: 'ST-elevation in leads II, III, and aVF indicates an inferior wall MI, which is typically caused by occlusion of the right coronary artery (RCA). The RCA supplies the inferior wall of the left ventricle in most patients.',
      category: 'ECG Interpretation'
    },
    {
      id: 5,
      question: 'What is the target door-to-balloon time for STEMI patients undergoing primary PCI?',
      options: [
        'Within 30 minutes',
        'Within 90 minutes',
        'Within 3 hours',
        'Within 6 hours'
      ],
      correctAnswer: 1,
      explanation: 'According to ACC/AHA guidelines, the goal for door-to-balloon time in STEMI patients is ≤90 minutes. This rapid intervention is crucial for minimizing myocardial damage and improving patient outcomes.',
      category: 'Clinical Guidelines'
    },
    {
      id: 6,
      question: 'Which medication combination should be administered immediately in this STEMI patient?',
      options: [
        'Antibiotics and antihistamines',
        'Aspirin, P2Y12 inhibitor, heparin, and statin',
        'Calcium channel blockers and diuretics',
        'ACE inhibitor and beta-blocker only'
      ],
      correctAnswer: 1,
      explanation: 'Initial STEMI management includes dual antiplatelet therapy (aspirin + P2Y12 inhibitor like clopidogrel or ticagrelor), anticoagulation (heparin or LMWH), and statin therapy. Beta-blockers and ACE inhibitors are added but are not the immediate first-line medications.',
      category: 'Pharmacology'
    }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isTimerRunning) {
        setSimulationTime(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "The pain is constant, about 8/10 in severity. I also feel short of breath and a bit nauseous.",
        "It started suddenly while I was resting. I've never felt anything like this before.",
        "Yes, I take medications for my blood pressure and diabetes. I also had high cholesterol.",
        "I'm allergic to penicillin - I get a rash. Also sulfa drugs make me sick.",
        "The pain is right in the center of my chest, like someone is sitting on it. It's crushing.",
        "I smoked for 30 years but quit 2 years ago. My father had a heart attack at age 55."
      ];

      const aiMessage: Message = {
        id: messages.length + 2,
        sender: 'ai',
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);
    }, 1500);
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (answeredQuestions.includes(mcqQuestions[currentMCQ].id)) return;

    setSelectedAnswer(optionIndex);
    setShowExplanation(true);

    if (optionIndex === mcqQuestions[currentMCQ].correctAnswer) {
      setScore(score + 1);
    }

    setAnsweredQuestions([...answeredQuestions, mcqQuestions[currentMCQ].id]);
  };

  const handleNextQuestion = () => {
    if (currentMCQ < mcqQuestions.length - 1) {
      setCurrentMCQ(currentMCQ + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const getVitalStatus = (vital: string, value: number | string) => {
    switch (vital) {
      case 'heartRate':
        return value > 100 ? 'critical' : value > 80 ? 'warning' : 'normal';
      case 'o2Saturation':
        return value < 90 ? 'critical' : value < 95 ? 'warning' : 'normal';
      case 'temperature':
        return value > 38 ? 'warning' : 'normal';
      default:
        return 'normal';
    }
  };

  const getVitalColor = (status: string) => {
    switch (status) {
      case 'critical':
        return '#EF476F';
      case 'warning':
        return '#FFD166';
      default:
        return '#00A896';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl bg-background/80"
      >
        <div className="flex items-center gap-4">
          <motion.button
            onClick={() => onNavigate('start-simulation')}
            whileHover={{ scale: 1.05, x: -3 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-xl bg-muted hover:bg-muted/70 transition-all"
          >
            <ArrowLeft size={20} />
          </motion.button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00A896] to-[#028090] flex items-center justify-center">
              <Stethoscope size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm">Emergency Medicine Simulation</h3>
              <p className="text-xs text-muted-foreground">Acute Cardiac Event</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Timer */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 bg-muted rounded-xl"
          >
            <Clock size={16} className="text-[#00A896]" />
            <span className="text-sm font-medium">{formatTime(simulationTime)}</span>
            <motion.button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="ml-2"
            >
              {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
            </motion.button>
          </motion.div>

          {/* Score */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00A896]/20 to-[#028090]/20 border border-[#00A896]/30 rounded-xl"
          >
            <Award size={16} className="text-[#00A896]" />
            <span className="text-sm font-medium">
              Score: {score}/{mcqQuestions.length}
            </span>
          </motion.div>

          {/* End Simulation */}
          <motion.button
            onClick={onEndSimulation}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-[#EF476F] text-white rounded-xl hover:bg-[#EF476F]/90 transition-all"
          >
            End Simulation
          </motion.button>
        </div>
      </motion.div>

      {/* Main Three-Column Layout */}
      <div className="grid grid-cols-12 gap-4 p-4 h-[calc(100vh-80px)]">
        {/* Left Column - Patient Data (3 columns) */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="col-span-3 bg-card border border-border rounded-2xl p-4 overflow-y-auto space-y-4"
        >
          {/* Patient Info */}
          <div className="pb-4 border-b border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00A896] to-[#028090] flex items-center justify-center text-white">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-sm">{patientData.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {patientData.age}y • {patientData.gender}
                </p>
              </div>
            </div>
            <div className="bg-[#EF476F]/10 border border-[#EF476F]/30 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle size={14} className="text-[#EF476F]" />
                <p className="text-xs font-medium text-[#EF476F]">Chief Complaint</p>
              </div>
              <p className="text-xs">{patientData.chiefComplaint}</p>
            </div>
          </div>

          {/* Vital Signs */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Activity size={16} className="text-[#00A896]" />
              <h4 className="text-xs font-medium">Vital Signs</h4>
            </div>
            <div className="space-y-2">
              <motion.div
                whileHover={{ scale: 1.02, x: 3 }}
                className="bg-muted rounded-xl p-3 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Heart
                      size={14}
                      style={{ color: getVitalColor(getVitalStatus('heartRate', patientData.vitals.heartRate)) }}
                    />
                    <p className="text-xs text-muted-foreground">Heart Rate</p>
                  </div>
                  {getVitalStatus('heartRate', patientData.vitals.heartRate) !== 'normal' && (
                    <TrendingUp size={12} className="text-[#EF476F]" />
                  )}
                </div>
                <p
                  className="text-lg font-medium"
                  style={{ color: getVitalColor(getVitalStatus('heartRate', patientData.vitals.heartRate)) }}
                >
                  {patientData.vitals.heartRate} bpm
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, x: 3 }}
                className="bg-muted rounded-xl p-3 cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Activity size={14} className="text-[#00A896]" />
                  <p className="text-xs text-muted-foreground">Blood Pressure</p>
                </div>
                <p className="text-lg font-medium text-[#EF476F]">
                  {patientData.vitals.bloodPressure}
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, x: 3 }}
                className="bg-muted rounded-xl p-3 cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Droplet
                    size={14}
                    style={{ color: getVitalColor(getVitalStatus('o2Saturation', patientData.vitals.o2Saturation)) }}
                  />
                  <p className="text-xs text-muted-foreground">O₂ Saturation</p>
                </div>
                <p
                  className="text-lg font-medium"
                  style={{ color: getVitalColor(getVitalStatus('o2Saturation', patientData.vitals.o2Saturation)) }}
                >
                  {patientData.vitals.o2Saturation}%
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, x: 3 }}
                className="bg-muted rounded-xl p-3 cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Thermometer size={14} className="text-[#FFD166]" />
                  <p className="text-xs text-muted-foreground">Temperature</p>
                </div>
                <p className="text-lg font-medium">
                  {patientData.vitals.temperature}°C
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, x: 3 }}
                className="bg-muted rounded-xl p-3 cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={14} className="text-[#00A896]" />
                  <p className="text-xs text-muted-foreground">Respiratory Rate</p>
                </div>
                <p className="text-lg font-medium">
                  {patientData.vitals.respiratoryRate} /min
                </p>
              </motion.div>
            </div>
          </div>

          {/* Medical History */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText size={16} className="text-[#FFD166]" />
              <h4 className="text-xs font-medium">Medical History</h4>
            </div>
            <div className="space-y-1.5">
              {patientData.medicalHistory.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                  className="bg-muted rounded-lg px-3 py-2 text-xs"
                >
                  • {item}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={16} className="text-[#EF476F]" />
              <h4 className="text-xs font-medium text-[#EF476F]">Allergies</h4>
            </div>
            <div className="space-y-1.5">
              {patientData.allergies.map((allergy, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  className="bg-[#EF476F]/10 border border-[#EF476F]/30 rounded-lg px-3 py-2 text-xs text-[#EF476F]"
                >
                  ⚠ {allergy}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Current Medications */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={16} className="text-[#00A896]" />
              <h4 className="text-xs font-medium">Current Medications</h4>
            </div>
            <div className="space-y-1.5">
              {patientData.currentMedications.map((med, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.05 }}
                  className="bg-muted rounded-lg px-3 py-2 text-xs"
                >
                  💊 {med}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Center Column - AI Chat Interface (6 columns) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="col-span-6 bg-card border border-border rounded-2xl flex flex-col"
        >
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00A896] to-[#028090] flex items-center justify-center">
                <MessageSquare size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm">Patient Interview</h3>
                <p className="text-xs text-muted-foreground">Ask questions to gather information</p>
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-xs flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Active
              </motion.div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message, idx) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'ai'
                        ? 'bg-gradient-to-br from-[#00A896] to-[#028090]'
                        : 'bg-gradient-to-br from-[#FFD166] to-[#FFB422]'
                    }`}
                  >
                    {message.sender === 'ai' ? (
                      <User size={16} className="text-white" />
                    ) : (
                      <Stethoscope size={16} className="text-white" />
                    )}
                  </div>
                  <div className={`flex-1 max-w-[80%] ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`inline-block px-4 py-3 rounded-2xl ${
                        message.sender === 'ai'
                          ? 'bg-muted text-foreground'
                          : 'bg-gradient-to-r from-[#00A896] to-[#028090] text-white'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-2">{message.timestamp}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask the patient a question..."
                className="flex-1 px-4 py-3 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-[#00A896] transition-all"
              />
              <motion.button
                onClick={handleSendMessage}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!inputMessage.trim()}
                className="px-6 py-3 bg-gradient-to-r from-[#00A896] to-[#028090] text-white rounded-xl hover:shadow-lg hover:shadow-[#00A896]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send size={18} />
                Send
              </motion.button>
            </div>
            
            {/* Quick Questions */}
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                'Describe the pain',
                'When did it start?',
                'Any medications?',
                'Medical history?',
                'Any allergies?',
                'Family history?'
              ].map((question, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setInputMessage(question)}
                  className="px-3 py-1.5 bg-muted hover:bg-[#00A896]/10 hover:border-[#00A896] border border-transparent rounded-lg text-xs transition-all"
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column - MCQ Assessment (3 columns) */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="col-span-3 bg-card border border-border rounded-2xl p-4 overflow-y-auto"
        >
          {/* MCQ Header */}
          <div className="mb-4 pb-4 border-b border-border">
            <div className="flex items-center gap-2 mb-2">
              <Brain size={20} className="text-[#FFD166]" />
              <h3 className="text-sm">Clinical Assessment</h3>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Question {currentMCQ + 1} of {mcqQuestions.length}</span>
              <span className="px-2 py-1 bg-[#FFD166]/20 text-[#FFD166] rounded-lg">
                {mcqQuestions[currentMCQ].category}
              </span>
            </div>
          </div>

          {/* Question */}
          <div className="mb-4">
            <div className="bg-gradient-to-r from-[#00A896]/10 to-[#028090]/10 border border-[#00A896]/30 rounded-xl p-4">
              <p className="text-sm leading-relaxed">{mcqQuestions[currentMCQ].question}</p>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-4">
            {mcqQuestions[currentMCQ].options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === mcqQuestions[currentMCQ].correctAnswer;
              const isAnswered = answeredQuestions.includes(mcqQuestions[currentMCQ].id);
              
              let buttonClass = 'bg-muted hover:bg-muted/70 border-transparent';
              
              if (isAnswered && isSelected) {
                buttonClass = isCorrect
                  ? 'bg-green-500/20 border-green-500 text-green-500'
                  : 'bg-red-500/20 border-red-500 text-red-500';
              } else if (isAnswered && isCorrect) {
                buttonClass = 'bg-green-500/20 border-green-500 text-green-500';
              } else if (isSelected) {
                buttonClass = 'bg-[#00A896]/10 border-[#00A896]';
              }

              return (
                <motion.button
                  key={idx}
                  onClick={() => handleAnswerSelect(idx)}
                  disabled={isAnswered}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.05 }}
                  whileHover={!isAnswered ? { scale: 1.02, x: 5 } : {}}
                  whileTap={!isAnswered ? { scale: 0.98 } : {}}
                  className={`w-full text-left p-4 rounded-xl border transition-all disabled:cursor-not-allowed ${buttonClass}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        isAnswered && isCorrect
                          ? 'border-green-500 bg-green-500'
                          : isAnswered && isSelected
                          ? 'border-red-500 bg-red-500'
                          : isSelected
                          ? 'border-[#00A896] bg-[#00A896]'
                          : 'border-muted-foreground'
                      }`}
                    >
                      {isAnswered && isCorrect && <CheckCircle2 size={14} className="text-white" />}
                      {isAnswered && isSelected && !isCorrect && <XCircle size={14} className="text-white" />}
                      {!isAnswered && isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <p className="text-sm flex-1">{option}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="mb-4"
              >
                <div
                  className={`rounded-xl p-4 border-2 ${
                    selectedAnswer === mcqQuestions[currentMCQ].correctAnswer
                      ? 'bg-green-500/10 border-green-500'
                      : 'bg-red-500/10 border-red-500'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {selectedAnswer === mcqQuestions[currentMCQ].correctAnswer ? (
                      <CheckCircle2 size={16} className="text-green-500" />
                    ) : (
                      <XCircle size={16} className="text-red-500" />
                    )}
                    <h4 className="text-sm font-medium">
                      {selectedAnswer === mcqQuestions[currentMCQ].correctAnswer ? 'Correct!' : 'Incorrect'}
                    </h4>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {mcqQuestions[currentMCQ].explanation}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Button */}
          {answeredQuestions.includes(mcqQuestions[currentMCQ].id) && currentMCQ < mcqQuestions.length - 1 && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleNextQuestion}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-[#00A896] to-[#028090] text-white rounded-xl hover:shadow-lg hover:shadow-[#00A896]/30 transition-all flex items-center justify-center gap-2"
            >
              Next Question
              <ChevronRight size={18} />
            </motion.button>
          )}

          {/* Completion Message */}
          {answeredQuestions.length === mcqQuestions.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-[#00A896]/20 to-[#028090]/20 border border-[#00A896]/30 rounded-xl p-4 text-center"
            >
              <Award size={32} className="text-[#00A896] mx-auto mb-2" />
              <h4 className="text-sm font-medium mb-1">Assessment Complete!</h4>
              <p className="text-xs text-muted-foreground mb-3">
                You scored {score} out of {mcqQuestions.length}
              </p>
              <div className="text-2xl font-bold text-[#00A896]">
                {Math.round((score / mcqQuestions.length) * 100)}%
              </div>
            </motion.div>
          )}

          {/* Progress Indicator */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{answeredQuestions.length}/{mcqQuestions.length}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(answeredQuestions.length / mcqQuestions.length) * 100}%` }}
                className="h-full bg-gradient-to-r from-[#00A896] to-[#028090]"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
