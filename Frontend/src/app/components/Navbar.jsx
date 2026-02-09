import { Moon, Sun, LogOut, Calendar, Search, MessageSquare, User, DollarSign, BookOpen, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'motion/react';

export function Navbar({ onLoginClick, onNavigate, currentView, userRole, onLogout }) {
  const { theme, toggleTheme } = useTheme();

  const handleNavClick = (view, sectionId) => {
    if (view === 'home' && sectionId) {
      if (currentView !== 'home') {
        onNavigate('home');
        // Wait for re-render before scrolling
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      onNavigate(view);
    }
  };

  const isDashboard = currentView === 'dashboard';

  const navItems = {
    home: [
      { label: 'Home', view: 'home', sectionId: null },
      { label: 'Mentors', view: 'home', sectionId: 'mentors' },
      { label: 'How it Works', view: 'home', sectionId: 'how-it-works' },
      { label: 'About', view: 'about', sectionId: null },
      { label: 'Contact', view: 'contact', sectionId: null },
    ],
    candidate: [
      { label: 'Sessions', icon: Calendar, view: 'dashboard' },
      { label: 'Explore', icon: Search, view: 'dashboard' },
      { label: 'Messages', icon: MessageSquare, view: 'dashboard' },
      { label: 'Profile', icon: User, view: 'profile' },
    ],
    mentor: [
      { label: 'Schedule', icon: Calendar, view: 'dashboard' },
      { label: 'Earnings', icon: DollarSign, view: 'dashboard' },
      { label: 'Students', icon: BookOpen, view: 'dashboard' },
      { label: 'Profile', icon: User, view: 'profile' },
    ]
  };

  const currentNavItems = isDashboard ? (userRole === 'mentor' ? navItems.mentor : navItems.candidate) : navItems.home;

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div
          className="relative overflow-hidden rounded-2xl px-6 py-4 bg-card dark:bg-[var(--glass-bg)] backdrop-blur-2xl border border-border dark:border-[var(--glass-border)] shadow-md dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => handleNavClick('home')}
            >
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                <span className="text-primary-foreground font-black text-lg">G</span>
              </div>
              <span className="text-xl font-black tracking-tight text-foreground">Guru<span className="text-primary">Connect</span></span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {!isDashboard ? (
                currentNavItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.view, item.sectionId)}
                    className={`transition-colors hover:text-foreground text-sm font-medium ${currentView === item.view && !item.sectionId ? 'text-[var(--electric-blue)]' : 'text-foreground/80'}`}
                  >
                    {item.label}
                  </button>
                ))
              ) : (
                <>
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-[var(--electric-blue)] text-sm font-medium border border-[var(--electric-blue)]/20"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </button>
                  <div className="w-px h-6 bg-white/10 mx-2" />
                  {currentNavItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        if (item.view === 'profile') {
                          onNavigate(userRole === 'mentor' ? 'mentor-profile' : 'candidate-profile');
                        } else {
                          onNavigate(item.view);
                        }
                      }}
                      className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5"
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  ))}
                </>
              )}
            </div>

            {/* Right side - Theme Toggle & Auth */}
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-[var(--electric-blue)]" />
                ) : (
                  <Moon className="w-5 h-5 text-[var(--electric-blue)]" />
                )}
              </motion.button>

              {isDashboard ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/50 text-foreground/80 hover:text-rose-500 transition-all text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onLoginClick}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[var(--electric-blue)] to-[var(--cyan)] text-black font-medium hover:shadow-lg hover:shadow-[var(--electric-blue)]/20 transition-all"
                >
                  Login
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
