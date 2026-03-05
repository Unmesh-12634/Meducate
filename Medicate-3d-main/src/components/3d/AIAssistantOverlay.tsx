import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react'; // Add AnimatePresence import
import { Bot, X, Send, Volume2, VolumeX } from 'lucide-react';

interface AIAssistantOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    context?: string; // e.g., "Heart Dissection"
    triggerQuery?: string | null;
    screenshotBase64?: string | null;
    onQueryProcessed?: () => void;
}

export function AIAssistantOverlay({ isOpen, onClose, context = "General Anatomy", triggerQuery, screenshotBase64, onQueryProcessed }: AIAssistantOverlayProps) {
    const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
        { role: 'model', text: `Hello! I'm your surgical AI assistant. I'm monitoring your ${context} session. Ask me anything.` }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (triggerQuery && isOpen) {
            handleSend(triggerQuery);
            if (onQueryProcessed) onQueryProcessed();
        }
    }, [triggerQuery, isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const speak = (text: string) => {
        if (isMuted) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    };

    const handleSend = async (overrideInput?: string) => {
        const userMsg = overrideInput || input;
        if (!userMsg?.trim()) return;

        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        if (!overrideInput) setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8080/evaluate-surgery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contextPrompt: `Current Context: ${context}. User Question: ${userMsg}`,
                    screenshotBase64: screenshotBase64
                })
            });
            const data = await response.json();

            if (data.feedback) {
                setMessages(prev => [...prev, { role: 'model', text: data.feedback }]);
                speak(data.feedback);
            } else {
                throw new Error("No feedback received");
            }
        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the medical database right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: 20, y: 20 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: 20, y: 20 }}
                    className="fixed bottom-24 left-4 z-40 w-80 bg-black/80 backdrop-blur-xl border border-[#00A896]/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden h-96"
                >
                    {/* Header */}
                    <div className="p-3 bg-[#00A896]/20 border-b border-[#00A896]/30 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#00A896]/20 flex items-center justify-center text-[#00A896]">
                                <Bot size={18} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">MediBot Assist</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] text-white/50">Online • {context}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
                            >
                                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                            </button>
                            <button
                                onClick={onClose}
                                className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${msg.role === 'user'
                                        ? 'bg-[#00A896] text-white rounded-tr-sm'
                                        : 'bg-white/10 text-white/90 rounded-tl-sm border border-white/5'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white/10 p-3 rounded-2xl rounded-tl-sm flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-white/10 bg-white/5">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask Dr. AI..."
                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#00A896]/50"
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#00A896] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#008f7f] transition-all"
                            >
                                <Send size={12} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
