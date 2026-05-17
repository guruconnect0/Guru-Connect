import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Github, Chrome, Users } from 'lucide-react';
import { useState, useEffect } from 'react';

export function AuthModal({ isOpen, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState('login');
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const checkHeight = () => {
      setIsCompact(window.innerHeight < 700);
    };
    checkHeight();
    window.addEventListener('resize', checkHeight);
    return () => window.removeEventListener('resize', checkHeight);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[440px] max-h-full flex flex-col"
            >
              <div
                className={`relative rounded-[2.5rem] bg-card border border-border dark:border-white/10 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${isCompact ? 'p-6 sm:p-8' : 'p-10'}`}
              >
                {/* Gradient background effect */}
                <div
                  className="absolute top-0 left-0 w-full h-32 opacity-10 dark:opacity-20 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, var(--electric-blue), var(--cyan))',
                  }}
                />

                {/* Close button */}
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className={`absolute rounded-xl hover:bg-muted dark:hover:bg-white/5 transition-all z-50 text-muted-foreground hover:text-foreground flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary outline-none ${isCompact ? 'top-4 right-4 w-10 h-10' : 'top-6 right-6 w-11 h-11'}`}
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Logo */}
                <div className={`relative z-10 flex items-center justify-center gap-3 transition-all ${isCompact ? 'mb-6' : 'mb-10'}`}>
                  <div className={`${isCompact ? 'w-10 h-10 rounded-xl' : 'w-12 h-12 rounded-2xl'} bg-primary flex items-center justify-center shadow-lg shadow-primary/20`}>
                    <span className="text-primary-foreground font-black text-xl">G</span>
                  </div>
                  <span className={`${isCompact ? 'text-2xl' : 'text-3xl'} font-black tracking-tighter text-foreground`}>GuruConnect</span>
                </div>

                {/* Tabs */}
                <div className={`relative z-10 flex gap-1 rounded-xl bg-muted/50 dark:bg-white/5 border border-border dark:border-white/5 shadow-inner transition-all ${isCompact ? 'mb-6 p-1.5' : 'mb-10 p-2'}`}>
                  <button
                    onClick={() => setActiveTab('login')}
                    className={`flex-1 rounded-lg font-black uppercase tracking-widest text-[10px] transition-all ${isCompact ? 'py-2.5' : 'py-3.5'} ${activeTab === 'login'
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setActiveTab('signup')}
                    className={`flex-1 rounded-lg font-black uppercase tracking-widest text-[10px] transition-all ${isCompact ? 'py-2.5' : 'py-3.5'} ${activeTab === 'signup'
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Content Area */}
                <div className="relative z-10 flex-1 flex flex-col min-h-0">
                  <AnimatePresence mode="wait" initial={false}>
                    {activeTab === 'login' ? (
                      <LoginForm key="login" onSuccess={onSuccess} isCompact={isCompact} />
                    ) : (
                      <SignupForm key="signup" onSuccess={onSuccess} isCompact={isCompact} />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>

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
            .dark .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.1);
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(0, 0, 0, 0.1);
            }
            .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.2);
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}

function LoginForm({ onSuccess, isCompact }) {
  const [role, setRole] = useState('candidate');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess(role);
  };

  const inputHeight = isCompact ? 'h-[40px]' : 'h-[44px]';
  const spacing = isCompact ? 'space-y-4' : 'space-y-6';

  return (
    <motion.form
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2 }}
      onSubmit={handleSubmit}
      className={`flex-1 flex flex-col min-h-0 ${spacing}`}
    >
      <div className={`flex-1 overflow-y-auto custom-scrollbar pr-1 -mr-1 ${spacing}`}>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-muted-foreground ml-1">Role</label>
          <div className="relative group">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`w-full ${inputHeight} pl-11 pr-10 rounded-xl bg-muted/50 dark:bg-white/5 border border-transparent focus:border-primary/50 focus:bg-background outline-none transition-all appearance-none cursor-pointer font-bold text-sm text-foreground`}
            >
              <option value="candidate" className="bg-background text-foreground">Candidate</option>
              <option value="mentor" className="bg-background text-foreground">Mentor</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-muted-foreground ml-1">Email</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="email"
              placeholder="you@example.com"
              required
              className={`w-full ${inputHeight} pl-11 pr-4 rounded-xl bg-muted/50 dark:bg-white/5 border border-transparent focus:border-primary/50 focus:bg-background outline-none transition-all font-bold text-sm text-foreground placeholder:text-muted-foreground/30`}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Password</label>
            <button type="button" className="text-[9px] font-black text-primary hover:text-primary/80 transition-colors uppercase tracking-widest">
              Forgot?
            </button>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="password"
              placeholder="••••••••"
              required
              className={`w-full ${inputHeight} pl-11 pr-4 rounded-xl bg-muted/50 dark:bg-white/5 border border-transparent focus:border-primary/50 focus:bg-background outline-none transition-all font-bold text-sm text-foreground placeholder:text-muted-foreground/30`}
            />
          </div>
        </div>

        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded-md border border-border bg-muted/50 text-primary focus:ring-primary/20 transition-all cursor-pointer" />
            <span className="text-[11px] font-bold text-muted-foreground group-hover:text-foreground transition-colors">Remember me</span>
          </label>
        </div>

        {/* Divider */}
        <div className={`relative transition-all ${isCompact ? 'my-5' : 'my-8'}`}>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border dark:border-white/10" />
          </div>
          <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]">
            <span className="px-3 bg-card text-muted-foreground font-bold">Social Access</span>
          </div>
        </div>

        {/* Social Login */}
        <div className={`grid grid-cols-2 gap-3 transition-all ${isCompact ? 'mb-2' : 'mb-4'}`}>
          <button
            type="button"
            className={`flex items-center justify-center gap-2 rounded-xl border border-border dark:border-white/10 hover:border-primary/50 hover:bg-muted/50 dark:hover:bg-white/5 transition-all group ${isCompact ? 'h-10' : 'h-12'}`}
          >
            <Chrome className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground">Google</span>
          </button>
          <button
            type="button"
            className={`flex items-center justify-center gap-2 rounded-xl border border-border dark:border-white/10 hover:border-primary/50 hover:bg-muted/50 dark:hover:bg-white/5 transition-all group ${isCompact ? 'h-10' : 'h-12'}`}
          >
            <Github className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground">GitHub</span>
          </button>
        </div>
      </div>

      <div className={`${isCompact ? 'pt-4' : 'pt-6'}`}>
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className={`w-full ${isCompact ? 'h-12' : 'h-[48px]'} rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:shadow-xl transition-all text-xs`}
        >
          Login
        </motion.button>
      </div>
    </motion.form>
  );
}

