import { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Lock, CreditCard, HelpCircle, ArrowLeft } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'sonner';

export function MentorSettings({ onBack }) {
    const { user, mentorProfile } = useAuthStore();
    const { theme, toggleTheme } = useTheme();
    const [activeSection, setActiveSection] = useState('profile');
    
    const sections = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'availability', label: 'Availability', icon: Bell },
        { id: 'pricing', label: 'Pricing', icon: CreditCard },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'help', label: 'Help & Support', icon: HelpCircle },
    ];
    
    return (
        <div className="h-screen flex flex-col bg-background">
            <div className="h-16 border-b border-border flex items-center px-6 bg-card/30">
                <Button variant="ghost" size="icon" onClick={onBack} className="mr-4">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <SettingsIcon className="w-5 h-5 mr-2" />
                <h1 className="text-xl font-bold">Settings</h1>
            </div>
            
            <div className="flex-1 overflow-hidden">
                <div className="max-w-5xl mx-auto h-full py-6 px-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1 space-y-2">
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                    activeSection === section.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                }`}
                            >
                                <section.icon className="w-5 h-5" />
                                {section.label}
                            </button>
                        ))}
                    </div>
                    
                    <div className="md:col-span-3 overflow-y-auto">
                        <Card className="bg-card border-border">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-4">{sections.find(s => s.id === activeSection)?.label}</h3>
                                <p className="text-muted-foreground">Settings for {activeSection} will appear here.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}