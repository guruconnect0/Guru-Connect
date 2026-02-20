import { motion } from 'motion/react';
import { Clock, ShieldCheck, Calendar, CreditCard } from 'lucide-react';

const features = [
  {
    icon: Clock,
    title: 'Free Demo Session',
    description: 'Try a short intro session before committing to paid mentorship. Get a feel for the mentor\'s teaching style.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Mentors',
    description: 'All mentors are verified with skill badges, ratings, and proven industry experience.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Calendar,
    title: 'Smart Booking System',
    description: 'Availability-based booking with no overlapping sessions. Schedule at your convenience.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'Pay only after your demo session. Automatic refunds on no-show. Your money is safe.',
    color: 'from-orange-500 to-red-500',
  },
];

export function Features() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background gradient orbs */}
      <div
        className="absolute top-1/4 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'var(--electric-blue)' }}
      />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose{' '}
            <span
              className="bg-gradient-to-r from-[var(--electric-blue)] to-[var(--cyan)] bg-clip-text"
              style={{ WebkitTextFillColor: 'transparent' }}
            >
              GuruConnect
            </span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Premium features designed for serious learners and expert mentors
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="relative group"
    >
      <div
        className="relative p-10 rounded-[2.5rem] bg-card dark:bg-white/5 border border-border dark:border-white/10 shadow-lg dark:shadow-none transition-all duration-300 overflow-hidden hover:shadow-2xl hover:border-primary/20"
      >
        {/* Hover gradient effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, var(--electric-blue), var(--cyan))`,
          }}
        />

        <div className="relative z-10">
          <div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-8 shadow-lg shadow-black/10`}
          >
            <feature.icon className="w-8 h-8 text-white" />
          </div>

          <h3 className="text-2xl font-black mb-4 tracking-tighter text-foreground">{feature.title}</h3>
          <p className="text-muted-foreground leading-relaxed font-medium">{feature.description}</p>
        </div>

        {/* Decorative corner accent */}
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-[0.03] dark:opacity-5"
          style={{ background: 'var(--electric-blue)' }}
        />
      </div>
    </motion.div>
  );
}