function SignupForm({ onSuccess, isCompact }) {
  const [role, setRole] = useState('candidate');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess(role);
  };

  const inputHeight = isCompact ? 'h-[40px]' : 'h-[44px]';
  const spacing = isCompact ? 'space-y-3' : 'space-y-5';

  return (
    <motion.form
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      onSubmit={handleSubmit}
      className={`flex-1 flex flex-col min-h-0 ${spacing}`}
    >
      <div className={`flex-1 overflow-y-auto custom-scrollbar pr-1 -mr-1 ${spacing}`}>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div className="sm:col-span-3">
            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-muted-foreground ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="John Doe"
                required
                className={`w-full ${inputHeight} pl-11 pr-4 rounded-xl bg-muted/50 dark:bg-white/5 border border-transparent focus:border-primary/50 focus:bg-background outline-none transition-all font-bold text-sm text-foreground placeholder:text-muted-foreground/30`}
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-muted-foreground ml-1">Role</label>
            <div className="relative group">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={`w-full ${inputHeight} pl-11 pr-9 rounded-xl bg-muted/50 dark:bg-white/5 border border-transparent focus:border-primary/50 focus:bg-background outline-none transition-all appearance-none cursor-pointer font-bold text-[13px] text-foreground`}
              >
                <option value="candidate" className="bg-background text-foreground">Student</option>
                <option value="mentor" className="bg-background text-foreground">Mentor</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-muted-foreground ml-1">Email</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="email"
              placeholder="you@example.com"
              required
              className={`w-full ${inputHeight} pl-11 pr-4 rounded-xl bg-muted/50 dark:bg-white/5 border border-transparent focus:border-primary/50 focus:bg-background outline-none transition-all font-bold text-sm text-foreground placeholder:text-muted-foreground/30`}
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-muted-foreground ml-1">Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="password"
              placeholder="••••••••"
              required
              className={`w-full ${inputHeight} pl-11 pr-4 rounded-xl bg-muted/50 dark:bg-white/5 border border-transparent focus:border-primary/50 focus:bg-background outline-none transition-all font-bold text-sm text-foreground placeholder:text-muted-foreground/30`}
            />
          </div>
        </div>

        <div className="text-[10px] font-bold text-muted-foreground leading-snug px-1">
          By joining, you agree to our{' '}
          <button type="button" className="text-primary hover:underline font-black outline-none">Terms</button>
          {' '} & {' '}
          <button type="button" className="text-primary hover:underline font-black outline-none">Privacy Policy</button>
        </div>

        {/* Divider */}
        <div className={`relative transition-all ${isCompact ? 'my-5' : 'my-8'}`}>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border dark:border-white/10" />
          </div>
          <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]">
            <span className="px-3 bg-card text-muted-foreground font-bold">Social Access</span>
          </div>
        </div>

        {/* Social Login */}
        <div className={`grid grid-cols-2 gap-3 transition-all ${isCompact ? 'mb-2' : 'mb-4'}`}>
          <button
            type="button"
            className={`flex items-center justify-center gap-2 rounded-xl border border-border dark:border-white/10 hover:border-primary/50 hover:bg-muted/50 dark:hover:bg-white/5 transition-all group ${isCompact ? 'h-10' : 'h-12'}`}
          >
            <Chrome className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground">Google</span>
          </button>
          <button
            type="button"
            className={`flex items-center justify-center gap-2 rounded-xl border border-border dark:border-white/10 hover:border-primary/50 hover:bg-muted/50 dark:hover:bg-white/5 transition-all group ${isCompact ? 'h-10' : 'h-12'}`}
          >
            <Github className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground">GitHub</span>
          </button>
        </div>
      </div>

      <div className={`${isCompact ? 'pt-4' : 'pt-6'}`}>
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className={`w-full ${isCompact ? 'h-12' : 'h-[48px]'} rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:shadow-xl transition-all text-xs`}
        >
          Create Account
        </motion.button>
      </div>
    </motion.form>
  );
}
