import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Calendar,
    Clock,
    Video,
    Star,
    MessageSquare,
    ExternalLink,
    ChevronRight,
    TrendingUp,
    Award,
    Users,
    Search,
    X,
    Sparkles
} from 'lucide-react';
import { mentors, MentorCard } from './MentorShowcase';

const mockSessions = [
    {
        id: 1,
        mentorName: 'Sarah Jenkins',
        mentorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
        date: 'Feb 12, 2026',
        time: '4:00 PM - 5:00 PM',
        status: 'Confirmed',
        type: 'Paid',
    },
    {
        id: 2,
        mentorName: 'David Chen',
        mentorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
        date: 'Feb 07, 2026',
        time: '11:00 AM - 11:30 AM',
        status: 'In-progress',
        type: 'Demo',
    },
    {
        id: 3,
        mentorName: 'Elena Rodriguez',
        mentorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
        date: 'Feb 10, 2026',
        time: '2:00 PM - 3:00 PM',
        status: 'Pending',
        type: 'Paid',
    },
    {
        id: 4,
        mentorName: 'Marcus Thorne',
        mentorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
        date: 'Jan 28, 2026',
        time: '3:00 PM - 4:00 PM',
        status: 'Completed',
        type: 'Paid',
    },
    {
        id: 5,
        mentorName: 'Aisha Khan',
        mentorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
        date: 'Jan 15, 2026',
        time: '10:00 AM - 11:00 AM',
        status: 'Cancelled',
        type: 'Demo',
    }
];

