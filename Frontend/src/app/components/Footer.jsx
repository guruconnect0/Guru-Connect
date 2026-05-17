import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

export function Footer({ onNavigate }) {
  return (
    <footer className="relative border-t border-border py-16 px-4 sm:px-6 lg:px-8 bg-card/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 mb-6 cursor-pointer group"
            onClick={() => onNavigate('home')}
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-primary-foreground font-black text-xl">G</span>
            </div>
            <span className="text-2xl font-black tracking-tight text-foreground">Guru<span className="text-primary">Connect</span></span>
          </motion.div>

          {/* Tagline */}
          <p className="text-sm text-muted-foreground mb-8 max-w-sm font-medium">
            Premium mentorship platform connecting learners with the world's best industry experts.
          </p>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-bold uppercase tracking-widest mb-8">
            <Button variant="ghost" size="sm" onClick={() => onNavigate('about')} className="text-muted-foreground hover:text-primary">
              About
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('dashboard')} className="text-muted-foreground hover:text-primary">
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary cursor-not-allowed">
              Privacy
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary cursor-not-allowed">
              Terms
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('contact')} className="text-muted-foreground hover:text-primary">
              Contact
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('admin-login')} className="text-muted-foreground hover:text-[#00CFE8]">
              Admin Portal
            </Button>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-border max-w-4xl mb-6" />

          {/* Copyright */}
          <p className="text-xs text-muted-foreground/60 font-medium">
            © 2026 GuruConnect. Build with precision and passion.
          </p>
        </div>
      </div>
    </footer>
  );
}