import { motion } from 'motion/react';
import { UserPlus, Calendar, Video, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
    <section id="how-it-works" className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none bg-primary" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">How It Works</h2>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Get started with GuruConnect in four simple steps
          </p>
        </motion.div>

        {/* Desktop Timeline */}
        <div className="hidden md:block">
          <div className="relative">
            <div className="absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-primary/60 opacity-20" />
            
            <div className="grid grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <TimelineStep key={index} step={step} index={index} />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="md:hidden space-y-6">
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
      className="relative flex flex-col items-center"
    >
      {/* Step Number */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/30 relative z-10 mb-6">
        <span className="text-white font-bold text-xl">{step.step}</span>
      </div>

      {/* Card */}
      <motion.div whileHover={{ y: -4 }}>
        <Card className="p-6 lg:p-8 text-center hover:shadow-xl hover:-translate-y-1 hover:border-primary/50 transition-all duration-300">
          <CardContent className="p-0">
            <step.icon className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="text-lg lg:text-xl font-bold mb-3 tracking-tight text-foreground">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Connector */}
      {index < steps.length - 1 && (
        <div className="absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary to-primary/60 opacity-50 -translate-y-2" style={{ left: '50%' }} />
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
      className="flex items-start gap-4"
    >
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/30">
          <span className="text-white font-bold">{step.step}</span>
        </div>
        {index < steps.length - 1 && (
          <div className="w-0.5 h-16 bg-gradient-to-b from-primary to-primary/60 opacity-20 mt-2" />
        )}
      </div>

      <Card className="flex-1 p-5 sm:p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <CardContent className="p-0">
          <step.icon className="w-8 h-8 text-primary mb-3" />
          <h3 className="text-lg font-bold mb-2 tracking-tight text-foreground">{step.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}