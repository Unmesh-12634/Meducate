import { motion, AnimatePresence } from 'motion/react';
import {
    ChevronLeft,
    ChevronRight,
    Search,
    Activity,
    Heart,
    Brain,
    Wind,
    Database,
    Utensils
} from 'lucide-react';

interface SimulatorSidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    selectedOrgan: string;
    onSelectOrgan: (id: string) => void;
    organs: { id: string; name: string; category: string }[];
}

const CATEGORY_ICONS: Record<string, any> = {
    'Cardiovascular': Heart,
    'Nervous': Brain,
    'Respiratory': Wind,
    'Digestive': Utensils,
    'Urinary': Database, // Abstract
    'General': Activity
};

export function SimulatorSidebar({
    isOpen,
    onToggle,
    selectedOrgan,
    onSelectOrgan,
    organs
}: SimulatorSidebarProps) {
    return (
        <>
            {/* Toggle Button (Visible when closed) */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onClick={onToggle}
                        className="fixed left-4 top-24 z-30 p-2 rounded-xl bg-background/80 backdrop-blur border border-border hover:bg-muted transition-colors shadow-lg"
                    >
                        <ChevronRight size={20} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Sidebar Panel */}
            <motion.aside
                initial={{ x: -320 }}
                animate={{ x: isOpen ? 0 : -320 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 bottom-0 w-80 bg-background/95 backdrop-blur-xl border-r border-border z-40 flex flex-col shadow-2xl"
            >
                {/* Header */}
                <div className="p-6 border-b border-border">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                                <Activity className="text-white" size={20} />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg leading-tight">Meducate<br /><span className="text-teal-500">3D Lab</span></h1>
                            </div>
                        </div>
                        <button
                            onClick={onToggle}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                            <ChevronLeft size={20} className="text-muted-foreground" />
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input
                            type="text"
                            placeholder="Search anatomy..."
                            className="w-full pl-10 pr-4 py-2 bg-muted/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all font-medium placeholder:text-muted-foreground/70"
                        />
                    </div>
                </div>

                {/* Categories & Organs */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* General */}
                    <div className="space-y-2">
                        <p className="px-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">System View</p>
                        {organs.filter(o => o.category === 'General').map(organ => (
                            <OrganButton
                                key={organ.id}
                                organ={organ}
                                isSelected={selectedOrgan === organ.id}
                                onClick={() => onSelectOrgan(organ.id)}
                            />
                        ))}
                    </div>

                    {/* Organs by Category */}
                    {Object.entries(groupBy(organs.filter(o => o.category !== 'General'), 'category')).map(([category, items]) => (
                        <div key={category} className="space-y-2">
                            <p className="px-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">{category}</p>
                            {items.map(organ => (
                                <OrganButton
                                    key={organ.id}
                                    organ={organ}
                                    isSelected={selectedOrgan === organ.id}
                                    onClick={() => onSelectOrgan(organ.id)}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Footer Stats */}
                <div className="p-4 border-t border-border bg-muted/10">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Ver 2.4.0 (Hackathon Build)</span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Online
                        </span>
                    </div>
                </div>
            </motion.aside>
        </>
    );
}

function OrganButton({ organ, isSelected, onClick }: { organ: any, isSelected: boolean, onClick: () => void }) {
    const Icon = CATEGORY_ICONS[organ.category] || Activity;

    return (
        <motion.button
            onClick={onClick}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border ${isSelected
                    ? 'bg-teal-500/10 border-teal-500/50 text-teal-600 shadow-sm'
                    : 'hover:bg-muted border-transparent text-muted-foreground hover:text-foreground'
                }`}
        >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isSelected ? 'bg-teal-500 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                <Icon size={16} />
            </div>
            <div className="flex flex-col items-start">
                <span className={`text-sm font-semibold ${isSelected ? 'text-teal-700 dark:text-teal-400' : ''}`}>{organ.name}</span>
                {isSelected && <span className="text-[10px] opacity-70">Active Model</span>}
            </div>
            {isSelected && (
                <motion.div layoutId="active-indicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-500" />
            )}
        </motion.button>
    );
}

// Helper
function groupBy(array: any[], key: string) {
    return array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
        return result;
    }, {});
}
