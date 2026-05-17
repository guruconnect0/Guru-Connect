import { motion } from 'motion/react';
import { ArrowRight, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThreeDParticleNetwork } from './3DParticleNetwork';

export function Hero({ onGetStarted, onExploreMentors }) {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* 3D Particle Network */}
      <ThreeDParticleNetwork />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none z-10" />

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">
                Premium Mentorship Platform
              </span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.1] tracking-tight"
          >
            Connect with <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Verified Mentors
            </span>
            <br />
            <span className="text-foreground">Learn Faster.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Book live 1:1 demo and paid mentoring sessions with industry experts.
            Start learning from the best today.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 w-full"
          >
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Button size="lg" onClick={onGetStarted} className="w-full sm:w-auto h-12 gap-3 px-8">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Button size="lg" variant="outline" onClick={onExploreMentors} className="w-full sm:w-auto h-12 px-8">
                Explore Mentors
              </Button>
            </motion.div>
          </motion.div>

          {/* Floating Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto"
          >
            <FloatingCard icon={Clock} title="Demo Session" subtitle="Try before you buy" delay={0.1} />
            <FloatingCard icon={CheckCircle2} title="Verified Mentor" subtitle="Industry experts" delay={0.2} />
            <FloatingCard icon={Sparkles} title="Real-time Booking" subtitle="Instant confirmation" delay={0.3} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FloatingCard({ icon: Icon, title, subtitle, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 + delay }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="w-full"
    >
      <Card className="p-6 sm:p-8 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50 transition-all duration-300">
        <CardContent className="p-0 flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-bold text-foreground mb-1 uppercase tracking-tight text-sm">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}