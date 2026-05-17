import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Star,
    CheckCircle2,
    Clock,
    Calendar,
    MessageSquare,
    Award,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    ShieldCheck,
    User,
    Users,
    Zap,
    Video,
    TrendingUp,
    Edit3,
    Save,
    X,
    Phone,
    Globe,
    Lock,
    AlertCircle,
    Info,
    BarChart3,
    Ban
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const mockReviews = [
    {
        id: 1,
        author: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
        rating: 5,
        text: 'The session was incredibly insightful. David helped me understand complex system design patterns in a way that just clicked.',
        date: '2 weeks ago',
        type: 'paid'
    },
    {
        id: 2,
        author: 'Maya Patel',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
        rating: 5,
        text: 'Best mentor I have had! Sarah is very patient and provided great feedback on my portfolio.',
        date: '1 month ago',
        type: 'paid'
    }
];

export function MentorProfile({ mentor, onBack, onBookDemo, isOwnProfile, onSaveProfile, startEditing, onTakeVerification }) {
    const [isEditing, setIsEditing] = useState(startEditing || false);
    const [isBioExpanded, setIsBioExpanded] = useState(false);
    const [newSkill, setNewSkill] = useState('');
    const [isAddingSkill, setIsAddingSkill] = useState(false);
    const hasPromptedVerification = useRef(false);

    // Initial profile data
    const initialData = mentor || {
        name: 'David Chen',
        title: 'Senior Software Engineer',
        company: 'Google',
        email: 'david.chen@google.com', // Read-only
        phone: '+1 (555) 012-3456',
        image: 'https://images.unsplash.com/photo-1631624220291-8f191fbdb543?w=400&h=400&fit=crop',
        rating: 4.9,
        sessions: 127,
        rate: 80,
        skills: ['React', 'TypeScript', 'System Design', 'Node.js', 'Python'],
        experience: '12+ years',
        languages: ['English', 'Mandarin'],
        bio: 'I am a passionate software architect with over 12 years of experience building scalable systems at top tech companies. I specialize in frontend performance, high-traffic backend architectures, and developer mentorship. My goal is to help you navigate your career and bridge the gap between junior and senior roles by teaching you the underlying principles of engineering excellence.\n\nWhether you are preparing for system design interviews or looking to master modern web technologies, I provide personalized guidance tailored to your specific goals and learning pace.',
        isVerified: true,
        verificationStatus: 'Verified',
        accountStatus: 'Active',
        joinedDate: 'Jan 2024',
        demoEnabled: true,
        breakBuffer: '15 min',
        currency: 'USD',
        stats: {
            total: 150,
            completed: 127,
            cancelled: 18,
            noShow: 5
        }
    };

    const [profileData, setProfileData] = useState(initialData);

    useEffect(() => {
        if (mentor) {
            setProfileData(mentor);
        }
    }, [mentor]);

    useEffect(() => {
        if (startEditing) {
            setIsEditing(true);
        }
    }, [startEditing]);

    const handleSave = () => {
        // Validation logic
        if (profileData.skills.length === 0) {
            alert("Minimum 1 skill is required.");
            return;
        }
        setIsEditing(false);
        if (onSaveProfile) {
            onSaveProfile(profileData);
        }
    };

    const handleCancel = () => {
        setProfileData(initialData);
        setIsEditing(false);
    };

    const stats = [
        { label: 'Sessions Completed', value: profileData.sessions, icon: CheckCircle2, color: 'text-[var(--electric-blue)]' },
        { label: 'Completion Rate', value: '98%', icon: TrendingUp, color: 'text-emerald-500' },
        { label: 'Response Time', value: '< 2 hours', icon: Zap, color: 'text-amber-500' },
        { label: 'Trust Score', value: '96/100', icon: ShieldCheck, color: 'text-[var(--cyan)]' }
    ];

    const sessionStats = [
        { label: 'Total Sessions', value: profileData.stats.total, icon: BarChart3 },
        { label: 'Completed', value: profileData.stats.completed, icon: CheckCircle2 },
        { label: 'Cancelled', value: profileData.stats.cancelled, icon: X },
        { label: 'No-Shows', value: profileData.stats.noShow, icon: Ban }
    ];

    return (
        <div className="pt-24 pb-20 px-6 min-h-screen bg-background overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    {/* Back Button */}
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-foreground/60 hover:text-[var(--electric-blue)] transition-colors group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        {isOwnProfile ? 'Back to Dashboard' : 'Back to Explore'}
                    </button>

                    {isOwnProfile && (
                        <div className="flex gap-4">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--electric-blue)]/50 text-foreground transition-all font-medium"
                                >
                                    <Edit3 className="w-4 h-4 text-[var(--electric-blue)]" />
                                    Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleCancel}
                                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-all font-medium"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--electric-blue)] to-[var(--cyan)] text-black font-bold transition-all"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-4 rounded-2xl bg-[var(--electric-blue)]/10 border border-[var(--electric-blue)]/20 flex items-center gap-3 text-sm text-[var(--electric-blue)]"
                    >
                        <Info className="w-5 h-5" />
                        <span>You are in Edit Mode. Some fields like Email and Verification Status are read-only for security.</span>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    <div className="lg:col-span-1 space-y-8">
                        {/* Profile Header Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative p-8 rounded-3xl border border-border dark:border-white/10 bg-card dark:bg-white/5 backdrop-blur-xl text-center overflow-hidden shadow-lg dark:shadow-none"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-[var(--cyan)]/5 pointer-events-none" />

                            {/* Avatar */}
                            <div className="relative inline-block mb-6 pt-4">
                                <div className={`w-32 h-32 rounded-full p-1 bg-gradient-to-br from-primary to-[var(--cyan)] ${profileData.isVerified ? 'animate-pulse-slow' : ''}`}>
                                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-background">
                                        <ImageWithFallback src={profileData.image} alt={profileData.name} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                {profileData.isVerified && (
                                    <div className="absolute bottom-1 right-1 bg-background rounded-full p-1 border border-border dark:border-white/10">
                                        <ShieldCheck className="w-6 h-6 text-primary fill-primary/10" />
                                    </div>
                                )}
                            </div>

                            {isEditing ? (
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-xs text-muted-foreground text-left mb-1 font-bold uppercase tracking-wider">Full Name</label>
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            className="w-full bg-background border border-border dark:border-white/10 rounded-xl px-4 py-2 text-center focus:border-primary/50 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-muted-foreground text-left mb-1 font-bold uppercase tracking-wider">Email (Read-only)</label>
                                        <div className="flex items-center gap-2 bg-muted border border-border dark:border-white/5 rounded-xl px-4 py-2 text-muted-foreground italic justify-center">
                                            <Lock className="w-3 h-3" />
                                            {profileData.email}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-muted-foreground text-left mb-1 font-bold uppercase tracking-wider">Phone Number</label>
                                        <input
                                            type="text"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            className="w-full bg-background border border-border dark:border-white/10 rounded-xl px-4 py-2 text-center focus:border-primary/50 outline-none"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-3xl font-black mb-2 text-foreground">{profileData.name}</h1>
                                    <p className="text-muted-foreground font-bold mb-1">{profileData.title}</p>
                                    <p className="text-primary text-sm mb-4 font-black uppercase tracking-widest">{profileData.company}</p>
                                </>
                            )}

                            {!isEditing && (
                                <div className="flex items-center justify-center gap-3 mb-8">
                                    <div className="flex items-center text-amber-600 dark:text-amber-500 bg-amber-500/10 px-4 py-1.5 rounded-full text-sm font-black border border-amber-500/20 shadow-sm">
                                        <Star className="w-4 h-4 fill-current mr-1.5" />
                                        {profileData.rating}
                                    </div>
                                    <span className="text-muted-foreground text-xs font-bold uppercase tracking-tighter">{profileData.sessions} reviews</span>
                                </div>
                            )}

                            {/* Section for Verified Badge (Visual only) */}
                            {isOwnProfile && (
                                <div className="mb-8 p-4 rounded-2xl bg-muted/50 dark:bg-white/5 border border-border dark:border-white/10 text-left">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Verification</span>
                                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter ${profileData.isVerified ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20'}`}>
                                            {profileData.verificationStatus}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Account Status</span>
                                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter ${profileData.accountStatus === 'Active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 dark:text-rose-500 border border-rose-500/20'}`}>
                                            {profileData.accountStatus}
                                        </span>
                                    </div>

                                    {!profileData.isVerified && profileData.skills.length > 0 && !isEditing && (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={onTakeVerification}
                                            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-[var(--cyan)] text-primary-foreground font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                        >
                                            <ShieldCheck className="w-4 h-4" />
                                            Take Verification Test
                                        </motion.button>
                                    )}
                                </div>
                            )}

                            {/* CTAs */}
                            <div className="space-y-4">
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => onBookDemo(profileData)}
                                    disabled={!profileData.isVerified}
                                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all ${profileData.isVerified ? 'bg-primary text-primary-foreground shadow-primary/20' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}
                                >
                                    <Video className="w-5 h-5" />
                                    Book Demo Session
                                </motion.button>
                                {!profileData.isVerified && (
                                    <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest mt-1">Bookings Disabled Until Verified</p>
                                )}
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={!profileData.isVerified}
                                    className={`w-full py-5 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 font-black uppercase tracking-widest shadow-lg ${profileData.isVerified ? 'border-border dark:border-white/10 text-foreground bg-card hover:border-primary/50 shadow-black/5 dark:shadow-none' : 'text-muted-foreground/40 cursor-not-allowed border-border'}`}
                                >
                                    <Calendar className="w-5 h-5 text-primary" />
                                    Book Paid Session
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Pricing & Monetization Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="p-8 rounded-3xl border border-border dark:border-white/10 bg-card dark:bg-white/5 backdrop-blur-xl shadow-md dark:shadow-none"
                        >
                            <h3 className="text-xl font-black mb-6 flex items-center gap-2 uppercase tracking-tight">
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                                Pricing
                            </h3>
                            <div className="space-y-6">
                                <div className="p-5 rounded-2xl border border-border dark:border-white/5 bg-muted/30 dark:bg-white/5">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-black uppercase tracking-tight">Demo Session</span>
                                        <span className="text-emerald-600 dark:text-emerald-500 font-black">Free</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-bold italic">15 min max duration (locked)</p>
                                    {isEditing && (
                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="text-xs font-black text-muted-foreground uppercase">Enabled</span>
                                            <div className="w-10 h-6 bg-emerald-500/20 rounded-full p-1 border border-emerald-500/30 flex justify-end">
                                                <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-sm" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className={`p-5 rounded-2xl border transition-all ${isEditing ? 'border-primary/50' : 'border-border dark:border-white/5'} bg-muted/30 dark:bg-white/5`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-black uppercase tracking-tight">Paid Hourly Rate</span>
                                        {isEditing ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-black text-muted-foreground">{profileData.currency}</span>
                                                <input
                                                    type="number"
                                                    value={profileData.rate}
                                                    onChange={(e) => setProfileData({ ...profileData, rate: parseInt(e.target.value) })}
                                                    className="w-20 bg-background border border-border dark:border-white/10 rounded-lg px-2 py-1 text-right text-primary font-black outline-none shadow-inner"
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-2xl font-black text-primary">${profileData.rate}</span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Base Platform Currency ({profileData.currency})</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Details & Reviews */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Session Statistics (Read-Only) */}
                        {isOwnProfile && (
                            <section>
                                <h2 className="text-2xl font-black mb-6 flex items-center gap-2 tracking-tighter uppercase">
                                    <BarChart3 className="w-7 h-7 text-purple-500" />
                                    Analytics
                                </h2>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                    {sessionStats.map((stat, i) => (
                                        <div key={i} className="p-8 rounded-[2rem] border border-border dark:border-white/10 bg-card dark:bg-white/5 text-center shadow-md hover:shadow-lg transition-all">
                                            <stat.icon className={`w-6 h-6 mx-auto mb-3 ${i === 3 && profileData.stats.noShow > 3 ? 'text-rose-500' : 'text-primary/60'}`} />
                                            <p className="text-3xl font-black mb-1">{stat.value}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                                {profileData.stats.noShow > 3 && (
                                    <div className="mt-4 p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-4 text-sm text-rose-600 dark:text-rose-500 font-bold">
                                        <AlertCircle className="w-6 h-6" />
                                        <span>CRITICAL: High no-show count detected. Quality monitoring active.</span>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* About Section */}
                        <section>
                            <h2 className="text-2xl font-black mb-6 flex items-center gap-2 tracking-tighter uppercase">
                                <User className="w-7 h-7 text-primary" />
                                Professional Profile
                            </h2>
                            <div className="space-y-6">
                                <div className="p-10 rounded-[2.5rem] border border-border dark:border-white/10 bg-card dark:bg-white/5 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-none">
                                    {isEditing ? (
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">Tagline / Title</label>
                                                <input
                                                    type="text"
                                                    value={profileData.title}
                                                    onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                                                    className="w-full bg-background border border-border rounded-xl px-4 py-4 outline-none focus:border-primary/50 text-lg font-bold"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">Professional Bio</label>
                                                <textarea
                                                    value={profileData.bio}
                                                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                                    className="w-full h-48 bg-background border border-border rounded-2xl px-5 py-4 outline-none focus:border-primary/50 text-base leading-relaxed resize-none font-medium"
                                                    maxLength={500}
                                                />
                                                <p className="text-right text-[10px] text-muted-foreground font-bold mt-2">{profileData.bio.length}/500 characters</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className={`relative transition-all duration-500 overflow-hidden ${isBioExpanded ? 'max-h-[1000px]' : 'max-h-[140px]'}`}>
                                                <p className="text-xl text-foreground/80 leading-relaxed whitespace-pre-line font-medium italic font-serif">
                                                    "{profileData.bio}"
                                                </p>
                                                {!isBioExpanded && (
                                                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card dark:from-[#111827]/90 to-transparent" />
                                                )}
                                            </div>
                                            <button
                                                onClick={() => setIsBioExpanded(!isBioExpanded)}
                                                className="mt-6 text-primary font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:translate-x-1 transition-transform"
                                            >
                                                {isBioExpanded ? 'Show Less' : 'Full Story'}
                                                {isBioExpanded ? <ChevronUp className="w-5 h-5 shadow-sm" /> : <ChevronDown className="w-5 h-5 shadow-sm" />}
                                            </button>
                                        </>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-8 rounded-[2rem] bg-muted/40 dark:bg-white/5 border border-border dark:border-white/10 flex items-center gap-6 shadow-sm">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                                            <Award className="w-8 h-8 text-primary" />
                                        </div>
                                        <div>
                                            {isEditing ? (
                                                <select
                                                    value={profileData.experience}
                                                    onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                                                    className="bg-background border border-border rounded-lg px-2 py-1.5 text-sm font-bold outline-none"
                                                >
                                                    <option>1-3 years</option>
                                                    <option>4-7 years</option>
                                                    <option>8-11 years</option>
                                                    <option>12+ years</option>
                                                </select>
                                            ) : (
                                                <p className="text-2xl font-black text-foreground">{profileData.experience}</p>
                                            )}
                                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Industry Exp</p>
                                        </div>
                                    </div>
                                    <div className="p-8 rounded-[2rem] bg-muted/40 dark:bg-white/5 border border-border dark:border-white/10 flex items-center gap-6 shadow-sm">
                                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                            <Globe className="w-8 h-8 text-emerald-600 dark:text-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black text-foreground">{profileData.languages.join(', ')}</p>
                                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Languages</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Skills Section */}
                        <section>
                            <h2 className="text-2xl font-black mb-6 flex items-center gap-2 tracking-tighter uppercase">
                                <Zap className="w-7 h-7 text-amber-500" />
                                Expertise
                            </h2>
                            <div className="flex flex-wrap gap-4">
                                {profileData.skills.map((skill, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        className="relative px-8 py-4 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-xl text-lg font-black text-primary hover:bg-primary/10 hover:border-primary/40 transition-all cursor-default shadow-sm"
                                    >
                                        {skill}
                                        {isEditing && profileData.skills.length > 1 && (
                                            <button
                                                onClick={() => setProfileData({ ...profileData, skills: profileData.skills.filter((_, idx) => idx !== i) })}
                                                className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] shadow-lg border-2 border-background"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </motion.div>
                                ))}
                                {isEditing && (
                                    isAddingSkill ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={newSkill}
                                                onChange={(e) => setNewSkill(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        if (newSkill.trim()) {
                                                            setProfileData({ ...profileData, skills: [...profileData.skills, newSkill.trim()] });
                                                            setNewSkill('');
                                                            setIsAddingSkill(false);
                                                        }
                                                    } else if (e.key === 'Escape') {
                                                        setIsAddingSkill(false);
                                                        setNewSkill('');
                                                    }
                                                }}
                                                autoFocus
                                                placeholder="Type skill & press Enter..."
                                                className="px-6 py-4 rounded-xl border border-primary/50 bg-background text-foreground outline-none font-bold min-w-[200px]"
                                            />
                                            <button
                                                onClick={() => {
                                                    if (newSkill.trim()) {
                                                        setProfileData({ ...profileData, skills: [...profileData.skills, newSkill.trim()] });
                                                        setNewSkill('');
                                                        setIsAddingSkill(false);
                                                    }
                                                }}
                                                className="p-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                                            >
                                                <CheckCircle2 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsAddingSkill(false);
                                                    setNewSkill('');
                                                }}
                                                className="p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setIsAddingSkill(true)}
                                            className="px-8 py-4 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 text-muted-foreground hover:text-primary font-black uppercase tracking-widest text-sm transition-all shadow-sm"
                                        >
                                            + Add Skill
                                        </button>
                                    )
                                )}
                            </div>
                        </section>

                        {/* Availability Section */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-black flex items-center gap-2 tracking-tighter uppercase">
                                    <Clock className="w-7 h-7 text-emerald-500" />
                                    Scheduling
                                </h2>
                                {isEditing && (
                                    <div className="flex items-center gap-2 text-[10px] font-black text-amber-600 dark:text-amber-500 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20 uppercase tracking-widest">
                                        <AlertCircle className="w-4 h-4" />
                                        Locked for booked items
                                    </div>
                                )}
                            </div>
                            <div className="p-10 rounded-[2.5rem] border border-border dark:border-white/10 bg-card dark:bg-white/5 shadow-lg shadow-black/5 dark:shadow-none transition-all">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div>
                                        <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6">Weekly Window</h4>
                                        <div className="space-y-4">
                                            {['Mon', 'Wed', 'Fri'].map((day) => (
                                                <div key={day} className="flex items-center justify-between p-5 rounded-2xl bg-muted/40 dark:bg-white/5 border border-border dark:border-white/5 shadow-sm">
                                                    <span className="font-black text-foreground/80 uppercase tracking-tighter">{day}</span>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-sm font-bold text-foreground/60 tracking-tight">09:00 AM - 05:00 PM</span>
                                                        {isEditing && <Edit3 className="w-4 h-4 text-primary cursor-pointer hover:scale-120 transition-transform" />}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-8">
                                        <div>
                                            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6">Policy</h4>
                                            <div className="p-5 rounded-2xl bg-muted/40 dark:bg-white/5 border border-border dark:border-white/5 shadow-sm flex items-center justify-between">
                                                <span className="text-sm font-bold text-foreground/70">Break Buffer</span>
                                                {isEditing ? (
                                                    <select
                                                        value={profileData.breakBuffer}
                                                        onChange={(e) => setProfileData({ ...profileData, breakBuffer: e.target.value })}
                                                        className="bg-background border border-border rounded-lg px-2 py-1.5 text-sm font-black outline-none shadow-sm"
                                                    >
                                                        <option>None</option>
                                                        <option>5 min</option>
                                                        <option>10 min</option>
                                                        <option>15 min</option>
                                                        <option>30 min</option>
                                                    </select>
                                                ) : (
                                                    <span className="font-black text-primary uppercase tracking-widest">{profileData.breakBuffer}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6">Tenure</h4>
                                            <div className="p-5 rounded-2xl bg-muted/40 dark:bg-white/5 border border-border dark:border-white/5 shadow-sm flex items-center justify-between">
                                                <span className="text-sm font-bold text-foreground/70">Verified Member Since</span>
                                                <span className="font-black text-muted-foreground/60 uppercase tracking-widest">{profileData.joinedDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Reviews Section (Read-Only) */}
                        <section className="relative">
                            <h2 className="text-2xl font-black mb-8 flex items-center justify-between tracking-tighter uppercase">
                                <span className="flex items-center gap-2">
                                    <Star className="w-7 h-7 text-amber-500" />
                                    Feedback
                                </span>
                                <div className="flex gap-3">
                                    <button className="p-3 rounded-2xl bg-card border border-border hover:border-primary transition-all shadow-md group">
                                        <ChevronLeft className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all" />
                                    </button>
                                    <button className="p-3 rounded-2xl bg-card border border-border hover:border-primary transition-all shadow-md group">
                                        <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </button>
                                </div>
                            </h2>
                            <div className="flex gap-8 overflow-x-auto pb-10 hide-scrollbar snap-x snap-mandatory px-2">
                                {mockReviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="flex-shrink-0 w-full sm:w-[500px] p-10 rounded-[3rem] border border-border dark:border-white/10 bg-card dark:bg-white/5 shadow-xl shadow-black/5 dark:shadow-none snap-center hover:scale-[1.01] transition-transform"
                                    >
                                        <div className="flex items-start justify-between mb-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 rounded-3xl overflow-hidden border-4 border-background shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                                                    <img src={review.avatar} alt={review.author} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black tracking-tight">{review.author}</h4>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{review.date}</span>
                                                        <span className="w-1 h-1 rounded-full bg-border" />
                                                        <span className="text-[10px] text-primary uppercase font-black tracking-widest">{review.type} session</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-amber-600 font-black text-lg bg-amber-500/5 px-4 py-1.5 rounded-2xl border border-amber-500/10">
                                                <Star className="w-5 h-5 fill-current" />
                                                {review.rating}
                                            </div>
                                        </div>
                                        <p className="text-xl text-foreground font-medium leading-[1.6] opacity-80 italic font-serif">
                                            "{review.text}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>
                </div>
            </div>

            <style>{`
                .animate-pulse-slow {
                    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.02); }
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div >
    );
}
