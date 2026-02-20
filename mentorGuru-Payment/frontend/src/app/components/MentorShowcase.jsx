import { motion } from 'motion/react';
import { Star, Clock, ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export const mentors = [
  {
    name: 'David Chen',
    title: 'Senior Software Engineer',
    company: 'Google',
    image: 'https://images.unsplash.com/photo-1631624220291-8f191fbdb543?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYWxlJTIwZGV2ZWxvcGVyfGVufDF8fHx8MTc3MDM5ODc3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.9,
    sessions: 127,
    rate: 80,
    skills: ['React', 'TypeScript', 'System Design'],
  },
  {
    name: 'Sarah Martinez',
    title: 'Lead Product Designer',
    company: 'Airbnb',
    image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBmZW1hbGUlMjBlbmdpbmVlcnxlbnwxfHx8fDE3NzAzOTg3NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 5.0,
    sessions: 203,
    rate: 90,
    skills: ['UI/UX', 'Figma', 'Design Systems'],
  },
  {
    name: 'Emily Wang',
    title: 'Data Scientist',
    company: 'Meta',
    image: 'https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBhc2lhbiUyMGJ1c2luZXNzJTIwd29tYW58ZW58MXx8fHwxNzcwMzk4Nzc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.8,
    sessions: 156,
    rate: 95,
    skills: ['Python', 'Machine Learning', 'SQL'],
  },
  {
    name: 'Marcus Johnson',
    title: 'DevOps Engineer',
    company: 'Amazon',
    image: 'https://images.unsplash.com/photo-1732154478254-f94aebec9501?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBibGFjayUyMGJ1c2luZXNzbWFufGVufDF8fHx8MTc3MDM5ODc3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.9,
    sessions: 189,
    rate: 85,
    skills: ['AWS', 'Docker', 'Kubernetes'],
  },
  {
    name: 'Carlos Rodriguez',
    title: 'Mobile Developer',
    company: 'Spotify',
    image: 'https://images.unsplash.com/photo-1697043667053-9f7798f19e74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoaXNwYW5pYyUyMG1hbnxlbnwxfHx8fDE3NzAyOTU0NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.7,
    sessions: 145,
    rate: 75,
    skills: ['React Native', 'iOS', 'Android'],
  },
  {
    name: 'Layla Hassan',
    title: 'Blockchain Engineer',
    company: 'Coinbase',
    image: 'https://images.unsplash.com/photo-1761765241312-a9e7c3d4ca9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtaWRkbGUlMjBlYXN0ZXJuJTIwd29tYW58ZW58MXx8fHwxNzcwMzU2NTY1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 5.0,
    sessions: 112,
    rate: 100,
    skills: ['Solidity', 'Web3', 'Smart Contracts'],
  },
];

export function MentorShowcase({ onBookDemo, onMentorClick }) {
  const scrollRef = useRef(null);

  return (
    <section id="mentors" className="relative py-32 px-6 overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'var(--cyan)' }}
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
            Meet Our{' '}
            <span
              className="bg-gradient-to-r from-[var(--electric-blue)] to-[var(--cyan)] bg-clip-text"
              style={{ WebkitTextFillColor: 'transparent' }}
            >
              Expert Mentors
            </span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Learn from verified industry professionals at top tech companies
          </p>
        </motion.div>

        {/* Horizontal Scroll Container */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-8 scroll-smooth snap-x snap-mandatory hide-scrollbar"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {mentors.map((mentor, index) => (
              <MentorCard
                key={mentor.name}
                mentor={mentor}
                index={index}
                onBookDemo={onBookDemo}
                onClick={() => onMentorClick?.(mentor)}
              />
            ))}
          </div>

          {/* Fade edges */}
          <>
            <div className="absolute left-0 top-0 bottom-8 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-8 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          </>
        </div>
      </div>
    </section>
  );
}

export function MentorCard({
  mentor,
  index,
  onBookDemo,
  onClick,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="flex-shrink-0 w-80 snap-center"
    >
      <div
        className="relative p-6 rounded-3xl border overflow-hidden group transition-all duration-300 bg-card dark:bg-[var(--glass-bg)] border-border dark:border-[var(--glass-border)] shadow-md dark:shadow-none hover:shadow-xl"
      >
        {/* Hover gradient effect - only for dark mode or subtle tint in light */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br from-[var(--electric-blue)] to-[var(--cyan)]"
        />

        <div className="relative z-10">
          {/* Mentor Image */}
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 shadow-sm">
            <ImageWithFallback
              src={mentor.image}
              alt={mentor.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent dark:block hidden" />

            {/* Rating Badge */}
            <div
              className="absolute top-3 right-3 px-3 py-1 rounded-lg backdrop-blur-md flex items-center gap-1 bg-black/50 dark:bg-black/50"
            >
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold text-white">{mentor.rating}</span>
            </div>
          </div>

          {/* Mentor Info */}
          <div className="cursor-pointer" onClick={onClick}>
            <h3 className="text-xl font-bold mb-1 text-foreground group-hover:text-[var(--electric-blue)] transition-colors">{mentor.name}</h3>
            <p className="text-sm text-muted-foreground mb-1 font-medium">{mentor.title}</p>
            <p className="text-sm text-[var(--electric-blue)] font-bold mb-4">{mentor.company}</p>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {mentor.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-[var(--electric-blue)]/10 dark:bg-[var(--electric-blue)]/10 border border-[var(--electric-blue)]/20 text-[var(--electric-blue)]"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Stats & Rate */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                <Clock className="w-4 h-4" />
                <span>{mentor.sessions} sessions</span>
              </div>
              <div className="text-lg font-black text-foreground dark:text-[var(--electric-blue)]">
                ${mentor.rate}/hr
              </div>
            </div>
          </div>

          {/* Book Demo Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBookDemo}
            className="w-full group/btn px-6 py-4 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            Book Demo
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
