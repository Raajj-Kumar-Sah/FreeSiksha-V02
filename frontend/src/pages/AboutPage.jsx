import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FiUsers, FiBookOpen, FiGlobe, FiHeart, FiTarget, FiEye, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../config';
import fallbackVideo from '../assets/hero_bg.mp4';
import SEO from '../components/SEO';

// Custom Animated Counter Component
const Counter = ({ from = 0, to, suffix = "", duration = 2 }) => {
    const count = useMotionValue(from);
    const rounded = useTransform(count, (latest) => Math.round(latest) + suffix);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            const controls = animate(count, to, { duration: duration, ease: "easeOut" });
            return controls.stop;
        }
    }, [count, to, duration, isInView]);

    return <motion.span ref={ref}>{rounded}</motion.span>;
};

const Typewriter = ({ texts, delay = 150, pause = 2000 }) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!texts || texts.length === 0) return;
        const timeout = setTimeout(() => {
            const currentFullText = texts[currentTextIndex];
            
            if (!isDeleting) {
                setDisplayText(currentFullText.substring(0, displayText.length + 1));
                if (displayText.length === currentFullText.length) {
                    setTimeout(() => setIsDeleting(true), pause);
                }
            } else {
                setDisplayText(currentFullText.substring(0, displayText.length - 1));
                if (displayText.length === 0) {
                    setIsDeleting(false);
                    setCurrentTextIndex((currentTextIndex + 1) % texts.length);
                }
            }
        }, isDeleting ? delay / 2 : delay);

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, currentTextIndex, texts, delay, pause]);

    if (!texts || texts.length === 0) return null;

    return <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 border-r-4 border-blue-600 animate-pulse">{displayText}</span>;
};

