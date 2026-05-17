import { motion } from 'motion/react';
import { Star, Clock, ArrowRight, Search, Filter, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { searchMentors } from '../services/api';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

export function MentorShowcase({ onBookDemo, onMentorClick }) {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState(null);

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

  const allSkills = [...new Set(mentors.flatMap(m => m.skills))].slice(0, 10);

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = searchQuery === '' || 
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSkill = !selectedSkill || mentor.skills.includes(selectedSkill);
    return matchesSearch && matchesSkill;
  });

  return (
    <section className="w-full">
      {/* Search & Filter Bar */}
      <div className="h-14 border-b border-border flex items-center gap-4 px-6 bg-card/30">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or skill..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-9 pr-9 rounded-lg bg-background border-border"
          />
          {searchQuery && (
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6" onClick={() => setSearchQuery('')}>
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {allSkills.slice(0, 5).map(skill => (
            <Badge 
              key={skill} 
              variant={selectedSkill === skill ? "default" : "outline"}
              className="cursor-pointer text-xs px-2 py-0.5"
              onClick={() => setSelectedSkill(selectedSkill === skill ? null : skill)}
            >
              {skill}
            </Badge>
          ))}
          {selectedSkill && (
            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => setSelectedSkill(null)}>
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[260px]">
                <Card className="h-full p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start gap-4 mb-3">
                      <Skeleton className="w-14 h-14 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-wrap mb-3">
                      <Skeleton className="h-5 w-12 rounded" />
                      <Skeleton className="h-5 w-12 rounded" />
                      <Skeleton className="h-5 w-12 rounded" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-9 w-24 rounded-lg" />
                  </div>
                </Card>
              </div>
            ))
          ) : filteredMentors.length > 0 ? (
            filteredMentors.map((mentor, index) => (
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
              <p className="text-muted-foreground text-sm">Try adjusting your search or filters</p>
              <Button variant="outline" className="mt-4" onClick={() => { setSearchQuery(''); setSelectedSkill(null); }}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function MentorCard({ mentor, index, onBookDemo, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="h-[260px]"
    >
      <Card className="h-full flex flex-col justify-between p-4 bg-card hover:border-primary/50 transition-all duration-300 rounded-xl border border-border group relative overflow-hidden">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Card Top Section */}
          <div className="flex items-start gap-4 w-full">
            {/* Profile Image */}
            <div className="w-14 h-14 rounded-full bg-muted flex-shrink-0 overflow-hidden border border-border">
              <ImageWithFallback
                src={mentor.image}
                alt={mentor.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Rating Label */}
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-secondary/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs text-amber-500 font-medium">
              <Star className="w-3 h-3 fill-amber-500" />
              {mentor.rating.toFixed(1)}
            </div>

            {/* Info Block */}
            <div className="flex flex-col text-left gap-0.5 flex-1 min-w-0">
              <h3 className="text-base font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {mentor.name}
              </h3>
              <p className="text-xs text-muted-foreground truncate">{mentor.title}</p>
              <p className="text-xs text-primary font-medium truncate">{mentor.company}</p>
            </div>
          </div>

          {/* Card Mid Section - Skills */}
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

          {/* Card Footer Section */}
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