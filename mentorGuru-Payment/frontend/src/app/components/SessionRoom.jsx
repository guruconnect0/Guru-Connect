import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    X,
    Mic,
    MicOff,
    Video,
    VideoOff,
    MonitorUp,
    MessageSquare,
    PhoneOff,
    ChevronRight,
    ChevronLeft,
    Clock,
    Wifi,
    WifiOff,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    User,
    Save,
    Send,
    Download
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import jsPDF from 'jspdf';

export function SessionRoom({ mentor, user, onBack, onEndSession }) {
    // Generate stable session ID based on mentor and current date (not time)
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const sessionId = `session_${mentor?.id || 'default'}_${today}`;
    const notesKey = `notes_${mentor?.id || 'default'}`;
    const chatCookieName = `chat_${sessionId}`;


    // Video controls state
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    // UI state
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('info'); // 'info', 'notes', 'chat'

    // Session state
    const [connectionStatus, setConnectionStatus] = useState('connected'); // 'waiting', 'connecting', 'connected', 'reconnecting', 'poor', 'ended'
    const [sessionDuration, setSessionDuration] = useState(0);
    const [notes, setNotes] = useState('');
    const [isSavingNotes, setIsSavingNotes] = useState(false);

    // Chat state - load from cookies on mount
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef(null);

    // Load notes from localStorage on mount
    useEffect(() => {
        const savedNotes = localStorage.getItem(notesKey);
        if (savedNotes) {
            setNotes(savedNotes);
        }
    }, [notesKey]);

    // Load chat from sessionStorage on mount
    useEffect(() => {
        try {
            const savedChat = sessionStorage.getItem(chatCookieName);
            if (savedChat) {
                const parsedChat = JSON.parse(savedChat);
                if (Array.isArray(parsedChat)) {
                    setMessages(parsedChat);
                    return;
                }
            }
        } catch (e) {
            console.error('Error loading chat from sessionStorage:', e);
        }

        // Default messages if no saved chat
        const defaultMessages = [
            { id: 1, sender: 'mentor', text: 'Hello! Ready to start our session?', time: '3:15 PM' },
            { id: 2, sender: 'user', text: 'Yes, excited to learn!', time: '3:15 PM' }
        ];
        setMessages(defaultMessages);
        sessionStorage.setItem(chatCookieName, JSON.stringify(defaultMessages));
    }, [chatCookieName]);

    // Session timer
    useEffect(() => {
        if (connectionStatus === 'connected') {
            const interval = setInterval(() => {
                setSessionDuration(prev => prev + 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [connectionStatus]);

    // Auto-save notes to localStorage
    useEffect(() => {
        if (notes !== undefined) {
            setIsSavingNotes(true);
            const timeout = setTimeout(() => {
                localStorage.setItem(notesKey, notes);
                setIsSavingNotes(false);
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [notes, notesKey]);

    // Save chat to sessionStorage whenever messages change
    useEffect(() => {
        if (messages.length > 0) {
            try {
                sessionStorage.setItem(chatCookieName, JSON.stringify(messages));
            } catch (e) {
                console.error('Error saving chat to sessionStorage:', e);
            }
        }
    }, [messages, chatCookieName]);

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Cleanup: Delete chat from sessionStorage when session ends
    useEffect(() => {
        if (connectionStatus === 'ended') {
            const timeout = setTimeout(() => {
                sessionStorage.removeItem(chatCookieName);
            }, 2000); // Delete after 2 seconds to allow user to see final state
            return () => clearTimeout(timeout);
        }
    }, [connectionStatus, chatCookieName]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if (e.key === 'm' || e.key === 'M') {
                setIsMuted(prev => !prev);
            } else if (e.key === 'c' || e.key === 'C') {
                setIsCameraOff(prev => !prev);
            } else if (e.key === 'e' || e.key === 'E') {
                handleEndSession();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

        setMessages(prev => [...prev, {
            id: Date.now(),
            sender: 'user',
            text: newMessage,
            time
        }]);
        setNewMessage('');
    };

    const handleDownloadNotes = () => {
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Session Notes', 20, 20);

        // Add session info
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Mentor: ${mentor?.name || 'Unknown'}`, 20, 35);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 45);
        doc.text(`Duration: ${formatTime(sessionDuration)}`, 20, 55);

        // Add separator line
        doc.setLineWidth(0.5);
        doc.line(20, 60, 190, 60);

        // Add notes content
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');

        const notesText = notes || 'No notes taken during this session.';
        const splitNotes = doc.splitTextToSize(notesText, 170);
        doc.text(splitNotes, 20, 70);

        // Add footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.setTextColor(128);
            doc.text(
                `GuruConnect - Page ${i} of ${pageCount}`,
                doc.internal.pageSize.width / 2,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }

        // Download the PDF
        const fileName = `GuruConnect_Notes_${mentor?.name?.replace(/\s+/g, '_') || 'Session'}_${today}.pdf`;
        doc.save(fileName);
    };

    const handleEndSession = () => {
        if (window.confirm('Are you sure you want to end this session?')) {
            setConnectionStatus('ended');
            // Delete chat from sessionStorage when session ends
            setTimeout(() => {
                sessionStorage.removeItem(chatCookieName);
            }, 2000);
            if (onEndSession) {
                setTimeout(() => onEndSession(), 3000);
            }
        }
    };

    const getStatusConfig = () => {
        switch (connectionStatus) {
            case 'waiting':
                return { color: 'text-yellow-500', icon: Loader2, text: 'Waiting for mentor...', animate: true };
            case 'connecting':
                return { color: 'text-blue-500', icon: Loader2, text: 'Connecting...', animate: true };
            case 'connected':
                return { color: 'text-emerald-500', icon: Wifi, text: 'Connected', animate: false };
            case 'reconnecting':
                return { color: 'text-yellow-500', icon: Loader2, text: 'Reconnecting...', animate: true };
            case 'poor':
                return { color: 'text-orange-500', icon: WifiOff, text: 'Poor connection', animate: false };
            case 'ended':
                return { color: 'text-red-500', icon: CheckCircle2, text: 'Session ended', animate: false };
            default:
                return { color: 'text-emerald-500', icon: Wifi, text: 'Connected', animate: false };
        }
    };

    const statusConfig = getStatusConfig();
    const StatusIcon = statusConfig.icon;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-background z-50 overflow-hidden"
        >
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 h-20 px-6 flex items-center justify-between bg-card/50 dark:bg-black/30 backdrop-blur-xl border-b border-border dark:border-white/5 z-30">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-black tracking-tight">
                        Session with {mentor?.name || 'Mentor'}
                    </h1>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/30 dark:bg-white/5 border border-border dark:border-white/5">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold tabular-nums">{formatTime(sessionDuration)}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/30 dark:bg-white/5 border border-border dark:border-white/5 ${statusConfig.color}`}>
                        <StatusIcon className={`w-4 h-4 ${statusConfig.animate ? 'animate-spin' : ''}`} />
                        <span className="text-sm font-bold hidden sm:inline">{statusConfig.text}</span>
                    </div>

                    <button
                        onClick={onBack}
                        className="w-10 h-10 rounded-xl bg-muted/30 dark:bg-white/5 hover:bg-muted dark:hover:bg-white/10 border border-border dark:border-white/5 flex items-center justify-center transition-all group"
                        aria-label="Close session"
                    >
                        <X className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="absolute inset-0 pt-20 pb-24 flex">
                {/* Video Area */}
                <div className="flex-1 relative p-4 lg:p-6">
                    {/* Main Video */}
                    <div className="relative w-full h-full rounded-3xl lg:rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-muted/20 to-muted/5 dark:from-white/5 dark:to-white/[0.02] border border-border dark:border-white/10 shadow-2xl">
                        {/* Placeholder for main video */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center space-y-4">
                                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-cyan-500 p-1 shadow-lg shadow-primary/20">
                                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-background">
                                        <ImageWithFallback
                                            src={mentor?.image || ''}
                                            alt={mentor?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <p className="text-lg font-bold text-muted-foreground">{mentor?.name || 'Mentor'}</p>
                            </div>
                        </div>

                        {/* Active speaker glow effect */}
                        <div className="absolute inset-0 rounded-3xl lg:rounded-[2.5rem] ring-4 ring-primary/30 animate-pulse pointer-events-none" />

                        {/* Camera off overlay */}
                        <AnimatePresence>
                            {isCameraOff && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center"
                                >
                                    <div className="text-center space-y-3">
                                        <VideoOff className="w-16 h-16 mx-auto text-muted-foreground" />
                                        <p className="text-sm font-bold text-muted-foreground">Camera is off</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Secondary Video (Picture-in-Picture) */}
                    <motion.div
                        drag
                        dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                        dragElastic={0.1}
                        className="absolute bottom-6 right-6 w-48 h-36 rounded-2xl overflow-hidden bg-gradient-to-br from-muted/40 to-muted/20 dark:from-white/10 dark:to-white/5 border-2 border-border dark:border-white/20 shadow-xl cursor-move hover:scale-105 transition-transform"
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center space-y-2">
                                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
                                    <User className="w-8 h-8 text-primary-foreground" />
                                </div>
                                <p className="text-xs font-bold text-muted-foreground">You</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Sidebar */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.aside
                            initial={{ x: 400, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 400, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="w-full sm:w-96 bg-card/50 dark:bg-black/30 backdrop-blur-xl border-l border-border dark:border-white/5 flex flex-col"
                        >
                            {/* Sidebar Tabs */}
                            <div className="flex border-b border-border dark:border-white/5">
                                <button
                                    onClick={() => setActiveTab('info')}
                                    className={`flex-1 px-4 py-4 text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'info' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Info
                                </button>
                                <button
                                    onClick={() => setActiveTab('notes')}
                                    className={`flex-1 px-4 py-4 text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'notes' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Notes
                                </button>
                                <button
                                    onClick={() => setActiveTab('chat')}
                                    className={`flex-1 px-4 py-4 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === 'chat' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Chat
                                    {messages.length > 0 && activeTab !== 'chat' && (
                                        <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                                    )}
                                </button>
                            </div>

                            {/* Sidebar Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {activeTab === 'info' && (
                                    <div className="space-y-6">
                                        {/* Mentor Profile Summary */}
                                        <div className="p-6 rounded-2xl bg-muted/30 dark:bg-white/5 border border-border dark:border-white/5">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-cyan-500 p-0.5">
                                                    <div className="w-full h-full rounded-[0.9rem] overflow-hidden border-2 border-background">
                                                        <ImageWithFallback
                                                            src={mentor?.image || ''}
                                                            alt={mentor?.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-lg tracking-tight">{mentor?.name || 'Mentor Name'}</h3>
                                                    <p className="text-sm text-muted-foreground font-medium">{mentor?.title || 'Expert Mentor'}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {(mentor?.skills || ['React', 'Node.js', 'AWS']).slice(0, 3).map((skill, i) => (
                                                    <span key={i} className="text-xs px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Session Info */}
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Session Details</h4>
                                            <div className="p-4 rounded-xl bg-muted/30 dark:bg-white/5 border border-border dark:border-white/5 flex justify-between items-center">
                                                <span className="text-sm font-medium text-muted-foreground">Duration</span>
                                                <span className="text-sm font-bold">{formatTime(sessionDuration)}</span>
                                            </div>
                                            <div className="p-4 rounded-xl bg-muted/30 dark:bg-white/5 border border-border dark:border-white/5 flex justify-between items-center">
                                                <span className="text-sm font-medium text-muted-foreground">Type</span>
                                                <span className="text-sm font-bold text-primary">Live Session</span>
                                            </div>
                                            <div className="p-4 rounded-xl bg-muted/30 dark:bg-white/5 border border-border dark:border-white/5 flex justify-between items-center">
                                                <span className="text-sm font-medium text-muted-foreground">Status</span>
                                                <span className={`text-sm font-bold ${statusConfig.color}`}>{statusConfig.text}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'notes' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Session Notes</h4>
                                            <div className="flex items-center gap-3">
                                                {isSavingNotes && (
                                                    <div className="flex items-center gap-2 text-xs text-primary">
                                                        <Save className="w-3 h-3 animate-pulse" />
                                                        <span className="font-bold">Saving...</span>
                                                    </div>
                                                )}
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={handleDownloadNotes}
                                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary text-xs font-bold transition-all"
                                                    aria-label="Download notes as PDF"
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                    <span>PDF</span>
                                                </motion.button>
                                            </div>
                                        </div>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Take notes during the session..."
                                            className="w-full h-96 p-4 rounded-xl bg-muted/30 dark:bg-white/5 border border-border dark:border-white/5 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none resize-none text-sm font-medium transition-all"
                                        />
                                        <p className="text-xs text-muted-foreground font-medium">Notes are auto-saved to localStorage</p>
                                    </div>
                                )}

                                {activeTab === 'chat' && (
                                    <div className="flex flex-col h-full -m-6">
                                        {/* Messages */}
                                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                            {messages.map((msg) => (
                                                <div
                                                    key={msg.id}
                                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div className={`max-w-[80%] ${msg.sender === 'mentor' ? 'bg-primary/10 border-primary/20' : 'bg-muted/30 dark:bg-white/5 border-border dark:border-white/5'} border rounded-2xl px-4 py-3`}>
                                                        <p className="text-sm font-medium mb-1">{msg.text}</p>
                                                        <p className="text-xs text-muted-foreground font-bold">{msg.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            <div ref={chatEndRef} />
                                        </div>

                                        {/* Message Input */}
                                        <div className="p-4 border-t border-border dark:border-white/5 bg-card/50 dark:bg-black/20">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                    placeholder="Type a message..."
                                                    className="flex-1 px-4 py-3 rounded-xl bg-muted/30 dark:bg-white/5 border border-border dark:border-white/5 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium transition-all"
                                                />
                                                <button
                                                    onClick={handleSendMessage}
                                                    className="w-12 h-12 rounded-xl bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
                                                    aria-label="Send message"
                                                >
                                                    <Send className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* Sidebar Toggle (Mobile/Tablet) */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute top-1/2 right-0 -translate-y-1/2 w-8 h-16 bg-card/50 dark:bg-black/30 backdrop-blur-xl border border-r-0 border-border dark:border-white/5 rounded-l-xl flex items-center justify-center hover:bg-card dark:hover:bg-white/5 transition-all z-20"
                    aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                >
                    {isSidebarOpen ? (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    ) : (
                        <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                    )}
                </button>
            </div>

            {/* Bottom Control Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-24 flex items-center justify-center px-6 bg-card/50 dark:bg-black/30 backdrop-blur-xl border-t border-border dark:border-white/5 z-30">
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Mute/Unmute */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsMuted(!isMuted)}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${isMuted ? 'bg-red-500 text-white' : 'bg-muted/50 dark:bg-white/10 text-foreground hover:bg-muted dark:hover:bg-white/20'}`}
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </motion.button>

                    {/* Camera On/Off */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsCameraOff(!isCameraOff)}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${isCameraOff ? 'bg-red-500 text-white' : 'bg-muted/50 dark:bg-white/10 text-foreground hover:bg-muted dark:hover:bg-white/20'}`}
                        aria-label={isCameraOff ? 'Turn camera on' : 'Turn camera off'}
                    >
                        {isCameraOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                    </motion.button>

                    {/* Screen Share */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsScreenSharing(!isScreenSharing)}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${isScreenSharing ? 'bg-primary text-primary-foreground' : 'bg-muted/50 dark:bg-white/10 text-foreground hover:bg-muted dark:hover:bg-white/20'}`}
                        aria-label="Screen share"
                    >
                        <MonitorUp className="w-6 h-6" />
                    </motion.button>

                    {/* Chat Toggle */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setIsSidebarOpen(true);
                            setActiveTab('chat');
                        }}
                        className="w-14 h-14 rounded-full bg-muted/50 dark:bg-white/10 text-foreground hover:bg-muted dark:hover:bg-white/20 flex items-center justify-center transition-all shadow-lg relative"
                        aria-label="Open chat"
                    >
                        <MessageSquare className="w-6 h-6" />
                        {messages.length > 0 && activeTab !== 'chat' && (
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-background" />
                        )}
                    </motion.button>

                    {/* End Session */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleEndSession}
                        className="w-14 h-14 rounded-full bg-red-500 text-white hover:bg-red-600 flex items-center justify-center transition-all shadow-lg shadow-red-500/20"
                        aria-label="End session"
                    >
                        <PhoneOff className="w-6 h-6" />
                    </motion.button>
                </div>
            </div>

            {/* Status Overlays */}
            <AnimatePresence>
                {(connectionStatus === 'waiting' || connectionStatus === 'connecting') && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-40"
                    >
                        <div className="text-center space-y-6 p-8">
                            <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin" />
                            <div>
                                <h3 className="text-2xl font-black mb-2">{statusConfig.text}</h3>
                                <p className="text-sm text-muted-foreground font-medium">Please wait while we connect you...</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {connectionStatus === 'ended' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-40"
                    >
                        <div className="text-center space-y-6 p-8 max-w-md">
                            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black mb-3">Session Ended</h3>
                                <p className="text-muted-foreground font-medium mb-6">
                                    Thank you for attending! Your session lasted {formatTime(sessionDuration)}.
                                </p>
                                <button
                                    onClick={onBack}
                                    className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:scale-105 transition-transform"
                                >
                                    Return to Dashboard
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Poor Connection Warning Banner */}
            <AnimatePresence>
                {connectionStatus === 'poor' && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        className="absolute top-20 left-1/2 -translate-x-1/2 z-40 px-6 py-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 backdrop-blur-xl flex items-center gap-3"
                    >
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        <p className="text-sm font-bold text-orange-500">Poor connection detected</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Keyboard Shortcuts Hint (Hidden, for accessibility) */}
            <div className="sr-only" aria-live="polite">
                Press M to toggle mute, C to toggle camera, E to end session
            </div>
        </motion.div>
    );
}
