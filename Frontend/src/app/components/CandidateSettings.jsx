import { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Lock, CreditCard, HelpCircle, ArrowLeft, Moon, Sun } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'sonner';

export function CandidateSettings({ onBack }) {
    const { user, candidateProfile } = useAuthStore();
    const { theme, toggleTheme } = useTheme();
    const [activeSection, setActiveSection] = useState('profile');
    
    const sections = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'help', label: 'Help & Support', icon: HelpCircle },
    ];
    
    const renderContent = () => {
        switch (activeSection) {
            case 'profile':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label>Full Name</Label>
                                    <Input defaultValue={user?.name || ''} placeholder="Your name" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Email</Label>
                                    <Input defaultValue={user?.email || ''} type="email" disabled className="opacity-60" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Phone</Label>
                                    <Input defaultValue={candidateProfile?.phone || ''} placeholder="+91 9876543210" />
                                </div>
                                <Button onClick={() => toast.success('Profile updated!')}>Save Changes</Button>
                            </div>
                        </div>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                            <div className="space-y-4">
                                {[
                                    { id: 'session', label: 'Session reminders', desc: 'Get notified 15 min before session' },
                                    { id: 'booking', label: 'Booking updates', desc: 'Updates on booking confirmations' },
                                    { id: 'rating', label: 'Rating requests', desc: 'Prompt to rate after sessions' },
                                    { id: 'marketing', label: 'Promotional emails', desc: 'New mentors, offers, and updates' },
                                ].map(item => (
                                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
                                        <div>
                                            <p className="font-medium">{item.label}</p>
                                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-5 h-5" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
                            <div className="space-y-4">
                                <div className="p-4 rounded-lg border">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Password</p>
                                            <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                                        </div>
                                        <Button variant="outline" size="sm">Change</Button>
                                    </div>
                                </div>
                                <div className="p-4 rounded-lg border">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Two-Factor Authentication</p>
                                            <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                                        </div>
                                        <Button variant="outline" size="sm">Enable</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'billing':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Billing & Payments</h3>
                            <div className="p-4 rounded-lg border text-center py-8">
                                <CreditCard className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                <p className="text-muted-foreground">No payment methods added</p>
                                <Button className="mt-4">Add Payment Method</Button>
                            </div>
                        </div>
                    </div>
                );
            case 'help':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Help & Support</h3>
                            <div className="space-y-3">
                                {[
                                    'How to book a session?',
                                    'How to cancel a booking?',
                                    'Payment issues',
                                    'Technical support',
                                ].map((faq, i) => (
                                    <div key={i} className="p-3 rounded-lg border hover:bg-accent cursor-pointer">
                                        <p className="font-medium">{faq}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 p-4 rounded-lg bg-muted">
                                <p className="font-medium mb-2">Need more help?</p>
                                <p className="text-sm text-muted-foreground">Contact us at support@guruconnect.com</p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="h-screen flex flex-col bg-background">
            {/* Header */}
            <div className="h-16 border-b border-border flex items-center px-6 bg-card/30">
                <Button variant="ghost" size="icon" onClick={onBack} className="mr-4">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <SettingsIcon className="w-5 h-5 mr-2" />
                <h1 className="text-xl font-bold">Settings</h1>
            </div>
            
            <div className="flex-1 overflow-hidden">
                <div className="max-w-5xl mx-auto h-full py-6 px-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="md:col-span-1 space-y-2">
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                    activeSection === section.id
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                }`}
                            >
                                <section.icon className="w-5 h-5" />
                                {section.label}
                            </button>
                        ))}
                    </div>
                    
                    {/* Content */}
                    <div className="md:col-span-3 overflow-y-auto">
                        <Card className="bg-card border-border">
                            <CardContent className="p-6">
                                {renderContent()}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}