import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    ChevronLeft,
    Calendar,
    Clock,
    Video,
    ShieldCheck,
    Star,
    Info,
    AlertCircle,
    CheckCircle2,
    X,
    Lock,
    Zap,
    TrendingUp,
    MessageSquare,
    UserCircle
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function DemoSession({ mentor, user, onBack }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [bookingStatus, setBookingStatus] = useState('idle'); // 'idle', 'pending', 'confirmed', 'completed'
    const [hasExistingDemo, setHasExistingDemo] = useState(false); // Mocked check
    const [countdown, setCountdown] = useState(0);

    // Mock Eligibility Check
    useEffect(() => {
        // Logic: 1 demo per mentor per candidate
        if (mentor?.id === 1) { // Mocking a case where user already had a demo
            // setHasExistingDemo(true); 
        }
    }, [mentor]);

    const dates = [
        { day: 'Mon', date: '10', full: 'Feb 10, 2026' },
        { day: 'Tue', date: '11', full: 'Feb 11, 2026' },
        { day: 'Wed', date: '12', full: 'Feb 12, 2026' },
        { day: 'Thu', date: '13', full: 'Feb 13, 2026' },
        { day: 'Fri', date: '14', full: 'Feb 14, 2026' }
    ];

    const slots = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
        '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'
    ];

    const handleBookDemo = () => {
        setBookingStatus('pending');
        setShowModal(false);
        // Simulate mentor confirmation after 2 seconds
        setTimeout(() => {
            setBookingStatus('confirmed');
            setCountdown(600); // 10 minutes from now for demo joinability
        }, 2000);
    };

    const isVerified = mentor?.isVerified ?? true;
    const canBook = isVerified && !hasExistingDemo && bookingStatus === 'idle';

    return (
        <div className="pt-24 pb-20 px-6 min-h-screen bg-background overflow-x-hidden">
            <div className="max-w-5xl mx-auto">
                {/* Header: Mentor Info (Read-Only) */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-foreground/60 hover:text-[var(--electric-blue)] transition-colors group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Back to Profile
                    </button>
                    {bookingStatus === 'confirmed' && (
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-bold animate-pulse">
                            <CheckCircle2 className="w-4 h-4" />
                            Confirmed: Join Window Opening Soon
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left/Middle Column: Main Selection */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Mentor Header Card */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-10 rounded-[2.5rem] border border-border dark:border-white/10 bg-card dark:transparent shadow-xl dark:shadow-none flex items-center gap-8"
                        >
                            <div className="w-28 h-28 rounded-3xl p-1 bg-gradient-to-br from-primary to-[var(--cyan)] shadow-lg shadow-primary/20">
                                <div className="w-full h-full rounded-[1.25rem] overflow-hidden border-4 border-background">
                                    <ImageWithFallback src={mentor?.image || ''} alt={mentor?.name} className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3">
                                    {mentor?.name}
                                    {isVerified && <ShieldCheck className="w-6 h-6 text-primary" />}
                                </h1>
                                <p className="text-muted-foreground text-xl font-medium mb-4">{mentor?.title}</p>
                                <div className="flex flex-wrap gap-2">
                                    {mentor?.skills?.slice(0, 3).map((skill, i) => (
                                        <span key={i} className="text-[10px] px-3 py-1 rounded-full bg-muted/50 dark:bg-white/5 border border-border dark:border-white/10 text-muted-foreground font-black uppercase tracking-widest">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.section>

                        {/* Availability Selector */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="p-10 rounded-[2.5rem] border border-border dark:border-white/10 bg-card dark:transparent shadow-xl dark:shadow-none"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                                    <Calendar className="w-7 h-7 text-primary" />
                                    Select Date & Time
                                </h2>
                                <div className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Zap className="w-3 h-3 text-primary" />
                                    {mentor?.timezone || 'UST (GMT +5:30)'}
                                </div>
                            </div>

                            {/* Date Picker */}
                            <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar mb-10">
                                {dates.map((date) => (
                                    <button
                                        key={date.date}
                                        onClick={() => setSelectedDate(date)}
                                        className={`flex-shrink-0 w-24 h-28 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1.5 ${selectedDate?.date === date.date ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-muted/30 dark:bg-white/5 border-transparent dark:border-white/5 text-muted-foreground hover:border-primary/30 hover:bg-card'}`}
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-widest">{date.day}</span>
                                        <span className="text-3xl font-black tracking-tighter">{date.date}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Slot Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {slots.map((slot) => (
                                    <button
                                        key={slot}
                                        onClick={() => setSelectedSlot(slot)}
                                        disabled={!selectedDate}
                                        className={`h-14 rounded-2xl border-2 text-xs font-black uppercase tracking-widest transition-all ${!selectedDate ? 'opacity-20 cursor-not-allowed' : selectedSlot === slot ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-muted/30 dark:bg-white/5 border-transparent dark:border-white/5 hover:border-primary/30 hover:bg-card'}`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </motion.section>
                    </div>

                    {/* Right Column: Info & Summary */}
                    <div className="space-y-8">
                        {/* Demo Session Info Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-10 rounded-[2.5rem] border border-border dark:border-white/10 bg-card dark:bg-white/5 shadow-xl dark:shadow-none relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6">
                                <Info className="w-6 h-6 text-primary/30" />
                            </div>
                            <h3 className="text-xl font-black mb-8 tracking-tighter">Demo Details</h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground font-black uppercase tracking-widest text-[9px]">Type</span>
                                    <span className="text-emerald-500 font-black uppercase tracking-widest text-xs">Free Demo</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground font-black uppercase tracking-widest text-[9px]">Duration</span>
                                    <div className="flex items-center gap-2 text-foreground font-black uppercase tracking-widest text-xs">
                                        <Clock className="w-4 h-4 text-primary" />
                                        15 Mins
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-6 border-t border-border dark:border-white/5">
                                    <span className="text-muted-foreground font-black uppercase tracking-widest text-[9px]">Price</span>
                                    <span className="text-3xl font-black text-foreground tracking-tighter">₹0</span>
                                </div>
                            </div>

                            {/* Eligibility Guard */}
                            <div className="mt-10">
                                {!canBook ? (
                                    <div className="p-6 rounded-[2rem] bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-500 text-xs font-bold space-y-3">
                                        <div className="flex items-center gap-2 font-black uppercase tracking-widest">
                                            <AlertCircle className="w-5 h-5" />
                                            {hasExistingDemo ? 'Already Held' : 'Unavailable'}
                                        </div>
                                        <p className="opacity-80 leading-relaxed font-medium">
                                            {hasExistingDemo
                                                ? "You've already had a demo with this mentor. Please book a paid session to continue."
                                                : "This mentor is undergoing verification. Bookings temporary disabled."}
                                        </p>
                                    </div>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowModal(true)}
                                        disabled={!selectedDate || !selectedSlot || bookingStatus !== 'idle'}
                                        className={`w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl ${selectedDate && selectedSlot ? 'bg-primary text-primary-foreground shadow-primary/20' : 'bg-muted/50 dark:bg-white/5 text-muted-foreground/30 cursor-not-allowed'}`}
                                    >
                                        {bookingStatus === 'idle' ? 'Book Demo' : bookingStatus === 'pending' ? 'Booking...' : 'Booked'}
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>

                        {/* Order Summary & Status */}
                        {bookingStatus === 'confirmed' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <Video className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="font-bold">Next Step: Join Call</p>
                                        <p className="text-xs text-foreground/40">Feb 10 @ 09:00 AM</p>
                                    </div>
                                </div>
                                <button className="w-full py-4 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 group">
                                    Join Session
                                    <Zap className="w-4 h-4 group-hover:scale-125 transition-transform" />
                                </button>
                                <p className="text-[10px] text-center text-foreground/40 mt-3 font-bold uppercase tracking-widest">Opens 10m Before Window</p>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Post-Demo CTA Section (Visible if completed or already held demo) */}
                {hasExistingDemo && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-12 p-12 rounded-[3.5rem] border border-primary/20 bg-card dark:transparent shadow-2xl dark:shadow-none text-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-[var(--cyan)]/5 pointer-events-none" />
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black mb-4 tracking-tighter">Continue your journey</h3>
                            <p className="text-muted-foreground mb-10 max-w-lg mx-auto font-medium leading-relaxed">
                                Since you've already completed your free demo, you're now eligible to book a full paid session for deep-dive mentorship.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-10 h-16 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                                >
                                    Continue with Mentor
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-10 h-16 rounded-2xl border-2 border-border hover:border-primary/30 transition-all font-black uppercase tracking-widest text-foreground"
                                >
                                    View Profile
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={() => setShowModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg p-10 rounded-[3rem] border border-border dark:border-white/10 bg-card dark:bg-[#111] shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8">
                                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-primary transition-colors">
                                    <X className="w-8 h-8" />
                                </button>
                            </div>

                            <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/5">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                            </div>
                            <h2 className="text-3xl font-black text-center mb-3 tracking-tighter">Confirm Demo</h2>
                            <p className="text-muted-foreground text-center mb-10 font-medium">15-minute intro with {mentor?.name}.</p>

                            <div className="space-y-4 mb-10">
                                <div className="p-6 rounded-2xl bg-muted/30 dark:bg-white/5 border border-transparent dark:border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Calendar className="w-6 h-6 text-primary" />
                                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Date</span>
                                    </div>
                                    <span className="font-black text-foreground tracking-tight">{selectedDate?.full}</span>
                                </div>
                                <div className="p-6 rounded-2xl bg-muted/30 dark:bg-white/5 border border-transparent dark:border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Clock className="w-6 h-6 text-[var(--cyan)]" />
                                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Time</span>
                                    </div>
                                    <span className="font-black text-foreground tracking-tight">{selectedSlot}</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 mb-10 bg-primary/5 p-6 rounded-[1.5rem] border border-primary/10">
                                <Info className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                                <p className="text-[10px] uppercase font-black text-primary/80 leading-relaxed tracking-wider">
                                    By confirming, you agree to show up on time. Missed demos may restrict future free bookings.
                                </p>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleBookDemo}
                                className="w-full h-18 py-5 rounded-2xl bg-primary text-primary-foreground font-black text-lg uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 transition-all"
                            >
                                Confirm & Book
                            </motion.button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}
