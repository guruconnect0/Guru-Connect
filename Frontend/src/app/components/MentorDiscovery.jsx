import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Star, ArrowRight, Search, X, Sparkles, TrendingUp, Zap, Lightbulb, ArrowLeft, PanelLeftClose, PanelLeft, Compass, Calendar, History, Settings, HelpCircle } from 'lucide-react';
import { searchMentors } from '../services/api';
import { ImageWithFallback } from './figma/ImageWithFallback';
import useAuthStore from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function MentorDiscovery({ onBookDemo, onMentorClick, onBack, onNavigate }) {
  const { user, candidateProfile, logout } = useAuthStore();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const response = await searchMentors({});
        const mentorData = response.data.mentors || [];
        setMentors(mentorData.map(m => ({
          _id: m._id,
          name: m.userId?.name || 'Anonymous Mentor',
          title: m.title || 'Mentor',
          company: m.company || 'Independent',
          image: m.profileImage || '',
          rating: m.averageRating || 0,
          sessions: m.completedSessions || 0,
          rate: m.hourlyRate || 500,
          skills: m.skills || [],
        })));
      } catch (err) {
        console.error('Failed to fetch mentors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, []);

  const allSkills = useMemo(() => {
    const skills = [...new Set(mentors.flatMap(m => m.skills))];
    return skills.slice(0, 12);
  }, [mentors]);

  const sortedMentors = useMemo(() => {
    let filtered = mentors.filter(mentor => {
      const matchesSearch = !searchQuery || 
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        mentor.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSkills = selectedSkills.length === 0 || 
        selectedSkills.every(s => mentor.skills.includes(s));
      return matchesSearch && matchesSkills;
    });

    if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.rate - b.rate);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.rate - a.rate);
    } else if (sortBy === 'sessions') {
      filtered.sort((a, b) => b.sessions - a.sessions);
    }

    return filtered;
  }, [mentors, searchQuery, sortBy, selectedSkills]);

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const trendingSkills = ['React', 'Python', 'Node.js', 'AWS', 'TypeScript', 'System Design'];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* LEFT SIDEBAR */}
      <aside className={`${leftSidebarOpen ? 'w-64' : 'w-0'} h-full border-r border-border bg-card/50 backdrop-blur-md hidden md:flex flex-col overflow-hidden transition-all duration-300`}>
        <div className={`${leftSidebarOpen ? 'opacity-100' : 'opacity-0'} w-64 p-6 pb-4 transition-opacity duration-200`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-black text-xl">G</span>
            </div>
            <span className="text-xl font-black tracking-tight">Guru<span className="text-primary">Connect</span></span>
          </div>
        </div>

        <nav className={`flex-1 px-4 space-y-1 ${leftSidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
          <button
            onClick={() => onNavigate?.('dashboard')}
            className="w-full flex items-center gap-3 py-2.5 px-4 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
          >
            <Calendar className="w-5 h-5" />
            My Sessions
          </button>
          <button
            onClick={() => onNavigate?.('history')}
            className="w-full flex items-center gap-3 py-2.5 px-4 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
          >
            <History className="w-5 h-5" />
            History
          </button>
          <button
            className="w-full flex items-center gap-3 py-2.5 px-4 rounded-xl text-sm font-medium bg-primary text-primary-foreground"
          >
            <Compass className="w-5 h-5" />
            Explore Mentors
          </button>
        </nav>

        <div className={`p-4 space-y-1 border-t border-border ${leftSidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
          <button className="w-full flex items-center gap-3 py-2.5 px-4 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
            <Settings className="w-5 h-5" />
            Settings
          </button>
          <button className="w-full flex items-center gap-3 py-2.5 px-4 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
            <HelpCircle className="w-5 h-5" />
            Help Center
          </button>
          <button className="w-full flex items-center gap-3 py-2.5 px-4 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
      {/* SEARCH & FILTER MATRIX HEADER */}
      <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/20 backdrop-blur-md gap-4 flex-shrink-0">
        {/* Left: Sidebar Toggle + Back Button + Search */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}>
            {leftSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
          </Button>
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="h-10 w-10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
        </div>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search mentors by name, skill..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 pl-10 pr-10 rounded-xl bg-background border-border"
          />
          {searchQuery && (
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setSearchQuery('')}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Right: Sort Options */}
        <div className="flex items-center gap-3">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 px-3 rounded-xl border border-border bg-background text-sm"
          >
            <option value="rating">Top Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="sessions">Most Sessions</option>
          </select>
          {selectedSkills.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => setSelectedSkills([])} className="text-xs">
              Clear ({selectedSkills.length})
            </Button>
          )}
        </div>
      </div>

      {/* CORE APPLICATION WORKSPACE */}
      <div className={`grid grid-cols-1 gap-6 p-6 flex-1 overflow-hidden transition-all duration-300 ${leftSidebarOpen ? 'xl:grid-cols-4' : 'xl:grid-cols-1'}`}>
        
        {/* LEFT CHANNEL: DISCOVERY MATRIX */}
        <div className={`h-full overflow-y-auto pr-2 ${leftSidebarOpen ? 'xl:col-span-3' : 'xl:col-span-1'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[260px]">
                  <Card className="h-full p-4 flex flex-col justify-between bg-card border-border">
                    <div>
                      <div className="flex items-start gap-4 mb-3">
                        <div className="w-14 h-14 rounded-full bg-muted animate-pulse" />
                        <div className="flex-1">
                          <div className="h-4 w-24 bg-muted rounded mb-2 animate-pulse" />
                          <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                        </div>
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        <div className="h-5 w-12 bg-muted rounded animate-pulse" />
                        <div className="h-5 w-12 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                      <div className="h-9 w-20 bg-muted rounded animate-pulse" />
                    </div>
                  </Card>
                </div>
              ))
            ) : sortedMentors.length > 0 ? (
              sortedMentors.map((mentor, index) => (
                <MentorCard
                  key={mentor._id || mentor.name}
                  mentor={mentor}
                  index={index}
                  onBookDemo={onBookDemo}
                  onClick={() => onMentorClick?.(mentor)}
                />
              ))
            ) : (
              <div className="col-span-full py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">No mentors found</h3>
                <p className="text-muted-foreground text-sm mb-4">Try adjusting your search or filters</p>
                <Button onClick={() => { setSearchQuery(''); setSelectedSkills([]); }}>
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT CHANNEL: UTILITY TRACK (xl:col-span-1) */}
        <div className={`${rightSidebarOpen ? 'hidden xl:flex' : 'hidden'} flex-col gap-4 w-full transition-all duration-300`}>
          {/* Filter by Skill */}
          <Card className="p-4">
            <CardHeader className="p-0 mb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Filter by Skill
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-wrap gap-2">
                {trendingSkills.map(skill => (
                  <Badge 
                    key={skill}
                    variant={selectedSkills.includes(skill) ? "default" : "outline"}
                    className="cursor-pointer text-xs px-2 py-1 hover:border-primary/50 transition-all"
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Recommended */}
          <Card className="p-4 flex-1">
            <CardHeader className="p-0 mb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                AI Recommended
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              <p className="text-xs text-muted-foreground">
                Based on your learning goals, we recommend:
              </p>
              <div className="space-y-2">
                {sortedMentors.slice(0, 3).map((mentor, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer" onClick={() => onBookDemo?.(mentor)}>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {mentor.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{mentor.name}</p>
                      <p className="text-xs text-muted-foreground">{mentor.skills.slice(0, 2).join(', ')}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats Summary */}
          <Card className="p-4">
            <CardHeader className="p-0 mb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Platform Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-2 rounded-lg bg-muted/50">
                  <p className="text-xl font-bold text-foreground">{mentors.length}</p>
                  <p className="text-xs text-muted-foreground">Mentors</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/50">
                  <p className="text-xl font-bold text-foreground">{allSkills.length}</p>
                  <p className="text-xs text-muted-foreground">Skills</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </div>
  );
}

function MentorCard({ mentor, index, onBookDemo, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="h-[260px]"
    >
      <Card className="h-full flex flex-col justify-between p-4 bg-card rounded-xl border border-border/80 hover:border-primary/60 transition-all duration-300 group">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Card Top Section */}
          <div className="flex items-start gap-4 w-full">
            <div className="w-14 h-14 rounded-full bg-muted flex-shrink-0 overflow-hidden border border-border">
              <ImageWithFallback
                src={mentor.image}
                alt={mentor.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-secondary/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs text-amber-500 font-medium">
              <Star className="w-3 h-3 fill-amber-500" />
              {mentor.rating.toFixed(1)}
            </div>

            <div className="flex flex-col text-left gap-0.5 flex-1 min-w-0">
              <h3 className="text-base font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {mentor.name}
              </h3>
              <p className="text-xs text-muted-foreground truncate">{mentor.title}</p>
              <p className="text-xs text-primary font-medium truncate">{mentor.company}</p>
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 my-3 h-12 overflow-hidden">
            {mentor.skills.slice(0, 4).map((skill, i) => (
              <Badge key={i} variant="secondary" className="text-[10px] px-2 py-0">
                {skill}
              </Badge>
            ))}
            {mentor.skills.length > 4 && (
              <Badge variant="outline" className="text-[10px] px-2 py-0">
                +{mentor.skills.length - 4}
              </Badge>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/60 w-full">
            <div className="flex flex-col text-left">
              <span className="text-base font-bold text-foreground">₹{mentor.rate}</span>
              <span className="text-[10px] text-muted-foreground">/ hr</span>
            </div>
            <Button 
              size="sm" 
              className="h-9 px-4 text-xs font-medium flex items-center gap-1"
              onClick={() => onBookDemo?.(mentor)}
            >
              Book
              <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}