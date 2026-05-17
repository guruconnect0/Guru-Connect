import { motion } from 'motion/react';
import { Clock, ShieldCheck, Calendar, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: Clock,
    title: 'Free Demo Session',
    description: 'Try a short intro session before committing to paid mentorship. Get a feel for the mentor\'s teaching style.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Mentors',
    description: 'All mentors are verified with skill badges, ratings, and proven industry experience.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Calendar,
    title: 'Smart Booking System',
    description: 'Availability-based booking with no overlapping sessions. Schedule at your convenience.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'Pay only after your demo session. Automatic refunds on no-show. Your money is safe.',
    gradient: 'from-orange-500 to-red-500',
  },
];

export function Features() {
  return (
    <section className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none bg-primary" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              GuruConnect
            </span>
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Premium features designed for serious learners and expert mentors
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card className="h-full p-6 lg:p-8 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50 transition-all duration-300">
        <CardHeader className="p-0 mb-6">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}>
            <feature.icon className="w-6 h-6 text-white" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <CardTitle className="text-lg lg:text-xl mb-3 tracking-tight">{feature.title}</CardTitle>
          <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}