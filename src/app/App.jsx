import { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { MentorShowcase } from './components/MentorShowcase';
import { CTASection } from './components/CTASection';
import { AuthModal } from './components/AuthModal';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { CandidateDashboard } from './components/CandidateDashboard';
import { MentorDashboard } from './components/MentorDashboard';
import { MentorProfile } from './components/MentorProfile';
import { CandidateProfile } from './components/CandidateProfile';
import { DemoSession } from './components/DemoSession';
import { MentorProfileModal } from './components/MentorProfileModal';
import { CandidateProfileModal } from './components/CandidateProfileModal';
import { BookingModal } from './components/BookingModal';

export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'about', 'contact', 'dashboard', or 'mentor-profile'
  const [userRole, setUserRole] = useState('candidate'); // 'candidate' or 'mentor'
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingType, setBookingType] = useState('paid');

  const handleAuthSuccess = (role) => {
    setUserRole(role);
    setCurrentView('dashboard');
    setIsAuthModalOpen(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const handleGetStarted = () => {
    setIsAuthModalOpen(true);
  };

  const handleExploreMentors = () => {
    if (currentView !== 'home') {
      setCurrentView('home');
      // Wait for re-render before scrolling
      setTimeout(() => {
        const mentorsSection = document.getElementById('mentors');
        if (mentorsSection) {
          mentorsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const mentorsSection = document.getElementById('mentors');
      if (mentorsSection) {
        mentorsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleMentorClick = (mentor) => {
    setSelectedMentor(mentor);
    setIsMentorModalOpen(true);
  };

  const handleBookDemo = (mentor) => {
    if (userRole === 'candidate') {
      setSelectedMentor(mentor || selectedMentor);
      setCurrentView('demo-session');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleLogout = () => {
    setCurrentView('home');
    setUserRole('candidate'); // Reset to default or keep it
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden transition-colors duration-300">
        <Navbar
          onLoginClick={handleGetStarted}
          onNavigate={handleViewChange}
          currentView={currentView}
          userRole={userRole}
          onLogout={handleLogout}
        />

        <main className="transition-opacity duration-500">
          {currentView === 'home' ? (
            <>
              <Hero
                onGetStarted={handleGetStarted}
                onExploreMentors={handleExploreMentors}
              />
              <Features />
              <HowItWorks />
              <div id="mentors">
                <MentorShowcase onBookDemo={handleGetStarted} />
              </div>
              <CTASection onCreateAccount={handleGetStarted} />
            </>
          ) : currentView === 'about' ? (
            <About />
          ) : currentView === 'contact' ? (
            <Contact />
          ) : currentView === 'mentor-profile' ? (
            <MentorProfile
              mentor={selectedMentor}
              isOwnProfile={userRole === 'mentor' && (!selectedMentor || selectedMentor.isOwn)}
              onBack={() => userRole === 'mentor' ? setCurrentView('dashboard') : setCurrentView('home')}
              onBookDemo={handleBookDemo}
            />
          ) : currentView === 'demo-session' ? (
            <DemoSession
              mentor={selectedMentor}
              user={userRole === 'candidate' ? { name: 'Alex Rivera', role: 'candidate' } : null}
              onBack={() => setCurrentView('mentor-profile')}
            />
          ) : currentView === 'candidate-profile' ? (
            <CandidateProfile
              onBack={() => setCurrentView('dashboard')}
            />
          ) : userRole === 'candidate' ? (
            <CandidateDashboard onMentorClick={handleMentorClick} />
          ) : (
            <MentorDashboard
              onStudentClick={(student) => {
                setSelectedCandidate(student);
                setIsCandidateModalOpen(true);
              }}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="relative border-t border-border dark:border-white/10 py-16 px-6 bg-card/30 transition-colors duration-300">
          <div className="max-w-7xl mx-auto text-center">
            <div
              className="flex items-center justify-center gap-3 mb-6 cursor-pointer group"
              onClick={() => setCurrentView('home')}
            >
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                <span className="text-primary-foreground font-black text-xl">G</span>
              </div>
              <span className="text-2xl font-black tracking-tight text-foreground">Guru<span className="text-primary">Connect</span></span>
            </div>
            <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto font-medium">
              Premium mentorship platform connecting learners with the world's best industry experts.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-bold uppercase tracking-widest">
              <button
                onClick={() => setCurrentView('about')}
                className={`transition-colors hover:text-primary ${currentView === 'about' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                About
              </button>
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`transition-colors hover:text-primary ${currentView === 'dashboard' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Dashboard
              </button>
              <button className="text-muted-foreground hover:text-primary transition-colors">Privacy</button>
              <button className="text-muted-foreground hover:text-primary transition-colors">Terms</button>
              <button
                onClick={() => setCurrentView('contact')}
                className={`transition-colors hover:text-primary ${currentView === 'contact' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Contact
              </button>
            </div>
            <div className="w-full h-px bg-border dark:bg-white/5 my-10 max-w-4xl mx-auto" />
            <p className="text-xs text-muted-foreground/60 font-medium">
              © 2026 GuruConnect. Build with precision and passion.
            </p>
          </div>
        </footer>

        {/* Auth, Profile, and Booking Modals */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />

        <MentorProfileModal
          mentor={selectedMentor}
          isOpen={isMentorModalOpen}
          onClose={() => setIsMentorModalOpen(false)}
          onBookDemo={(mentor) => {
            setIsMentorModalOpen(false);
            setSelectedMentor(mentor);
            setBookingType('demo');
            setIsBookingModalOpen(true);
          }}
          onBookPaid={(mentor) => {
            setIsMentorModalOpen(false);
            setSelectedMentor(mentor);
            setBookingType('paid');
            setIsBookingModalOpen(true);
          }}
        />

        <BookingModal
          mentor={selectedMentor}
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          initialType={bookingType}
          onBookingComplete={(data) => {
            console.log("Booking Complete:", data);
          }}
        />

        <CandidateProfileModal
          candidate={selectedCandidate}
          isOpen={isCandidateModalOpen}
          onClose={() => setIsCandidateModalOpen(false)}
          onChat={() => {
            setIsCandidateModalOpen(false);
          }}
        />
      </div>

      <style>{`
        * {
            transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </ThemeProvider>
  );
}
