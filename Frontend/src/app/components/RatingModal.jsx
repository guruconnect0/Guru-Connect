import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
    Star, 
    Send, 
    Loader2, 
    MessageSquare,
    ThumbsUp,
    Heart,
    Sparkles,
    Zap
} from 'lucide-react';
import { createReview } from '../services/api';
import { toast } from 'sonner';

const ratingLabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
};

const quickFeedbacks = [
    { id: 'knowledgeable', label: 'Knowledgeable', icon: Zap },
    { id: 'patient', label: 'Patient', icon: Heart },
    { id: 'clear', label: 'Clear Explanations', icon: MessageSquare },
    { id: 'helpful', label: 'Helpful', icon: ThumbsUp },
];

export function RatingModal({ isOpen, onClose, booking, onReviewSubmit }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [selectedFeedbacks, setSelectedFeedbacks] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const mentorName = booking?.mentorId?.userId?.name || 'Mentor';
    const sessionType = booking?.sessionType || 'paid';
    const isDemo = sessionType === 'demo';

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setIsSubmitting(true);
        try {
            await createReview({
                bookingId: booking._id,
                rating,
                comment: comment || selectedFeedbacks.join(', ')
            });

            setSubmitted(true);
            toast.success('Thank you for your review! 💫');
            
            setTimeout(() => {
                onReviewSubmit?.();
                handleClose();
            }, 2000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setRating(0);
        setHoverRating(0);
        setComment('');
        setSelectedFeedbacks([]);
        setSubmitted(false);
        onClose();
    };

    const toggleFeedback = (id) => {
        setSelectedFeedbacks(prev => 
            prev.includes(id) 
                ? prev.filter(f => f !== id) 
                : [...prev, id]
        );
    };

    const currentRating = hoverRating || rating;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[150] flex items-center justify-center p-4"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-card dark:bg-background/95 border border-border dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="relative p-8 pb-6 bg-gradient-to-br from-primary/10 via-transparent to-cyan-500/10">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-cyan-500 to-primary" />
                            
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
                                        {isDemo ? (
                                            <Sparkles className="w-6 h-6 text-white" />
                                        ) : (
                                            <Star className="w-6 h-6 text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-foreground">
                                            {isDemo ? 'Rate Your Demo' : 'Rate Your Session'}
                                        </h2>
                                        <p className="text-sm text-muted-foreground font-medium">
                                            with {mentorName}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="w-10 h-10 rounded-xl hover:bg-muted flex items-center justify-center transition-colors"
                                >
                                    <span className="text-2xl text-muted-foreground">×</span>
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 pt-4 space-y-8">
                            {submitted ? (
                                /* Success State */
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-12 text-center"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 200 }}
                                        className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-xl"
                                    >
                                        <Sparkles className="w-12 h-12 text-white" />
                                    </motion.div>
                                    <h3 className="text-2xl font-black text-foreground mb-2">
                                        Thank You! 🙏
                                    </h3>
                                    <p className="text-muted-foreground font-medium">
                                        Your feedback helps others learn better
                                    </p>
                                </motion.div>
                            ) : (
                                <>
                                    {/* Star Rating */}
                                    <div className="text-center">
                                        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">
                                            Tap a star to rate
                                        </p>
                                        <div className="flex justify-center gap-3">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <motion.button
                                                    key={star}
                                                    whileHover={{ scale: 1.3 }}
                                                    whileTap={{ scale: 0.85 }}
                                                    onClick={() => setRating(star)}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    className="focus:outline-none cursor-pointer p-1"
                                                >
                                                    <Star 
                                                        className={`w-12 h-12 transition-all duration-200 ${
                                                            star <= currentRating 
                                                                ? 'text-amber-400 fill-amber-400 drop-shadow-lg' 
                                                                : 'text-muted-foreground/40 hover:text-amber-300'
                                                        }`}
                                                    />
                                                </motion.button>
                                            ))}
                                        </div>
                                        {currentRating > 0 && (
                                            <motion.p
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-4 text-lg font-black text-primary uppercase tracking-widest"
                                            >
                                                {ratingLabels[currentRating]}
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Quick Feedback */}
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 text-center">
                                            Quick feedback (optional)
                                        </p>
                                        <div className="flex flex-wrap justify-center gap-2">
                                            {quickFeedbacks.map((fb) => (
                                                <motion.button
                                                    key={fb.id}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => toggleFeedback(fb.id)}
                                                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                                                        selectedFeedbacks.includes(fb.id)
                                                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                                                            : 'bg-muted/50 dark:bg-white/5 border border-border dark:border-white/10 text-muted-foreground hover:text-foreground'
                                                    }`}
                                                >
                                                    <fb.icon className="w-3.5 h-3.5" />
                                                    {fb.label}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Comment */}
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">
                                            Your review (optional)
                                        </p>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Share your experience..."
                                            rows={3}
                                            className="w-full p-4 rounded-2xl bg-muted/30 dark:bg-white/5 border border-border dark:border-white/10 text-foreground placeholder:text-muted-foreground/40 resize-none outline-none focus:border-primary/50 transition-colors font-medium"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <motion.button
                                        whileHover={rating > 0 ? { scale: 1.02 } : {}}
                                        whileTap={rating > 0 ? { scale: 0.98 } : {}}
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || rating === 0}
                                        className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                                            rating > 0
                                                ? 'bg-gradient-to-r from-primary to-cyan-500 text-white shadow-xl shadow-primary/20'
                                                : 'bg-muted text-muted-foreground cursor-not-allowed'
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Submit Review
                                            </>
                                        )}
                                    </motion.button>
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}