export function CandidateDashboard({ onMentorClick }) {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [searchQuery, setSearchQuery] = useState('');
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const particles = [];
        for (let i = 0; i < 40; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2 + 1,
            });
        }

        let animationId;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 212, 255, 0.2)';
                ctx.fill();

                particles.slice(i + 1).forEach(other => {
                    const dx = p.x - other.x;
                    const dy = p.y - other.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 * (1 - dist / 100)})`;
                        ctx.stroke();
                    }
                });
            });
            animationId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationId);
        };
    }, []);

    const filteredSessions = mockSessions.filter(session => {
        if (activeTab === 'upcoming') {
            return ['Confirmed', 'In-progress', 'Pending'].includes(session.status);
        }
        if (activeTab === 'completed') {
            return session.status === 'Completed';
        }
        if (activeTab === 'cancelled') {
            return session.status === 'Cancelled';
        }
        return false;
    });

    const filteredMentors = mentors.filter(mentor =>
        searchQuery === '' ||
        mentor.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="pt-24 pb-20 px-6 min-h-screen bg-background transition-colors duration-300">
            <div className="max-w-7xl mx-auto">

                {/* Page Header */}
                <section className="relative rounded-[2.5rem] overflow-hidden p-10 md:p-14 mb-12 border border-border dark:border-white/10 shadow-xl dark:shadow-none bg-card dark:transparent">
                    <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-[var(--cyan)]/10 dark:from-[var(--electric-blue)]/10 dark:to-[var(--cyan)]/10 z-0" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative z-10"
                    >
                        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-foreground">
                            {activeTab === 'discovery' ? 'Explore Mentors' : 'My Sessions'}
                        </h1>
                        <p className="text-muted-foreground text-xl max-w-2xl font-medium leading-relaxed">
                            {activeTab === 'discovery'
                                ? 'Find the perfect industry expert to guide your professional growth.'
                                : 'Track and manage your mentorship journey. Stay on top of your upcoming sessions.'}
                        </p>
                    </motion.div>
                </section>

                {/* Tabs Navigation */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex p-2 bg-muted/50 dark:bg-white/5 backdrop-blur-xl border border-border dark:border-white/10 rounded-[1.5rem] relative shadow-inner">
                        {['upcoming', 'completed', 'cancelled', 'discovery'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300 z-10 ${activeTab === tab ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary dark:bg-gradient-to-r dark:from-[var(--electric-blue)] dark:to-[var(--cyan)] rounded-2xl -z-10 shadow-lg shadow-primary/20 dark:shadow-[var(--electric-blue)]/20"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                {tab === 'discovery' ? 'Explore' : tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search Bar (Only for discovery tab) */}
                {activeTab === 'discovery' && (
                    <div className="max-w-2xl mx-auto relative mb-20 px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative group h-16"
                        >
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                <Search className="w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search mentors by skill (e.g. React, Python...)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-full pl-16 pr-14 rounded-2xl bg-card dark:bg-white/5 border-2 border-border dark:border-white/10 focus:border-primary/50 focus:bg-background outline-none transition-all text-lg font-bold placeholder:text-muted-foreground/30 shadow-lg dark:shadow-none"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute inset-y-0 right-6 flex items-center"
                                >
                                    <X className="w-6 h-6 text-muted-foreground hover:text-rose-500 transition-colors" />
                                </button>
                            )}
                        </motion.div>

                        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                            <span className="text-[10px] text-muted-foreground mr-2 font-black uppercase tracking-[0.2em]">Popular:</span>
                            {['React', 'Figma', 'Python', 'AWS', 'System Design'].map(skill => (
                                <button
                                    key={skill}
                                    onClick={() => setSearchQuery(skill)}
                                    className="px-4 py-1.5 rounded-xl bg-muted/40 dark:bg-white/5 hover:bg-primary/10 border border-border dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all"
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Content Container */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {activeTab === 'discovery' ? (
                            filteredMentors.length > 0 ? (
                                filteredMentors.map((mentor, index) => (
                                    <MentorCard
                                        key={mentor.name}
                                        mentor={mentor}
                                        index={index}
                                        onBookDemo={() => { }}
                                        onClick={() => onMentorClick?.(mentor)}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full py-24 flex flex-col items-center text-center">
                                    <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center mb-8 border border-primary/20">
                                        <Sparkles className="w-10 h-10 text-primary" />
                                    </div>
                                    <h3 className="text-3xl font-black mb-3 tracking-tighter">No mentors found</h3>
                                    <p className="text-muted-foreground text-lg mb-8 max-w-md font-medium">
                                        We couldn't find any mentors with the skill "{searchQuery}".
                                    </p>
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                                    >
                                        Clear search
                                    </button>
                                </div>
                            )
                        ) : filteredSessions.length > 0 ? (
                            filteredSessions.map((session) => (
                                <SessionCard
                                    key={session.id}
                                    session={session}
                                    onMentorClick={() => {
                                        const mentor = mentors.find(m => m.name === session.mentorName);
                                        if (mentor) onMentorClick?.(mentor);
                                    }}
                                    onJoinSession={() => {
                                        // This will be handled by App.jsx
                                        window.dispatchEvent(new CustomEvent('joinSession', {
                                            detail: {
                                                mentor: mentors.find(m => m.name === session.mentorName),
                                                session
                                            }
                                        }));
                                    }}
                                />
                            ))
                        ) : (
                            <EmptyState onExplore={() => setActiveTab('discovery')} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

function SessionCard({ session, onMentorClick, onJoinSession }) {
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20';
            case 'Confirmed':
                return 'bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20';
            case 'In-progress':
                return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-500/20 animate-pulse-subtle';
            case 'Completed':
                return 'bg-emerald-500/5 text-emerald-600 dark:text-emerald-500 border-emerald-500/10';
            case 'Cancelled':
                return 'bg-rose-500/10 text-rose-600 dark:text-rose-500 border-rose-500/20';
            default:
                return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-500 border-zinc-500/20';
        }
    };

    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="group relative p-8 rounded-[2.5rem] border border-border dark:border-white/10 bg-card dark:bg-white/5 shadow-lg dark:shadow-none overflow-hidden transition-all hover:shadow-xl hover:border-primary/20"
        >
            {/* Top Section: Avatar & Status */}
            <div className="flex items-start justify-between mb-8">
                <div className="relative">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-background shadow-lg rotate-3 group-hover:rotate-0 transition-all">
                        <img src={session.mentorAvatar} alt={session.mentorName} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-card border border-border shadow-md flex items-center justify-center">
                        {session.type === 'Demo' ? (
                            <Video className="w-4 h-4 text-primary" />
                        ) : (
                            <Award className="w-4 h-4 text-[var(--cyan)]" />
                        )}
                    </div>
                </div>

                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(session.status)}`}>
                    {session.status}
                </div>
            </div>

            {/* Info Section */}
            <div className="mb-8 cursor-pointer" onClick={onMentorClick}>
                <h3 className="text-2xl font-black mb-2 group-hover:text-primary transition-colors tracking-tighter">
                    {session.mentorName}
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-muted-foreground font-bold text-sm">
                        <Calendar className="w-5 h-5 text-primary" />
                        {session.date}
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground font-bold text-sm">
                        <Clock className="w-5 h-5 text-primary" />
                        {session.time}
                    </div>
                </div>
            </div>

            {/* Context-Based Action Buttons */}
            <div className="flex flex-col gap-3">
                {session.status === 'In-progress' && (
                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onJoinSession}
                        className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
                    >
                        <Video className="w-5 h-5" />
                        Join Session
                    </motion.button>
                )}

                {session.status === 'Completed' && session.type === 'Demo' && (
                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full h-14 rounded-2xl border-2 border-border hover:border-primary text-foreground font-black uppercase tracking-widest flex items-center justify-center gap-3 group/btn transition-all"
                    >
                        Continue Journey
                        <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </motion.button>
                )}

                {session.status === 'Completed' && session.type === 'Paid' && (
                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full h-14 rounded-2xl bg-muted/50 hover:bg-muted border border-border text-foreground font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
                    >
                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                        Submit Review
                    </motion.button>
                )}

                {['Confirmed', 'Pending'].includes(session.status) && (
                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 h-14 rounded-2xl bg-muted/50 hover:bg-muted border border-border text-foreground font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all group/chat"
                        >
                            <MessageSquare className="w-5 h-5 group-hover/chat:text-primary transition-colors" />
                            Chat
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-14 h-14 rounded-2xl bg-muted/50 hover:bg-muted border border-border text-foreground transition-all flex items-center justify-center"
                        >
                            <ExternalLink className="w-6 h-6 text-muted-foreground" />
                        </motion.button>
                    </div>
                )}
            </div>

            <style>{`
        .animate-pulse-subtle {
          animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
        </motion.div>
    );
}

function EmptyState({ onExplore }) {
    return (
        <div className="col-span-full py-24 flex flex-col items-center text-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 rounded-[2rem] bg-card border border-border shadow-xl flex items-center justify-center mb-8 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                <Calendar className="w-12 h-12 text-primary/40" />
            </motion.div>
            <h3 className="text-3xl font-black mb-3 tracking-tighter">No sessions yet</h3>
            <p className="text-muted-foreground text-lg mb-10 max-w-sm font-medium leading-relaxed">
                Start your learning journey by booking a session with one of our industry experts.
            </p>
            <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onExplore}
                className="px-10 py-4 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30"
            >
                Explore Mentors
            </motion.button>
        </div>
    );
}
