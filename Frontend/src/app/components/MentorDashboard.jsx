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
    Sparkles,
    DollarSign,
    BookOpen
} from 'lucide-react';

const mockStudents = [
    {
        id: 1,
        studentName: 'Alex Rivera',
        studentAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop',
        date: 'Feb 12, 2026',
        time: '4:00 PM - 5:00 PM',
        status: 'Confirmed',
        topic: 'React Performance Optimization',
    },
    {
        id: 2,
        studentName: 'Maya Patel',
        studentAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
        date: 'Feb 13, 2026',
        time: '11:00 AM - 11:30 AM',
        status: 'Pending',
        topic: 'System Design Interview Prep',
    },
    {
        id: 3,
        studentName: 'James Wilson',
        studentAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
        date: 'Feb 10, 2026',
        time: '2:00 PM - 3:00 PM',
        status: 'Completed',
        topic: 'Backend Architecture',
    }
];

export function MentorDashboard({ onStudentClick }) {
    const [activeTab, setActiveTab] = useState('upcoming');
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
                ctx.fillStyle = 'rgba(255, 0, 212, 0.2)'; // Pinkish for mentors
                ctx.fill();

                particles.slice(i + 1).forEach(other => {
                    const dx = p.x - other.x;
                    const dy = p.y - other.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.strokeStyle = `rgba(255, 0, 212, ${0.1 * (1 - dist / 100)})`;
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

    const filteredSessions = mockStudents.filter(session => {
        if (activeTab === 'upcoming') {
            return ['Confirmed', 'Pending'].includes(session.status);
        }
        if (activeTab === 'completed') {
            return session.status === 'Completed';
        }
        return false;
    });

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
                            Mentor Dashboard
                        </h1>
                        <p className="text-muted-foreground text-xl max-w-2xl font-medium leading-relaxed">
                            Empower students and manage your mentoring sessions efficiently.
                        </p>
                    </motion.div>
                </section>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {[
                        { label: 'Total Earnings', value: '$2,450', icon: DollarSign, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
                        { label: 'Sessions Completed', value: '48', icon: BookOpen, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10' },
                        { label: 'Student Rating', value: '4.9/5', icon: Star, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 rounded-[2rem] bg-card dark:bg-white/5 border border-border dark:border-white/10 shadow-lg dark:shadow-none hover:shadow-xl transition-all group"
                        >
                            <div className="flex items-center gap-6">
                                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                                    <p className="text-3xl font-black text-foreground">{stat.value}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Tabs Navigation */}
                <div className="flex justify-center mb-16">
                    <div className="inline-flex p-2 bg-muted/50 dark:bg-white/5 backdrop-blur-xl border border-border dark:border-white/10 rounded-[1.5rem] relative shadow-inner">
                        {['upcoming', 'completed', 'students'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300 z-10 ${activeTab === tab ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTabMentor"
                                        className="absolute inset-0 bg-primary dark:bg-gradient-to-r dark:from-[var(--electric-blue)] dark:to-[var(--cyan)] rounded-2xl -z-10 shadow-lg shadow-primary/20 dark:shadow-[var(--electric-blue)]/20"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

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
                        {filteredSessions.length > 0 ? (
                            filteredSessions.map((session) => (
                                <StudentSessionCard
                                    key={session.id}
                                    session={session}
                                    onStudentClick={() => onStudentClick?.(session)}
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-24 flex flex-col items-center text-center">
                                <div className="w-20 h-20 rounded-[2rem] bg-muted/50 dark:bg-white/5 flex items-center justify-center mb-8 border border-border dark:border-white/5">
                                    <Calendar className="w-10 h-10 text-muted-foreground/30" />
                                </div>
                                <h3 className="text-3xl font-black mb-3 tracking-tighter">No sessions found</h3>
                                <p className="text-muted-foreground text-lg font-medium">Your schedule is currently clear.</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

function StudentSessionCard({ session, onStudentClick }) {
    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="group relative p-8 rounded-[2.5rem] border border-border dark:border-white/10 bg-card dark:bg-white/5 shadow-lg dark:shadow-none overflow-hidden transition-all hover:shadow-xl hover:border-primary/20"
        >
            <div className="flex items-start justify-between mb-8">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-background shadow-lg rotate-3 group-hover:rotate-0 transition-all">
                    <img src={session.studentAvatar} alt={session.studentName} className="w-full h-full object-cover" />
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${session.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-500/20' :
                    session.status === 'Pending' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20' :
                        'bg-zinc-500/10 text-zinc-600 dark:text-zinc-500 border-zinc-500/20'
                    }`}>
                    {session.status}
                </div>
            </div>

            <div className="mb-8 cursor-pointer" onClick={onStudentClick}>
                <h3 className="text-2xl font-black mb-2 group-hover:text-primary transition-colors tracking-tighter">
                    {session.studentName}
                </h3>
                <p className="text-sm font-bold text-muted-foreground mb-6 uppercase tracking-tight">{session.topic}</p>
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

            <div className="flex gap-3">
                <button className="flex-1 h-14 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:shadow-xl hover:translate-y-[-2px] transition-all">
                    <Video className="w-5 h-5" />
                    Join
                </button>
                <button className="w-14 h-14 rounded-2xl bg-muted/50 dark:bg-white/5 hover:bg-muted dark:hover:bg-white/10 border border-border dark:border-white/10 transition-all flex items-center justify-center group/msg">
                    <MessageSquare className="w-6 h-6 text-muted-foreground group-hover/msg:text-primary group-hover/msg:scale-110 transition-all" />
                </button>
            </div>
        </motion.div>
    );
}
