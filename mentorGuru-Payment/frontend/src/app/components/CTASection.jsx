import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CTASection({ onCreateAccount }) {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div
            className="relative p-12 md:p-20 rounded-[3rem] bg-card dark:transparent border border-border dark:border-white/10 overflow-hidden text-center shadow-2xl dark:shadow-none"
          >
            {/* Animated background gradient */}
            <div
              className="absolute inset-0 opacity-5 dark:opacity-20 translate-y-[-50%]"
              style={{
                background: 'radial-gradient(circle at 50% 0%, var(--primary), transparent 70%)',
              }}
            />

            {/* Decorative elements */}
            <div
              className="absolute top-0 left-0 w-80 h-80 rounded-full blur-[100px] opacity-[0.05] dark:opacity-20 pointer-events-none"
              style={{ background: 'var(--primary)' }}
            />
            <div
              className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-[100px] opacity-[0.05] dark:opacity-20 pointer-events-none"
              style={{ background: 'var(--cyan)' }}
            />

            {/* Content */}
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center justify-center gap-3 mb-8"
              >
                <Sparkles className="w-6 h-6 text-primary" />
                <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">
                  Ready to Lead?
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl md:text-7xl font-black mb-8 tracking-tighter"
              >
                Start your learning <br /> journey <span className="text-primary italic">today</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium leading-relaxed"
              >
                Join thousands of learners connecting with expert mentors. Your first demo session is free.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCreateAccount}
                className="group h-20 px-12 rounded-[2rem] bg-primary text-primary-foreground font-black text-xl flex items-center gap-4 mx-auto shadow-2xl shadow-primary/30 hover:shadow-primary/40 transition-all uppercase tracking-widest"
              >
                Create Account
                <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
              </motion.button>

              {/* Stats or social proof */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap items-center justify-center gap-12 mt-16"
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl font-black text-foreground">5K+</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Learners</span>
                </div>
                <div className="w-px h-8 bg-border hidden md:block" />
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl font-black text-foreground">500+</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Expert Mentors</span>
                </div>
                <div className="w-px h-8 bg-border hidden md:block" />
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl font-black text-foreground">10K+</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sessions Done</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
