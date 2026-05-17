import { motion } from 'motion/react';
import { ArrowRight, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function Hero({ onGetStarted, onExploreMentors }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    const particles = [];

    // Create particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      });
    }

    // Animation loop
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = ctx.canvas.classList.contains('dark') ? 'rgba(0, 212, 255, 0.4)' : 'rgba(0, 186, 226, 0.2)';
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = ctx.canvas.classList.contains('dark')
              ? `rgba(0, 212, 255, ${0.15 * (1 - distance / 120)})`
              : `rgba(0, 186, 226, ${0.1 * (1 - distance / 120)})`;
            ctx.lineWidth = 1;
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

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Animated Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full dark:opacity-60 opacity-40"
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20 dark:opacity-20 pointer-events-none"
        style={{ background: 'var(--electric-blue)' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20 dark:opacity-20 pointer-events-none"
        style={{ background: 'var(--cyan)' }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <div className="p-1 px-3 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
              Premium Mentorship Platform
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-6xl md:text-8xl font-black mb-6 leading-[0.9] tracking-tighter"
        >
          Connect with <br />
          <span
            className="bg-gradient-to-r from-[var(--electric-blue)] to-[var(--cyan)] bg-clip-text text-transparent"
          >
            Verified Mentors
          </span>
          <br />
          Learn Faster.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium"
        >
          Book live 1:1 demo and paid mentoring sessions with industry experts.
          Start learning from the best today.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGetStarted}
            className="group px-10 py-5 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onExploreMentors}
            className="px-10 py-5 rounded-2xl border-2 border-border hover:border-primary/50 text-foreground font-black uppercase tracking-widest bg-card shadow-lg hover:shadow-xl transition-all backdrop-blur-sm"
          >
            Explore Mentors
          </motion.button>
        </motion.div>

        {/* Floating Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <FloatingCard icon={Clock} title="Demo Session" subtitle="Try before you buy" delay={0.1} />
          <FloatingCard icon={CheckCircle2} title="Verified Mentor" subtitle="Industry experts" delay={0.2} />
          <FloatingCard icon={Sparkles} title="Real-time Booking" subtitle="Instant confirmation" delay={0.3} />
        </motion.div>
      </div>
    </section>
  );
}

function FloatingCard({
  icon: Icon,
  title,
  subtitle,
  delay,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 + delay }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="p-8 rounded-[2rem] bg-card dark:bg-[var(--glass-bg)] border border-border dark:border-[var(--glass-border)] shadow-md hover:shadow-2xl transition-all duration-300"
    >
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-black text-foreground mb-1 uppercase tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground font-medium">{subtitle}</p>
    </motion.div>
  );
}