const AboutPage = () => {
    const navigate = useNavigate();
    const [settings, setSettings] = useState(null);
    const [currentBg, setCurrentBg] = useState(0);

    useEffect(() => {
        axios.get(`${serverUrl}/api/about/settings`)
            .then(res => setSettings(res.data))
            .catch(err => console.log("Failed to load about settings"));
    }, []);

    // Background Slideshow Effect
    useEffect(() => {
        if (settings?.backgroundPhotos?.length > 1) {
            const interval = setInterval(() => {
                setCurrentBg(prev => (prev + 1) % settings.backgroundPhotos.length);
            }, 6000);
            return () => clearInterval(interval);
        }
    }, [settings]);

    const videoSrc = settings?.videoUrl || fallbackVideo;
    const randomQuote = settings?.quotes?.[Math.floor(Math.random() * (settings?.quotes?.length || 1))] || { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" };

    return (
        <div className="w-full bg-[var(--bg-main)] text-[var(--text-main)] font-outfit overflow-hidden">
            <SEO 
                title="About Us - Our Vision & Mission"
                description="Learn about Freesiksha's mission to democratize education in India through free, high-quality learning resources and mentor support."
                keywords="freesiksha mission, about freesiksha, free education india, edtech vision"
            />
            <Nav />

            {/* Hero Section with Dynamic Background */}
            <section className="relative pt-48 pb-32 px-4 lg:px-12 min-h-[80vh] flex items-center overflow-hidden">
                {/* Background Slideshow */}
                <div className="absolute inset-0 z-0">
                    {settings?.backgroundPhotos?.map((photo, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: currentBg === idx ? 1 : 0 }}
                            transition={{ duration: 1.5 }}
                            className="absolute inset-0"
                        >
                            <img src={photo} className="w-full h-full object-cover scale-110" alt="About Background" />
                        </motion.div>
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-main)]/80 via-[var(--bg-main)]/60 to-[var(--bg-main)]"></div>
                </div>

                <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10 w-full">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md tracking-widest font-bold text-blue-500 text-xs"
                    >
                        EMPOWERING EDUCATION
                    </motion.div>
                    
                    <h1 className="text-5xl lg:text-8xl font-black text-[var(--text-main)] leading-tight tracking-tighter">
                        {settings?.title || "Empowering Education"} <br />
                        {settings?.typingTexts?.length > 0 ? (
                            <Typewriter texts={settings.typingTexts} />
                        ) : (
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                {settings?.subtitle || "for Everyone"}
                            </span>
                        )}
                    </h1>

                    <p className="text-xl text-[var(--text-muted)] leading-relaxed max-w-3xl mx-auto font-medium backdrop-blur-sm p-4 rounded-3xl bg-white/5 inline-block">
                        {settings?.description || "At freesiksha.com, we believe in providing free, quality education to all, fostering a community-driven platform that is inclusive, accessible and dedicated to lifelong learning."}
                    </p>
                </div>
            </section>

            {/* Quote Section (Animated) */}
            <div className="max-w-4xl mx-auto -mt-16 relative z-20 px-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="bg-[var(--bg-surface)] p-8 lg:p-12 rounded-[40px] border border-[var(--border-color)] shadow-2xl shadow-blue-500/10 text-center space-y-4"
                >
                    <FiHeart className="text-rose-500 text-4xl mx-auto mb-4 animate-pulse" />
                    <h3 className="text-2xl lg:text-3xl font-black italic text-[var(--text-main)] leading-snug">
                        "{randomQuote.text}"
                    </h3>
                    <p className="font-bold text-blue-600 uppercase tracking-widest text-sm">— {randomQuote.author}</p>
                </motion.div>
            </div>

            {/* Video & Vision Split Section */}
            <section className="py-24 px-4 lg:px-12 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    
                    {/* Media Setup */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="relative rounded-[48px] overflow-hidden shadow-2xl shadow-blue-500/20 border border-[var(--border-color)] group aspect-square h-full"
                    >
                        <video 
                            src={videoSrc}
                            autoPlay 
                            loop 
                            muted 
                            playsInline 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent flex items-end p-12">
                            <div className="text-white space-y-2">
                                <div className="flex items-center gap-2 text-blue-400 font-bold tracking-widest uppercase text-xs mb-2">
                                    <FiEye className="text-lg" /> Our Vision
                                </div>
                                <h2 className="text-4xl font-black leading-tight">Building an <br /> Inclusive <span className="text-blue-500">World</span></h2>
                            </div>
                        </div>
                    </motion.div>

                    {/* Vision Content */}
                    <div className="space-y-10">
                        <div className="space-y-6">
                            <h2 className="text-5xl font-black text-[var(--text-main)] tracking-tight">
                                Our <span className="text-blue-600">Vision</span>
                            </h2>
                            <div className="w-24 h-2.5 bg-blue-600 rounded-full"></div>
                        </div>
                        <p className="text-2xl text-[var(--text-muted)] leading-relaxed font-medium">
                            To build an inclusive world where quality education is free, accessible, and empowering for every learner, regardless of their background, geography or income.
                        </p>
                        
                        <div className="grid sm:grid-cols-2 gap-6 pt-4">
                            <div className="flex flex-col gap-4 bg-[var(--bg-surface)] p-8 rounded-[32px] border border-[var(--border-color)] shadow-sm hover:translate-y-[-5px] transition-transform">
                                <div className="w-14 h-14 shrink-0 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-3xl">
                                    <FiGlobe />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-[var(--text-main)]">Global Access</h4>
                                    <p className="text-sm text-[var(--text-muted)]">Breaking barriers to learning nationwide.</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 bg-[var(--bg-surface)] p-8 rounded-[32px] border border-[var(--border-color)] shadow-sm hover:translate-y-[-5px] transition-transform">
                                <div className="w-14 h-14 shrink-0 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-3xl">
                                    <FiUsers />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-[var(--text-main)]">Community</h4>
                                    <p className="text-sm text-[var(--text-muted)]">Fostering peer-to-peer inspiration.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Grid */}
            <section className="py-24 px-4 lg:px-12 bg-[var(--bg-surface)] border-y border-[var(--border-color)]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-500 font-bold tracking-widest text-xs uppercase">
                            <FiTarget className="mr-2" /> Our Mission
                        </div>
                        <h2 className="text-4xl lg:text-6xl font-black text-[var(--text-main)] leading-tight">
                            At FreeSiksha, our <br /> mission is clear
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Mission Item 1 */}
                        <div className="bg-[var(--bg-main)] p-12 rounded-[40px] border border-[var(--border-color)] shadow-sm hover:shadow-2xl hover:border-blue-500/30 transition-all duration-500 group relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 text-4xl mb-8 group-hover:rotate-6 transition-all">
                                <FiBookOpen />
                            </div>
                            <h3 className="text-3xl font-bold text-[var(--text-main)] mb-6">Democratize Education</h3>
                            <p className="text-[var(--text-muted)] text-xl leading-relaxed">By offering completely free, high-quality learning resources and professional training to anyone with an internet connection.</p>
                        </div>
                        
                        {/* Mission Item 2 */}
                        <div className="bg-[var(--bg-main)] p-12 rounded-[40px] border border-[var(--border-color)] shadow-sm hover:shadow-2xl hover:border-indigo-500/30 transition-all duration-500 group relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 text-4xl mb-8 group-hover:rotate-6 transition-all">
                                <FiCheckCircle />
                            </div>
                            <h3 className="text-3xl font-bold text-[var(--text-main)] mb-6">Bridge Skill Gaps</h3>
                            <p className="text-[var(--text-muted)] text-xl leading-relaxed">Through professional, industry-aligned, and career-ready courses designed by absolute experts in their fields.</p>
                        </div>

                        {/* Mission Item 3 */}
                        <div className="bg-[var(--bg-main)] p-12 rounded-[40px] border border-[var(--border-color)] shadow-sm hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-500 group relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 text-4xl mb-8 group-hover:rotate-6 transition-all">
                                <FiUsers />
                            </div>
                            <h3 className="text-3xl font-bold text-[var(--text-main)] mb-6">Empower Communities</h3>
                            <p className="text-[var(--text-muted)] text-xl leading-relaxed">By directly supporting students, dedicated educators, and expansive grassroots learning initiatives globally.</p>
                        </div>

                        {/* Mission Item 4 */}
                        <div className="bg-[var(--bg-main)] p-12 rounded-[40px] border border-[var(--border-color)] shadow-sm hover:shadow-2xl hover:border-rose-500/30 transition-all duration-500 group relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="w-20 h-20 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 text-4xl mb-8 group-hover:rotate-6 transition-all">
                                <FiHeart />
                            </div>
                            <h3 className="text-3xl font-bold text-[var(--text-main)] mb-6">Promote Learning</h3>
                            <p className="text-[var(--text-muted)] text-xl leading-relaxed">Through highly inclusive, digital-first, and multilingual educational content built to adapt to modern realities.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dynamic Stats Section */}
            <section className="py-24 px-4 lg:px-12 bg-[var(--bg-main)]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="p-10 text-center space-y-4 hover:shadow-2xl transition-all border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-[40px]">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mx-auto text-3xl">
                                <FiBookOpen />
                            </div>
                            <h2 className="text-5xl font-black text-[var(--text-main)] relative">
                                <Counter from={0} to={85} suffix="+" duration={2.5} />
                            </h2>
                            <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-xs">Expert Courses</p>
                        </div>
                        <div className="p-10 text-center space-y-4 hover:shadow-2xl transition-all border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-[40px]">
                            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 mx-auto text-3xl">
                                <FiUsers />
                            </div>
                            <h2 className="text-5xl font-black text-[var(--text-main)] relative">
                                <Counter from={0} to={330} suffix="+" duration={3} />
                            </h2>
                            <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-xs">Active Mentors</p>
                        </div>
                        <div className="p-10 text-center space-y-4 hover:shadow-2xl transition-all border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-[40px]">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto text-3xl">
                                <FiGlobe />
                            </div>
                            <h2 className="text-5xl font-black text-[var(--text-main)] relative">
                                <Counter from={0} to={10} suffix="k+" duration={3.5} />
                            </h2>
                            <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-xs">Global Learners</p>
                        </div>
                        <div className="p-10 text-center space-y-4 hover:shadow-2xl transition-all border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-[40px]">
                            <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mx-auto text-3xl">
                                <FiHeart />
                            </div>
                            <h2 className="text-5xl font-black text-[var(--text-main)] relative">
                                <Counter from={0} to={100} suffix="%" duration={4} />
                            </h2>
                            <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-xs">Free Forever</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Community CTA */}
            <section className="py-20 px-4 lg:px-12 mb-10">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[48px] p-12 lg:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-500/30 border border-blue-400/30">
                        {/* Decorative elements */}
                        <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/10 rounded-full blur-3xl opacity-50 mix-blend-overlay"></div>
                        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-900/50 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>

                        <div className="relative z-10 space-y-10">
                            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter drop-shadow-lg">Join Our community</h2>
                            <p className="text-blue-100 text-xl lg:text-2xl max-w-3xl mx-auto font-medium leading-relaxed">
                                Ready to start your journey? Together, we're building the future of open education for everyone.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
                                <button 
                                    onClick={() => navigate("/signup")}
                                    className="bg-white text-blue-600 px-14 py-5 rounded-full font-black shadow-xl hover:scale-105 transition-transform text-xl"
                                >
                                    Get Started Free
                                </button>
                                <button 
                                    onClick={() => navigate("/allcourses")}
                                    className="bg-transparent border-2 border-white/40 hover:backdrop-blur-md hover:bg-white/10 text-white px-14 py-5 rounded-full font-bold transition-all text-xl"
                                >
                                    Browse Courses
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default AboutPage;
