import { motion } from 'motion/react';
import { Mail, MessageSquare, MapPin, Send, Github, Twitter, Linkedin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const contactInfo = [
    { icon: Mail, label: "Email", value: "guruconnect0@gmail.com", href: "mailto:guruconnect0@gmail.com" },
    { icon: MapPin, label: "Office", value: "Amba Das Hotel, Kolhapur", href: "#" },
    { icon: MessageSquare, label: "Support", value: "24/7 Priority Chat", href: "#" }
];

const socialLinks = [
    { icon: Github, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Linkedin, href: "#" }
];

export function Contact() {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Message sent! We'll get back to you soon.");
    };

    return (
        <div className="pt-24 min-h-screen bg-background transition-colors duration-300">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[20%] right-[10%] w-[35%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute bottom-[20%] left-[10%] w-[35%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
            </div>

            <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12 lg:mb-16">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.1] tracking-tight text-foreground"
                        >
                            Let's Start a <br /><span className="text-primary italic">Conversation</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                        >
                            Have a question about mentorship or want to partner with us? We're here to help you grow.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                        {/* Contact Info Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="lg:col-span-5"
                        >
                            <Card className="p-6 sm:p-8 lg:p-10">
                                <CardContent className="p-0">
                                    <h2 className="text-2xl lg:text-3xl font-black mb-8 tracking-tight text-foreground">Reach Out</h2>
                                    <div className="space-y-6 lg:space-y-8">
                                        {contactInfo.map((info, index) => (
                                            <a
                                                key={index}
                                                href={info.href}
                                                className="flex items-center gap-4 lg:gap-6 group cursor-pointer"
                                            >
                                                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-muted flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-md">
                                                    <info.icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{info.label}</p>
                                                    <p className="text-base lg:text-lg font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{info.value}</p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>

                                    <div className="mt-8 pt-6 lg:pt-8 border-t border-border">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 lg:mb-6 text-center">Follow our journey</p>
                                        <div className="flex justify-center gap-4">
                                            {socialLinks.map((social, index) => (
                                                <a
                                                    key={index}
                                                    href={social.href}
                                                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/80 hover:-translate-y-1 transition-all duration-300"
                                                >
                                                    <social.icon className="w-5 h-5" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Contact Form Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="lg:col-span-7"
                        >
                            <Card className="p-6 sm:p-8 lg:p-10 xl:p-12">
                                <CardContent className="p-0">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest ml-1 text-muted-foreground">Name</label>
                                                <Input
                                                    required
                                                    type="text"
                                                    placeholder="Your name"
                                                    className="h-12 lg:h-14 rounded-xl bg-muted/50 border-border focus:border-primary focus:ring-primary"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest ml-1 text-muted-foreground">Email</label>
                                                <Input
                                                    required
                                                    type="email"
                                                    placeholder="hello@example.com"
                                                    className="h-12 lg:h-14 rounded-xl bg-muted/50 border-border focus:border-primary focus:ring-primary"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest ml-1 text-muted-foreground">Subject</label>
                                            <Input
                                                required
                                                type="text"
                                                placeholder="How can we help?"
                                                className="h-12 lg:h-14 rounded-xl bg-muted/50 border-border focus:border-primary focus:ring-primary"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest ml-1 text-muted-foreground">Message</label>
                                            <Textarea
                                                required
                                                rows={5}
                                                placeholder="Tell us more about your inquiry..."
                                                className="rounded-2xl bg-muted/50 border-border focus:border-primary focus:ring-primary resize-none"
                                            />
                                        </div>

                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-2">
                                            <Button type="submit" size="lg" className="w-full h-12 lg:h-14 gap-3 text-base uppercase tracking-wider">
                                                <Send className="w-5 h-5" />
                                                Send Message
                                            </Button>
                                        </motion.div>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}