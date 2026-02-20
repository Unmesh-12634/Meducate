import { useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Mic, MicOff, Activity } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceCommandControllerProps {
    enabled: boolean;
    onCommand: (command: VoiceCommand) => void;
}

export type VoiceCommand =
    | { type: 'ROTATE'; direction: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN' }
    | { type: 'ZOOM'; direction: 'IN' | 'OUT' }
    | { type: 'TOOL'; tool: 'SCALPEL' | 'FORCEPS' | 'RETRACTOR' | 'RESET' | 'NONE' }
    | { type: 'MODE'; mode: 'NORMAL' | 'DISSECTION' | 'PATHOLOGY' };

interface VoiceCommandControllerProps {
    enabled: boolean;
    onCommand: (command: VoiceCommand) => void;
    onAIResponse: (text: string) => void;
    context: string;
}

import { GeminiService } from '../../services/GeminiService';

export function VoiceCommandController({ enabled, onCommand, onAIResponse, context }: VoiceCommandControllerProps) {
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [recognition, setRecognition] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            // @ts-ignore
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);

            recognition.onresult = (event: any) => {
                const current = event.resultIndex;
                const transcript = event.results[current][0].transcript.toLowerCase().trim();
                setTranscript(transcript);

                // Process Payload
                if (event.results[current].isFinal) {
                    processCommand(transcript);
                    // Don't clear immediately if processing, wait for result
                }
            };

            setRecognition(recognition);
        } else {
            console.warn("Speech recognition not supported");
        }
    }, [context]); // Re-bind if context changes? No, context is passed to processCommand which is a callback

    useEffect(() => {
        if (enabled && recognition) {
            try {
                recognition.start();
            } catch (e) {
                // Already started
            }
        } else if (!enabled && recognition) {
            recognition.stop();
        }
    }, [enabled, recognition]);

    const processCommand = useCallback(async (text: string) => {
        console.log("Voice Command:", text);

        // --- 1. Fast Path (Local Regex) ---
        // Immediate feedback for common controls to avoid latency
        if (text.includes('rotate left') || text.includes('turn left')) {
            onCommand({ type: 'ROTATE', direction: 'LEFT' });
            toast.info("Rotating Left");
            setTranscript('');
            return;
        }
        if (text.includes('rotate right') || text.includes('turn right')) {
            onCommand({ type: 'ROTATE', direction: 'RIGHT' });
            toast.info("Rotating Right");
            setTranscript('');
            return;
        }
        if (text.includes('zoom in')) {
            onCommand({ type: 'ZOOM', direction: 'IN' });
            toast.info("Zooming In");
            setTranscript('');
            return;
        }

        // --- 2. Slow Path (Jarvis AI) ---
        setIsProcessing(true);
        // setTranscript('Processing...'); // Optional: show status

        try {
            const intent = await GeminiService.interpretCommand(text, context);

            if (intent.type === 'ACTION') {
                const { action, params, explanation } = intent;

                // Map AI intent to VoiceCommand
                if (action === 'ROTATE') {
                    onCommand({ type: 'ROTATE', direction: params.direction });
                } else if (action === 'ZOOM') {
                    onCommand({ type: 'ZOOM', direction: params.direction });
                } else if (action === 'SET_TOOL') {
                    onCommand({ type: 'TOOL', tool: params.tool.toUpperCase() as any });
                } else if (action === 'SET_MODE') {
                    onCommand({ type: 'MODE', mode: params.mode.toUpperCase() as any });
                } else if (action === 'RESET_VIEW') {
                    onCommand({ type: 'TOOL', tool: 'RESET' });
                }

                if (explanation) {
                    toast.success(explanation);
                    GeminiService.speakResponse(explanation);
                }
            } else if (intent.type === 'RESPONSE') {
                onAIResponse(intent.text);
                GeminiService.speakResponse(intent.text);
            }
        } catch (error) {
            console.error("Jarvis Error:", error);
            toast.error("I couldn't process that.");
        } finally {
            setIsProcessing(false);
            setTranscript('');
        }
    }, [onCommand, onAIResponse, context]);

    if (!enabled) return null;

    return (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50">
            <div className={`
                backdrop-blur-xl px-6 py-3 rounded-full flex items-center gap-4 shadow-2xl border transition-all duration-300
                ${isProcessing
                    ? 'bg-[#00A896]/90 border-[#00A896]/50 shadow-[0_0_30px_rgba(0,168,150,0.3)]'
                    : 'bg-black/80 border-white/10'
                }
            `}>
                <div className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-colors ${isListening ? 'bg-red-500/20 text-red-500' : 'bg-gray-500/20 text-gray-400'}`}>
                    {isProcessing ? (
                        <Activity className="animate-spin text-white" size={20} />
                    ) : isListening ? (
                        <>
                            <motion.div
                                className="absolute inset-0 rounded-full border border-red-500"
                                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            />
                            <Mic size={20} />
                        </>
                    ) : (
                        <MicOff size={20} />
                    )}
                </div>

                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
                        {isProcessing ? 'Jarvis AI' : 'Voice Control'}
                    </span>
                    <div className="flex items-center gap-2 h-6 min-w-[150px]">
                        {transcript ? (
                            <span className="text-sm font-medium text-white">{transcript}</span>
                        ) : isProcessing ? (
                            <span className="text-sm text-white/80 animate-pulse">Thinking...</span>
                        ) : (
                            <span className="text-sm text-white/30 italic">Listening...</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

