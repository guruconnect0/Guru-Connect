import { motion } from 'motion/react';
import { Target, Users, Lightbulb, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const values = [
    {
        icon: Target,
        title: "Our Mission",
        description: "To democratize high-level mentorship and accelerate professional growth for everyone, everywhere."
    },
    {
        icon: Users,
        title: "Our Community",
        description: "A global network of passionate experts and ambitious learners dedicated to mutual success."
    },
    {
        icon: Lightbulb,
        title: "Our Vision",
        description: "Building a world where knowledge sharing is seamless and every career path is empowered."
    },
    {
        icon: TrendingUp,
        title: "Our Impact",
        description: "Thousands of success stories, career transformations, and meaningful professional connections."
    }
];

export function About() {
    return (
        <div className="pt-24 min-h-screen bg-background transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10 overflow-hidden">
                    <div className="absolute top-[-10%] left-[10%] w-[40%] h-[60%] rounded-full bg-primary/10 blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[60%] rounded-full bg-primary/10 blur-[120px]" />
                </div>

                <div className="max-w-7xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tight text-foreground"
                    >
                        Empowering the Next <br />
                        <span className="text-primary italic">Generation</span> of Experts
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                    >
                        GuruConnect started with a simple idea: that the best way to learn is directly from those who have walked the path before you. We're on a mission to bridge the gap between education and industry.
                    </motion.p>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -4 }}
                            >
                                <Card className="h-full p-6 lg:p-8 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-300">
                                    <CardContent className="p-0">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                                            <value.icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl lg:text-2xl font-bold mb-4 tracking-tight text-foreground">
                                            {value.title}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {value.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative border-t border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 tracking-tight">Our Journey</h2>
                            <div className="space-y-6 text-muted-foreground text-base lg:text-lg leading-relaxed">
                                <p>
                                    Founded in 2024, GuruConnect emerged from the frustration of traditional learning paths. We saw brilliant minds struggling to find direction and industry veterans looking to share their wisdom.
                                </p>
                                <p>
                                    We built a platform that removes friction. No complex scheduling, no opaque processes—just direct access to the world's most talented mentors.
                                </p>
                                <p>
                                    Today, GuruConnect is more than a platform; it's a movement towards collaborative growth and lifelong learning.
                                </p>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/60" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white text-[10rem] lg:text-[12rem] font-black tracking-tighter drop-shadow-2xl">G</span>
                            </div>
                            <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}