import { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'sonner';
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
import { SessionRoom } from './components/SessionRoom';
import { VerificationEntry } from './components/VerificationEntry';
import { VerificationTest } from './components/VerificationTest';
import { VerificationResult } from './components/VerificationResult';
import { verificationTest, getQuestionsForSkills } from './data/verificationQuestions';

export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'about', 'contact', 'dashboard', 'mentor-profile', 'verification-entry', 'verification-test', 'verification-result'
  const [userRole, setUserRole] = useState('candidate'); // 'candidate' or 'mentor'
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingType, setBookingType] = useState('paid');
  const [isInSession, setIsInSession] = useState(false);

  // Verification state
  const [verificationStatus, setVerificationStatus] = useState('not-started');
  const [testResults, setTestResults] = useState(null);
  const [testAttempts, setTestAttempts] = useState(0);
  const MAX_ATTEMPTS = 2;

  const handleAuthSuccess = (role) => {
    setUserRole(role);
    setIsAuthModalOpen(false);

    if (role === 'mentor') {
      // Simulate new mentor with empty profile
      const newMentor = {
        name: 'New Mentor',
        title: '',
        company: '',
        email: 'mentor@example.com',
        phone: '',
        image: '',
        skills: [], // Empty skills initially
        bio: '',
        isVerified: false,
        verificationStatus: 'Not Started',
        accountStatus: 'Pending',
        joinedDate: 'Feb 2026',
        demoEnabled: false,
        breakBuffer: '15 min',
        currency: 'USD',
        stats: { total: 0, completed: 0, cancelled: 0, noShow: 0 },
        languages: [],
        experience: '1-3 years',
        rate: 0,
        sessions: 0,
        rating: 0
      };
      setCurrentUser(newMentor);
      setSelectedMentor(newMentor); // Use selectedMentor to display profile
      setCurrentView('mentor-profile'); // Redirect to profile
      // We will handle the "Force Edit" in MentorProfile via a prop or just defaulting
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleProfileUpdate = (updatedProfile) => {
    setCurrentUser(updatedProfile);
    setSelectedMentor(updatedProfile);
    // If skills are added, we could potentially show a notification here
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  useEffect(() => {
    const handleJoinSession = (event) => {
      const { mentor, session } = event.detail;
      setSelectedMentor(mentor);
      setCurrentView('session-room');
    };

    window.addEventListener('joinSession', handleJoinSession);
    return () => window.removeEventListener('joinSession', handleJoinSession);
  }, []);

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

  const handleBookDemo = (mentor, type = 'paid') => {
    setSelectedMentor(mentor);
    setBookingType(type);
    setIsBookingModalOpen(true);
  };

  const handleLogout = () => {
    setCurrentView('home');
    setUserRole('candidate');
    setCurrentUser(null);
  };

  // Verification handlers
  const handleStartTest = () => {
    setVerificationStatus('in-progress');
    setCurrentView('verification-test');
  };

  const currentQuestions = getQuestionsForSkills(currentUser?.skills || []);

  const handleTestSubmit = (results) => {
    // Calculate score
    let correctAnswers = 0;
    const questionsTaken = results.questions || currentQuestions || [];

    questionsTaken.forEach(question => {
      const userAnswer = results.answers[question.id];
      const correctOption = question.options.find(opt => opt.isCorrect);
      if (userAnswer === correctOption?.id) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / (questionsTaken.length || 1)) * 100;
    const passed = score >= verificationTest.passingScore;
    const newAttemptCount = testAttempts + 1;

    setTestAttempts(newAttemptCount);
    setTestResults({ score, passed, ...results, attempt: newAttemptCount });

    if (passed) {
      setVerificationStatus('approved');
      if (currentUser) {
        const updatedUser = { ...currentUser, isVerified: true, verificationStatus: 'Verified' };
        setCurrentUser(updatedUser);
        setSelectedMentor(updatedUser);
      }
    } else {
      if (newAttemptCount >= MAX_ATTEMPTS) {
        setVerificationStatus('permanently-rejected');
      } else {
        setVerificationStatus('rejected');
      }
    }

    setCurrentView('verification-result');
  };

  const handleActivateProfile = () => {
    setCurrentView('dashboard');
  };

  const handleRetake = () => {
    setCurrentView('dashboard');
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
              isOwnProfile={userRole === 'mentor' && (!selectedMentor || selectedMentor.email === currentUser?.email)} // Improved check
              onBack={() => userRole === 'mentor' ? setCurrentView('dashboard') : setCurrentView('home')}
              onBookDemo={handleBookDemo}
              onSaveProfile={handleProfileUpdate}
              startEditing={currentUser && currentUser.skills.length === 0} // Force edit if new
              onTakeVerification={handleStartTest}
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
          ) : currentView === 'session-room' ? (
            <SessionRoom
              mentor={selectedMentor}
              user={userRole === 'candidate' ? { name: 'Alex Rivera', role: 'candidate' } : null}
              onBack={() => setCurrentView('dashboard')}
              onEndSession={() => setCurrentView('dashboard')}
            />
          ) : currentView === 'verification-entry' ? (
            <VerificationEntry
              onStartTest={handleStartTest}
              verificationStatus={verificationStatus}
              attempts={testAttempts}
              maxAttempts={MAX_ATTEMPTS}
            />
          ) : currentView === 'verification-test' ? (
            <VerificationTest
              questions={currentQuestions}
              skills={currentUser?.skills || []}
              duration={verificationTest.duration}
              onSubmit={handleTestSubmit}
              onExit={() => setCurrentView('verification-entry')}
            />
          ) : currentView === 'verification-result' ? (
            <VerificationResult
              score={testResults?.score || 0}
              passed={testResults?.passed || false}
              onActivateProfile={handleActivateProfile}
              onRetake={handleRetake}
              retakeDate={verificationStatus === 'rejected' ? 'February 18, 2026' : null}
              attempt={testResults?.attempt || 0}
              maxAttempts={MAX_ATTEMPTS}
              status={verificationStatus}
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
      <Toaster position="top-center" richColors />

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
