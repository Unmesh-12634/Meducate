import { motion } from 'motion/react';
import {
    Hand,
    Mic,
    Bot,
    RotateCcw,
    ZoomIn,
    ZoomOut,
    Maximize2,
    Settings2,
    BookOpen
} from 'lucide-react';

interface ControlDockProps {
    gestureEnabled: boolean;
    onToggleGesture: () => void;
    voiceEnabled: boolean;
    onToggleVoice: () => void;
    aiAssistantOpen: boolean;
    onToggleAi: () => void;
    onResetView: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onToggleGuide: () => void;
    guideOpen: boolean;
}

export function ControlDock({
    gestureEnabled,
    onToggleGesture,
    voiceEnabled,
    onToggleVoice,
    aiAssistantOpen,
    onToggleAi,
    onResetView,
    onZoomIn,
    onZoomOut,
    onToggleGuide,
    guideOpen
}: ControlDockProps) {
    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
        >
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-background/80 backdrop-blur-xl border border-border shadow-2xl">

                {/* View Controls Group */}
                <div className="flex items-center gap-1 pr-2 border-r border-border/50">
                    <DockButton onClick={onResetView} toolTip="Reset View" icon={RotateCcw} />
                    <DockButton onClick={onZoomIn} toolTip="Zoom In" icon={ZoomIn} />
                    <DockButton onClick={onZoomOut} toolTip="Zoom Out" icon={ZoomOut} />
                </div>

                {/* AI & Smart Tools Group */}
                <div className="flex items-center gap-1 px-2 border-r border-border/50">
                    <DockButton
                        onClick={onToggleAi}
                        active={aiAssistantOpen}
                        toolTip="AI Assistant"
                        icon={Bot}
                        activeColor="text-blue-500"
                    />
                    <DockButton
                        onClick={onToggleVoice}
                        active={voiceEnabled}
                        toolTip="Voice Commands"
                        icon={Mic}
                        activeColor="text-red-500"
                        animate={voiceEnabled}
                    />
                    <DockButton
                        onClick={onToggleGesture}
                        active={gestureEnabled}
                        toolTip="Hand Gestures"
                        icon={Hand}
                        activeColor="text-teal-500"
                    />
                    <DockButton
                        onClick={onToggleGuide}
                        active={guideOpen}
                        toolTip="Gesture Guide"
                        icon={BookOpen}
                        activeColor="text-teal-500"
                    />
                </div>

                {/* Layout/Settings */}
                <div className="flex items-center gap-1 pl-2">
                    <DockButton onClick={() => { }} toolTip="Settings" icon={Settings2} />
                    <DockButton onClick={() => document.documentElement.requestFullscreen()} toolTip="Fullscreen" icon={Maximize2} />
                </div>
            </div>
        </motion.div>
    );
}

function DockButton({
    onClick,
    active = false,
    toolTip,
    icon: Icon,
    activeColor = "text-primary",
    animate = false
}: {
    onClick: () => void;
    active?: boolean;
    toolTip: string;
    icon: any;
    activeColor?: string;
    animate?: boolean;
}) {
    return (
        <div className="relative group">
            <motion.button
                onClick={onClick}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-xl transition-all relative ${active
                        ? 'bg-muted shadow-inner'
                        : 'hover:bg-muted/50'
                    }`}
            >
                <Icon
                    size={20}
                    className={`transition-colors ${active ? activeColor : 'text-muted-foreground'} ${animate ? 'animate-pulse' : ''}`}
                />
                {active && (
                    <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${activeColor.replace('text-', 'bg-')}`} />
                )}
            </motion.button>

            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-border">
                {toolTip}
            </div>
        </div>
    );
}
