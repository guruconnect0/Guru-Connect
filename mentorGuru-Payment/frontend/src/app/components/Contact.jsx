import { motion } from 'motion/react';
import { Mail, MessageSquare, MapPin, Send, Github, Twitter, Linkedin } from 'lucide-react';

const contactInfo = [
    {
        icon: <Mail className="w-5 h-5" />,
        label: "Email",
        value: "guruconnect0@gmail.com",
        href: "mailto:guruconnect0@gmail.com"
    },
    {
        icon: <MapPin className="w-5 h-5" />,
        label: "Office",
        value: "Amba Das Hotel, Kolhapur",
        href: "#"
    },
    {
        icon: <MessageSquare className="w-5 h-5" />,
        label: "Support",
        value: "24/7 Priority Chat",
        href: "#"
    }
];

const socialLinks = [
    { icon: <Github className="w-5 h-5" />, href: "#" },
    { icon: <Twitter className="w-5 h-5" />, href: "#" },
    { icon: <Linkedin className="w-5 h-5" />, href: "#" }
];

export function Contact() {
    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you'd handle form submission here
        alert("Message sent! We'll get back to you soon.");
    };

    return (
        <div className="pt-24 min-h-screen bg-background transition-colors duration-300">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[20%] right-[10%] w-[35%] h-[50%] rounded-full bg-primary/5 dark:bg-[var(--electric-blue)]/5 blur-[120px]" />
                <div className="absolute bottom-[20%] left-[10%] w-[35%] h-[50%] rounded-full bg-[var(--cyan)]/5 blur-[120px]" />
            </div>

            <section className="py-24 px-6 md:py-32">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-5xl md:text-8xl font-black mb-8 text-foreground tracking-tighter"
                        >
                            Let's Start a <br /><span className="text-primary italic">Conversation</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed"
                        >
                            Have a question about mentorship or want to partner with us? We're here to help you grow.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                        {/* Contact Info Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="lg:col-span-5 space-y-10"
                        >
                            <div
                                className="p-10 rounded-[2.5rem] bg-card dark:bg-white/5 border border-border dark:border-white/10 shadow-2xl dark:shadow-none"
                            >
                                <h2 className="text-3xl font-black mb-10 text-foreground tracking-tighter">Reach Out</h2>
                                <div className="space-y-10">
                                    {contactInfo.map((info, index) => (
                                        <a
                                            key={index}
                                            href={info.href}
                                            className="flex items-center gap-8 group cursor-pointer"
                                        >
                                            <div className="w-16 h-16 rounded-2xl bg-muted/50 dark:bg-white/5 flex items-center justify-center text-primary dark:text-[var(--electric-blue)] group-hover:bg-primary group-hover:text-primary-foreground dark:group-hover:bg-[var(--electric-blue)] dark:group-hover:text-black transition-all duration-500 shadow-lg shadow-black/5">
                                                {info.icon}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{info.label}</p>
                                                <p className="text-xl font-black text-foreground group-hover:text-primary transition-colors tracking-tight">{info.value}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>

                                <div className="mt-12 pt-12 border-t border-border dark:border-white/10">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-8 text-center">Follow our journey</p>
                                    <div className="flex justify-center gap-6">
                                        {socialLinks.map((social, index) => (
                                            <a
                                                key={index}
                                                href={social.href}
                                                className="w-14 h-14 rounded-2xl bg-muted/50 dark:bg-white/5 flex items-center justify-center text-muted-foreground hover:text-primary dark:hover:text-[var(--electric-blue)] hover:bg-card dark:hover:bg-white/10 shadow-lg shadow-black/5 hover:translate-y-[-4px] transition-all duration-300"
                                            >
                                                {social.icon}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="lg:col-span-7"
                        >
                            <form
                                onSubmit={handleSubmit}
                                className="p-10 md:p-14 rounded-[3rem] bg-card dark:bg-white/5 border border-border dark:border-white/10 shadow-2xl dark:shadow-none space-y-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest ml-2 text-muted-foreground">Name</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Your name"
                                            className="w-full h-16 px-8 rounded-2xl bg-muted/50 dark:bg-white/5 border-2 border-transparent focus:border-primary/50 focus:bg-background outline-none transition-all font-bold text-foreground placeholder:text-muted-foreground/30"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest ml-2 text-muted-foreground">Email</label>
                                        <input
                                            required
                                            type="email"
                                            placeholder="hello@example.com"
                                            className="w-full h-16 px-8 rounded-2xl bg-muted/50 dark:bg-white/5 border-2 border-transparent focus:border-primary/50 focus:bg-background outline-none transition-all font-bold text-foreground placeholder:text-muted-foreground/30"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest ml-2 text-muted-foreground">Subject</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="How can we help?"
                                        className="w-full h-16 px-8 rounded-2xl bg-muted/50 dark:bg-white/5 border-2 border-transparent focus:border-primary/50 focus:bg-background outline-none transition-all font-bold text-foreground placeholder:text-muted-foreground/30"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest ml-2 text-muted-foreground">Message</label>
                                    <textarea
                                        required
                                        rows={6}
                                        placeholder="Tell us more about your inquiry..."
                                        className="w-full p-8 rounded-[2rem] bg-muted/50 dark:bg-white/5 border-2 border-transparent focus:border-primary/50 focus:bg-background outline-none transition-all font-bold text-foreground placeholder:text-muted-foreground/30 resize-none"
                                    ></textarea>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02, y: -4 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full h-20 rounded-[2rem] bg-primary text-primary-foreground font-black text-xl shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em]"
                                >
                                    <Send className="w-6 h-6" />
                                    Send Message
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
