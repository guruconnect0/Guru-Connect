import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    X,
    Star,
    ShieldCheck,
    Clock,
    Zap,
    Award,
    BookOpen,
    Globe,
    Video,
    Calendar,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    Info,
    ArrowRight
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function MentorProfileModal({ mentor, isOpen, onClose, onBookDemo, onBookPaid }) {
    const [isBioExpanded, setIsBioExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    // Close on ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!mentor) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative w-full max-w-2xl max-h-[90vh] bg-card dark:bg-[#0A0A0B] border border-border dark:border-white/10 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden group"
                    >
                        {/* Neon Accent Border (Top) */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

                        {/* Sticky Header */}
                        <div className="sticky top-0 z-20 px-10 pt-10 pb-8 bg-card dark:bg-black/20 backdrop-blur-xl border-b border-border dark:border-white/5">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-3xl p-1 bg-gradient-to-br from-primary to-[var(--cyan)] shadow-xl shadow-primary/20">
                                            <div className="w-full h-full rounded-[1.25rem] overflow-hidden border-4 border-background">
                                                <ImageWithFallback src={mentor.image} alt={mentor.name} className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        {mentor.isVerified && (
                                            <div className="absolute -bottom-2 -right-2 bg-background rounded-xl p-1.5 border-2 border-border shadow-lg">
                                                <ShieldCheck className="w-6 h-6 text-primary fill-primary/10" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black mb-1 flex items-center gap-4 tracking-tighter">
                                            {mentor.name}
                                            <span className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest font-black border border-primary/20">Elite Mentor</span>
                                        </h2>
                                        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs mb-3">{mentor.title}</p>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center text-amber-500 font-black uppercase tracking-widest text-[10px]">
                                                <Star className="w-3.5 h-3.5 fill-amber-500 mr-1.5" />
                                                {mentor.rating || 4.9} Rating
                                            </div>
                                            <span className="w-1 h-1 rounded-full bg-border" />
                                            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{mentor.sessions || 120}+ Done</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    aria-label="Close mentor profile"
                                    className="p-3 rounded-2xl bg-muted/50 dark:bg-white/5 text-muted-foreground hover:text-primary transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none"
                                >
                                    <X className="w-7 h-7" />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Body */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-6 space-y-10 pb-32">

                            {/* Professional Summary */}
                            <section>
                                <div className="flex items-center justify-between mb-6 ml-2">
                                    <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Story & Philosophy</h3>
                                    {!isBioExpanded && (
                                        <button
                                            onClick={() => setIsBioExpanded(true)}
                                            className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline"
                                        >
                                            Read More
                                        </button>
                                    )}
                                </div>
                                <div className={`relative p-8 rounded-[2rem] bg-muted/30 dark:bg-white/5 border border-transparent dark:border-white/5 transition-all duration-500 overflow-hidden ${isBioExpanded ? 'max-h-[1000px]' : 'max-h-[100px]'}`}>
                                    <p className="text-base text-foreground font-medium leading-relaxed italic">
                                        "{mentor.bio || "I help developers scale their careers and master modern system architectures..."}"
                                    </p>
                                    {!isBioExpanded && (
                                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-muted/30 dark:from-background via-muted/30 dark:via-background/0 to-transparent" />
                                    )}
                                </div>
                            </section>

                            {/* Skills Tag Cloud */}
                            <section>
                                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-6 ml-2">Core Arsenal</h3>
                                <div className="flex flex-wrap gap-2">
                                    {(mentor.skills || ['React', 'System Design', 'Node.js', 'Next.js', 'Typescript']).map((skill, i) => (
                                        <motion.span
                                            key={i}
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            className="px-5 py-2.5 rounded-[1.25rem] border border-border dark:border-white/5 bg-card dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:border-primary/40 hover:text-primary transition-all cursor-default shadow-sm"
                                        >
                                            {skill}
                                        </motion.span>
                                    ))}
                                </div>
                            </section>

                            {/* Credentials Grid */}
                            <div className="grid grid-cols-2 gap-6">
                                <section>
                                    <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-6 ml-2">Pedigree</h3>
                                    <div className="flex items-center gap-4 p-5 rounded-[1.5rem] bg-muted/30 dark:bg-white/5 border border-transparent dark:border-white/5">
                                        <div className="w-12 h-12 rounded-2xl bg-card dark:bg-white/5 shadow-sm flex items-center justify-center text-purple-500">
                                            <Award className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black tracking-tight">{mentor.experience || '8+ Years'}</p>
                                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Mastery</p>
                                        </div>
                                    </div>
                                </section>
                                <section>
                                    <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-6 ml-2">Communication</h3>
                                    <div className="flex items-center gap-4 p-5 rounded-[1.5rem] bg-muted/30 dark:bg-white/5 border border-transparent dark:border-white/5">
                                        <div className="w-12 h-12 rounded-2xl bg-card dark:bg-white/5 shadow-sm flex items-center justify-center text-emerald-500">
                                            <Globe className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black tracking-tight">{(mentor.languages || ['English', 'Spanish'])[0]}</p>
                                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Primary</p>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Session Details */}
                            <section className="p-8 rounded-[2.5rem] bg-muted/30 dark:bg-white/5 border border-transparent dark:border-white/5">
                                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-8 flex items-center gap-3 ml-2">
                                    <Zap className="w-4 h-4 text-primary" />
                                    Investment
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-6 rounded-[2rem] bg-card dark:bg-white/5 border border-border dark:border-white/10 group/pack hover:border-emerald-500/30 transition-all shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                                <Video className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black tracking-tight">Strategy Intro</p>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">15 min • Video Orientation</p>
                                            </div>
                                        </div>
                                        <span className="text-emerald-600 font-black tracking-tighter text-xl">FREE</span>
                                    </div>
                                    <div className="flex items-center justify-between p-6 rounded-[2rem] bg-card dark:bg-white/5 border border-border dark:border-white/10 group/pack hover:border-primary/30 transition-all shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                                <Award className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black tracking-tight">Deep-Dive Coaching</p>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">60 min • Strategic Roadmap</p>
                                            </div>
                                        </div>
                                        <span className="text-foreground font-black tracking-tighter text-xl">${mentor.rate || 80}/hr</span>
                                    </div>
                                </div>
                            </section>

                            {/* Availability Preview */}
                            <section>
                                <div className="flex items-center justify-between mb-8 ml-2">
                                    <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Fresh Slots</h3>
                                    <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
                                        Today
                                    </div>
                                </div>
                                <div className="flex gap-3 mb-8">
                                    {['Mon', 'Wed', 'Fri'].map(day => (
                                        <div key={day} className="px-6 py-3 rounded-2xl bg-muted/50 dark:bg-white/5 border border-transparent dark:border-white/5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                            {day}
                                        </div>
                                    ))}
                                </div>
                                <div className="p-6 rounded-[1.5rem] bg-primary/5 border border-primary/10 flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-background shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                    <p className="text-[10px] text-primary/80 font-black uppercase tracking-widest leading-relaxed">
                                        Timezone: {mentor.timezone || 'UST (GMT +5:30)'}. Live slots synced with booking flow.
                                    </p>
                                </div>
                            </section>
                        </div>

                        {/* Fixed Footer */}
                        <div className="absolute bottom-0 left-0 right-0 p-10 pt-0 pointer-events-none">
                            <div className="bg-gradient-to-t from-card via-card to-transparent h-24 pointer-events-none" />
                            <div className="bg-card/90 dark:bg-black/80 backdrop-blur-xl border border-border dark:border-white/10 rounded-[2.5rem] p-5 flex gap-4 pointer-events-auto shadow-2xl">
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => onBookDemo(mentor)}
                                    className="flex-[2] h-16 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 group/btn"
                                >
                                    Book Free Demo
                                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => onBookPaid(mentor)}
                                    className="flex-1 h-16 rounded-2xl bg-muted/50 dark:bg-white/5 border border-border dark:border-white/10 hover:border-primary/20 text-foreground font-black uppercase tracking-widest transition-all text-[10px]"
                                >
                                    Full Session
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.1);
                }
            `}</style>
        </AnimatePresence>
    );
}
