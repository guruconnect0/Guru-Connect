import { motion } from 'motion/react';
import { UserPlus, Calendar, Video, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Sign Up',
    description: 'Create your free account in seconds. Set up your profile and learning goals.',
    step: '01',
  },
  {
    icon: Calendar,
    title: 'Book Demo Session',
    description: 'Browse verified mentors and schedule a free demo session that fits your schedule.',
    step: '02',
  },
  {
    icon: Video,
    title: 'Join Live Call',
    description: 'Meet your mentor in a live video session. Discuss your goals and learning path.',
    step: '03',
  },
  {
    icon: TrendingUp,
    title: 'Upgrade & Learn',
    description: 'Enjoyed the demo? Upgrade to paid sessions and accelerate your learning journey.',
    step: '04',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-32 px-6 overflow-hidden">
      {/* Background elements */}
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'var(--cyan)' }}
      />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Get started with GuruConnect in four simple steps
          </p>
        </motion.div>

        {/* Desktop Timeline */}
        <div className="hidden md:block relative">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--electric-blue)] to-[var(--cyan)] opacity-20" />

          <div className="grid grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <TimelineStep key={index} step={step} index={index} />
            ))}
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="md:hidden space-y-8">
          {steps.map((step, index) => (
            <MobileTimelineStep key={index} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineStep({ step, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative"
    >
      {/* Step number at top */}
      <div className="flex justify-center mb-6">
        <div
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--electric-blue)] to-[var(--cyan)] flex items-center justify-center shadow-lg shadow-[var(--electric-blue)]/30 relative z-10"
        >
          <span className="text-black font-bold text-xl">{step.step}</span>
        </div>
      </div>

      {/* Card */}
      <motion.div
        whileHover={{ y: -8 }}
        className="p-8 rounded-[2.5rem] bg-card dark:bg-white/5 border border-border dark:border-white/10 text-center shadow-lg dark:shadow-none transition-all hover:shadow-2xl hover:border-primary/20"
      >
        <step.icon className="w-12 h-12 text-primary dark:text-[var(--electric-blue)] mx-auto mb-6" />
        <h3 className="text-2xl font-black mb-3 tracking-tighter text-foreground">{step.title}</h3>
        <p className="text-sm font-medium text-muted-foreground leading-relaxed">{step.description}</p>
      </motion.div>

      {/* Connecting arrow (except for last item) */}
      {index < steps.length - 1 && (
        <div className="absolute top-8 left-full w-8 h-0.5 bg-gradient-to-r from-[var(--electric-blue)] to-[var(--cyan)] opacity-50 -translate-x-4" />
      )}
    </motion.div>
  );
}

function MobileTimelineStep({ step, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex gap-4"
    >
      {/* Step indicator */}
      <div className="flex flex-col items-center">
        <div
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--electric-blue)] to-[var(--cyan)] flex items-center justify-center shadow-lg shadow-[var(--electric-blue)]/30 flex-shrink-0"
        >
          <span className="text-black font-bold">{step.step}</span>
        </div>
        {index < steps.length - 1 && (
          <div className="w-0.5 h-full bg-gradient-to-b from-[var(--electric-blue)] to-[var(--cyan)] opacity-20 mt-2" />
        )}
      </div>

      {/* Content */}
      <div
        className="flex-1 p-8 rounded-[2.5rem] bg-card dark:bg-white/5 border border-border dark:border-white/10 shadow-lg dark:shadow-none"
      >
        <step.icon className="w-10 h-10 text-primary dark:text-[var(--electric-blue)] mb-4" />
        <h3 className="text-2xl font-black mb-2 tracking-tighter text-foreground">{step.title}</h3>
        <p className="text-sm font-medium text-muted-foreground leading-relaxed">{step.description}</p>
      </div>
    </motion.div>
  );
}
