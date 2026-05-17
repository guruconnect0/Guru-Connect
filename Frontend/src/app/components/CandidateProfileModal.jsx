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
    ArrowRight,
    MessageSquare,
    UserCircle,
    TrendingUp,
    Code
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function CandidateProfileModal({ candidate, isOpen, onClose, onChat }) {
    const [activeTab, setActiveTab] = useState('overview');

    // Close on ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!candidate) return null;

    // Standard candidate mock data if missing
    const profile = {
        name: candidate.studentName || candidate.name,
        avatar: candidate.studentAvatar || candidate.image,
        role: 'Full Stack Developer',
        status: candidate.status || 'Active',
        joinedDate: 'Jan 2026',
        skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
        learningGoals: ['Master System Design', 'Optimize Cloud Costs', 'Lead Engineering Teams'],
        totalSessions: 12,
        ...candidate
    };

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
                        {/* Neon Accent Border (Top) - Purple for Candidate View */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

                        {/* Sticky Header */}
                        <div className="sticky top-0 z-20 px-10 pt-10 pb-8 bg-card dark:bg-black/20 backdrop-blur-xl border-b border-border dark:border-white/5">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-3xl p-1 bg-gradient-to-br from-purple-500 to-pink-500 shadow-xl shadow-purple-500/20">
                                            <div className="w-full h-full rounded-[1.25rem] overflow-hidden border-4 border-background">
                                                <ImageWithFallback src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black mb-1 flex items-center gap-4 tracking-tighter">
                                            {profile.name}
                                            <span className="text-[10px] bg-purple-500/10 text-purple-600 px-3 py-1 rounded-full uppercase tracking-widest font-black border border-purple-500/20">Active Student</span>
                                        </h2>
                                        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs mb-3">{profile.role}</p>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center text-emerald-600 font-black uppercase tracking-widest text-[10px]">
                                                <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                                                High Activity
                                            </div>
                                            <span className="w-1 h-1 rounded-full bg-border" />
                                            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{profile.totalSessions} Total Sessions</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    aria-label="Close candidate profile"
                                    className="p-3 rounded-2xl bg-muted/50 dark:bg-white/5 text-muted-foreground hover:text-primary transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none"
                                >
                                    <X className="w-7 h-7" />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Body */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-6 space-y-10 pb-32">

                            {/* Account Details */}
                            <div className="grid grid-cols-2 gap-6 p-8 rounded-[2.5rem] bg-muted/30 dark:bg-white/5 border border-transparent dark:border-white/5">
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-3">Status</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                                        <span className="text-sm font-black uppercase tracking-widest text-foreground">{profile.status}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-3">Member Since</p>
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-black uppercase tracking-widest text-foreground">{profile.joinedDate}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Learning Goals */}
                            <section>
                                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-6 flex items-center gap-3 ml-2">
                                    <Zap className="w-4 h-4 text-purple-500" />
                                    Learning Mission
                                </h3>
                                <div className="space-y-3">
                                    {profile.learningGoals.map((goal, i) => (
                                        <div key={i} className="flex items-center gap-4 p-5 rounded-[1.5rem] bg-card dark:bg-white/5 border border-border dark:border-white/10 group/item hover:border-purple-500/30 transition-all shadow-sm">
                                            <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-lg shadow-purple-500/20 group-hover/item:scale-125 transition-transform" />
                                            <span className="text-sm font-black tracking-tight text-foreground/80">{goal}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Tech Stack */}
                            <section>
                                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-6 flex items-center gap-3 ml-2">
                                    <Code className="w-4 h-4 text-emerald-500" />
                                    Tech Identity
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills.map((skill, i) => (
                                        <motion.span
                                            key={i}
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            className="px-5 py-2.5 rounded-[1.25rem] border border-border dark:border-white/5 bg-card dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:border-emerald-500/40 hover:text-emerald-600 transition-all cursor-default shadow-sm shadow-emerald-500/5"
                                        >
                                            {skill}
                                        </motion.span>
                                    ))}
                                </div>
                            </section>

                            {/* Session History (Preview) */}
                            <section>
                                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-6 flex items-center gap-3 ml-2">
                                    <Clock className="w-4 h-4 text-primary" />
                                    Platform History
                                </h3>
                                <div className="space-y-4">
                                    {[1, 2].map(i => (
                                        <div key={i} className="flex justify-between items-center p-6 rounded-3xl bg-muted/30 dark:bg-white/5 border border-transparent dark:border-white/5 hover:border-primary/20 transition-all group/hist">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-card dark:bg-white/5 shadow-sm flex items-center justify-center text-muted-foreground group-hover/hist:text-primary transition-colors">
                                                    <Video className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black tracking-tight mb-1">System Design Architecture</p>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Feb 0{i}, 2026 • 60 min session</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-[10px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-500/20">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Finished
                                            </div>
                                        </div>
                                    ))}
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
                                    onClick={() => onChat(profile)}
                                    className="flex-[2] h-16 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 group/btn"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                    Direct Message
                                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    className="flex-1 h-16 rounded-2xl bg-muted/50 dark:bg-white/5 border border-border dark:border-white/10 hover:border-primary/20 text-foreground font-black uppercase tracking-widest transition-all text-[10px]"
                                >
                                    Full File
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
