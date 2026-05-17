import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    User,
    Mail,
    Phone as PhoneIcon,
    Globe,
    Calendar,
    CheckCircle2,
    Clock,
    Zap,
    ShieldCheck,
    Edit3,
    Save,
    X,
    Search,
    BookOpen,
    TrendingUp,
    Video,
    MessageSquare,
    Lock,
    AlertCircle,
    Info,
    BarChart3,
    Heart,
    DollarSign,
    Ban
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function CandidateProfile({ user, onBack }) {
    const [isEditing, setIsEditing] = useState(false);

    const initialData = user || {
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com', // Read-only
        phone: '+1 (555) 987-6543',
        timezone: 'UST (GMT +5:30)',
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop',
        role: 'Candidate', // Read-only
        accountStatus: 'Active',
        joinedDate: 'Feb 2024',
        lastLogin: 'Today, 10:45 AM',
        interestedSkills: ['Frontend Development', 'UI/UX Design', 'Product Management'],
        learningGoals: 'I want to master React performance optimization and build a strong portfolio for senior-level interviews.',
        preferredSessionType: ['Demo', 'Paid'],
        stats: {
            totalBooked: 24,
            completed: 21,
            noShow: 1,
            totalSpent: 450,
            avgDuration: '45 min'
        }
    };

    const [profileData, setProfileData] = useState(initialData);

    const handleSave = () => {
        setIsEditing(false);
        // API call would happen here
    };

    const handleCancel = () => {
        setProfileData(initialData);
        setIsEditing(false);
    };

    const stats = [
        { label: 'Total Booked', value: profileData.stats.totalBooked, icon: Calendar, color: 'text-[var(--electric-blue)]' },
        { label: 'Completed', value: profileData.stats.completed, icon: CheckCircle2, color: 'text-emerald-500' },
        { label: 'No-Shows', value: profileData.stats.noShow, icon: X, color: 'text-rose-500' },
        { label: 'Avg Duration', value: profileData.stats.avgDuration, icon: Clock, color: 'text-amber-500' }
    ];

    const learningStats = [
        { label: 'Total Spent', value: `$${profileData.stats.totalSpent}`, icon: DollarSign },
        { label: 'Learning Since', value: profileData.joinedDate, icon: TrendingUp },
        { label: 'Favorite Mentors', value: '5', icon: Heart },
        { label: 'Last Active', value: '2 hours ago', icon: Zap }
    ];

    return (
        <div className="pt-24 pb-20 px-6 min-h-screen bg-background overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-foreground/60 hover:text-[var(--electric-blue)] transition-colors group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </button>

                    <div className="flex gap-4">
                        {!isEditing ? (
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-card dark:bg-white/5 border border-border dark:border-white/10 hover:border-primary/50 text-foreground shadow-lg dark:shadow-none transition-all font-black uppercase tracking-widest text-xs"
                            >
                                <Edit3 className="w-4 h-4 text-primary" />
                                Edit Profile
                            </motion.button>
                        ) : (
                            <>
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-muted/50 dark:bg-white/5 border border-border dark:border-white/10 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-all font-black uppercase tracking-widest text-xs"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20 text-xs"
                                >
                                    <Save className="w-4 h-4" />
                                    Save
                                </motion.button>
                            </>
                        )}
                    </div>
                </div>

                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-4 rounded-2xl bg-[var(--electric-blue)]/10 border border-[var(--electric-blue)]/20 flex items-center gap-3 text-sm text-[var(--electric-blue)]"
                    >
                        <Info className="w-5 h-5" />
                        <span>You are in Edit Mode. Critical fields like Email, Role, and Session History are locked.</span>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Column: Personal Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative p-10 rounded-[2.5rem] border border-border dark:border-white/10 bg-card dark:transparent shadow-2xl dark:shadow-none text-center overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-[var(--cyan)]/5 pointer-events-none" />

                            <div className="relative inline-block mb-8 pt-4">
                                <div className="w-36 h-36 rounded-3xl p-1 bg-gradient-to-br from-primary to-[var(--cyan)] shadow-xl shadow-primary/20">
                                    <div className="w-full h-full rounded-[1.25rem] overflow-hidden border-4 border-background">
                                        <ImageWithFallback src={profileData.image} alt={profileData.name} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                {isEditing && (
                                    <button className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-xl p-3 border-4 border-background shadow-xl hover:scale-110 transition-transform">
                                        <Edit3 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            {isEditing ? (
                                <div className="space-y-6 mb-8 relative z-10">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] text-muted-foreground text-left ml-2 font-black uppercase tracking-[0.2em]">Full Name</label>
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            className="w-full bg-muted/50 dark:bg-white/5 border-2 border-transparent focus:border-primary/50 focus:bg-background rounded-2xl px-6 h-14 text-center font-bold outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] text-muted-foreground text-left ml-2 font-black uppercase tracking-[0.2em]">Phone</label>
                                        <input
                                            type="text"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            className="w-full bg-muted/50 dark:bg-white/5 border-2 border-transparent focus:border-primary/50 focus:bg-background rounded-2xl px-6 h-14 text-center font-bold outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="relative z-10">
                                    <h1 className="text-4xl font-black mb-2 tracking-tighter">{profileData.name}</h1>
                                    <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px] mb-10 flex items-center justify-center gap-3">
                                        <Mail className="w-4 h-4 text-primary" />
                                        {profileData.email}
                                    </p>
                                </div>
                            )}

                            <div className="p-6 rounded-3xl bg-muted/30 dark:bg-white/5 border border-border dark:border-white/10 text-left space-y-4 relative z-10">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Role</span>
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                                        <Lock className="w-3 h-3" />
                                        {profileData.role}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</span>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${profileData.accountStatus === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                                        {profileData.accountStatus}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Member Since</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{profileData.joinedDate}</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="p-10 rounded-[2.5rem] border border-border dark:border-white/10 bg-card dark:transparent shadow-2xl dark:shadow-none"
                        >
                            <h3 className="text-2xl font-black mb-8 tracking-tighter flex items-center gap-3">
                                <BarChart3 className="w-6 h-6 text-primary" />
                                Quick Links
                            </h3>
                            <div className="space-y-4">
                                {learningStats.map((stat, i) => (
                                    <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-muted/30 dark:bg-white/5 border border-transparent dark:border-white/5 hover:border-primary/20 transition-colors group cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-background shadow-sm flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                                                <stat.icon className="w-5 h-5" />
                                            </div>
                                            <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">{stat.label}</span>
                                        </div>
                                        <span className="font-black text-foreground">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Learning & Activity */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Status Guard Notification */}
                        {profileData.accountStatus !== 'Active' && (
                            <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-4 text-rose-500">
                                <AlertCircle className="w-8 h-8 flex-shrink-0" />
                                <div>
                                    <p className="font-bold">Your account is currently suspended.</p>
                                    <p className="text-sm opacity-80">Booking new sessions and joining active calls is disabled. Please contact support.</p>
                                </div>
                            </div>
                        )}

                        {/* Summary Stats */}
                        <section>
                            <h2 className="text-3xl font-black mb-8 flex items-center gap-3 tracking-tighter">
                                <TrendingUp className="w-7 h-7 text-emerald-500" />
                                Growth Overview
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {stats.map((stat, i) => (
                                    <div key={i} className="p-8 rounded-[2.5rem] border border-border dark:border-white/10 bg-card dark:bg-white/5 text-center shadow-lg dark:shadow-none transition-all hover:shadow-xl hover:border-primary/20 group">
                                        <div className={`w-12 h-12 mx-auto mb-4 rounded-2xl bg-muted/50 dark:bg-white/5 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform shadow-sm`}>
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                        <p className="text-3xl font-black mb-1 tracking-tighter">{stat.value}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Learning & Preferences */}
                        <section>
                            <h2 className="text-3xl font-black mb-8 flex items-center gap-3 tracking-tighter">
                                <BookOpen className="w-7 h-7 text-primary" />
                                Learning Identity
                            </h2>
                            <div className="space-y-8">
                                <div className="p-10 rounded-[2.5rem] border border-border dark:border-white/10 bg-card dark:transparent shadow-xl dark:shadow-none">
                                    <div className="space-y-10">
                                        <div>
                                            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 ml-2">Learning Mission</label>
                                            {isEditing ? (
                                                <textarea
                                                    value={profileData.learningGoals}
                                                    onChange={(e) => setProfileData({ ...profileData, learningGoals: e.target.value })}
                                                    className="w-full h-40 bg-muted/50 dark:bg-white/5 border-2 border-transparent focus:border-primary/50 focus:bg-background rounded-2xl px-6 py-6 font-bold outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground/30"
                                                />
                                            ) : (
                                                <div className="p-8 rounded-2xl bg-muted/30 dark:bg-white/5 border border-transparent dark:border-white/5 relative">
                                                    <span className="absolute -top-3 -left-2 text-6xl text-primary/10 font-serif leading-none">“</span>
                                                    <p className="text-xl text-foreground font-medium leading-relaxed italic relative z-10">
                                                        {profileData.learningGoals}
                                                    </p>
                                                    <span className="absolute -bottom-8 -right-2 text-6xl text-primary/10 font-serif leading-none rotate-180">“</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <div>
                                                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6 ml-2">Interested Domains</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {profileData.interestedSkills.map((skill, i) => (
                                                        <div key={i} className="px-5 py-2.5 rounded-xl bg-primary/5 border border-primary/10 text-[10px] text-primary font-black uppercase tracking-widest flex items-center gap-3">
                                                            {skill}
                                                            {isEditing && (
                                                                <button onClick={() => setProfileData({ ...profileData, interestedSkills: profileData.interestedSkills.filter((_, idx) => idx !== i) })} className="hover:text-rose-500 transition-colors">
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {isEditing && (
                                                        <button className="px-5 py-2.5 rounded-xl border-2 border-dashed border-border text-[10px] text-muted-foreground font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all">
                                                            + Add Domain
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6 ml-2">Session Preferences</label>
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 dark:bg-emerald-500/5 border border-transparent dark:border-emerald-500/10">
                                                        <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                                        </div>
                                                        <span className="text-xs font-black uppercase tracking-[0.1em] text-foreground">Free Intro (15m)</span>
                                                    </div>
                                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 dark:bg-primary/5 border border-transparent dark:border-primary/10">
                                                        <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                                            <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                                                        </div>
                                                        <span className="text-xs font-black uppercase tracking-[0.1em] text-foreground">Full Session (60m)</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Settings & System Info */}
                        <section>
                            <h2 className="text-3xl font-black mb-8 flex items-center gap-3 tracking-tighter">
                                <Zap className="w-7 h-7 text-amber-500" />
                                System Info
                            </h2>
                            <div className="p-10 rounded-[2.5rem] border border-border dark:border-white/10 bg-card dark:transparent shadow-xl dark:shadow-none">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-6 rounded-2xl bg-muted/30 dark:bg-white/5 border border-transparent dark:border-white/5">
                                            <div className="flex items-center gap-4">
                                                <Globe className="w-5 h-5 text-emerald-500" />
                                                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Timezone</span>
                                            </div>
                                            {isEditing ? (
                                                <select className="bg-background border-2 border-border rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-primary/50">
                                                    <option>UST (GMT +5:30)</option>
                                                    <option>PST (GMT -8:00)</option>
                                                    <option>GMT (GMT +0:00)</option>
                                                </select>
                                            ) : (
                                                <span className="text-sm font-black text-foreground">{profileData.timezone}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between p-6 rounded-2xl bg-muted/30 dark:bg-white/5 border border-transparent dark:border-white/5">
                                            <div className="flex items-center gap-4">
                                                <Clock className="w-5 h-5 text-amber-500" />
                                                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Last Login</span>
                                            </div>
                                            <span className="text-sm font-black text-foreground/40">{profileData.lastLogin}</span>
                                        </div>
                                    </div>
                                    <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col justify-center relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                            <ShieldCheck className="w-16 h-16 text-primary" />
                                        </div>
                                        <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] mb-3">Identification</p>
                                        <p className="text-sm leading-relaxed text-muted-foreground font-medium relative z-10">
                                            Your unique identity is linked to <span className="text-foreground font-black">{profileData.email}</span>. Email changes are restricted for session integrity.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </div>

            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}

const ChevronLeft = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6" /></svg>
);
