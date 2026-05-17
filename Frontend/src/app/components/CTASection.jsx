import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function CTASection({ onCreateAccount }) {
  return (
    <section className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="relative p-8 sm:p-12 lg:p-16 overflow-hidden text-center border-border/50">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />
            <div className="absolute top-0 left-0 w-80 h-80 rounded-full blur-[100px] opacity-10 pointer-events-none bg-primary" />
            <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-[100px] opacity-10 pointer-events-none bg-primary" />

            <CardContent className="relative z-10 p-0 flex flex-col items-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center gap-3 mb-8"
              >
                <Sparkles className="w-6 h-6 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-[0.3em]">
                  Ready to Lead?
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 sm:mb-8 tracking-tight"
              >
                Start your learning <br />
                journey <span className="text-primary italic">today</span>
              </motion.h2>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-base sm:text-lg md:text-xl text-muted-foreground mb-10 sm:mb-12 max-w-2xl mx-auto leading-relaxed"
              >
                Join thousands of learners connecting with expert mentors. Your first demo session is free.
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Button size="xl" onClick={onCreateAccount} className="gap-3 sm:gap-4 mx-auto px-10 h-12">
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 mt-12 sm:mt-16"
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl sm:text-3xl font-bold text-foreground">5K+</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Learners</span>
                </div>
                <div className="w-px h-8 bg-border hidden md:block" />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl sm:text-3xl font-bold text-foreground">500+</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Expert Mentors</span>
                </div>
                <div className="w-px h-8 bg-border hidden md:block" />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl sm:text-3xl font-bold text-foreground">10K+</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sessions Done</span>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}