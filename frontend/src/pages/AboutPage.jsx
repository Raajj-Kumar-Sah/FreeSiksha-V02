import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FiUsers, FiBookOpen, FiGlobe, FiHeart, FiTarget, FiEye, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
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

const AboutPage = () => {
    const navigate = useNavigate();
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        axios.get(`${serverUrl}/api/settings/public`)
            .then(res => setSettings(res.data.settings))
            .catch(err => console.log("Failed to load platform settings"));
    }, []);

    const videoSrc = settings?.aboutVideoUrl || fallbackVideo;

    return (
        <div className="w-full bg-[var(--bg-main)] text-[var(--text-main)] font-outfit overflow-hidden">
            <SEO 
                title="About Us - Our Vision & Mission"
                description="Learn about Freesiksha's mission to democratize education in India through free, high-quality learning resources and mentor support."
                keywords="freesiksha mission, about freesiksha, free education india, edtech vision"
            />
            <Nav />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 lg:px-12 bg-gradient-to-b from-[var(--bg-surface)] to-[var(--bg-main)]">
                <div className="max-w-7xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm tracking-widest font-bold text-blue-500 text-xs">
                        EMPOWERING EDUCATION
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-extrabold text-[var(--text-main)] leading-tight tracking-tight">
                        Empowering Education <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">for Everyone</span>
                    </h1>
                    <p className="text-xl text-[var(--text-muted)] leading-relaxed max-w-3xl mx-auto font-medium">
                        At <span className="text-blue-500 font-bold">freesiksha.com</span>, we believe in providing free, quality education to all, fostering a community-driven platform that is inclusive, accessible and dedicated to lifelong learning.
                    </p>
                </div>
            </section>

            {/* Video & Vision Split Section */}
            <section className="py-16 px-4 lg:px-12 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Media Setup */}
                    <div className="relative rounded-[40px] overflow-hidden shadow-2xl shadow-blue-500/10 border border-[var(--border-color)] group aspect-video lg:aspect-square h-full">
                        <video 
                            src={videoSrc}
                            autoPlay 
                            loop 
                            muted 
                            playsInline 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent flex items-end p-8">
                            <div className="text-white">
                                <div className="flex items-center gap-2 text-blue-400 font-bold tracking-widest uppercase text-sm mb-2">
                                    <FiEye /> Our Vision
                                </div>
                                <h2 className="text-3xl font-black">Building an Inclusive World</h2>
                            </div>
                        </div>
                    </div>

                    {/* Vision Content */}
                    <div className="space-y-8">
                        <h2 className="text-4xl font-black text-[var(--text-main)]">
                            Our <span className="text-blue-600">Vision</span>
                        </h2>
                        <div className="w-20 h-2 bg-blue-600 rounded-full"></div>
                        <p className="text-2xl text-[var(--text-muted)] leading-relaxed font-medium">
                            To build an inclusive world where quality education is free, accessible, and empowering for every learner, regardless of their background, geography or income.
                        </p>
                        
                        <div className="flex items-center gap-4 bg-[var(--bg-surface)] p-6 rounded-3xl border border-[var(--border-color)] shadow-sm">
                            <div className="w-16 h-16 shrink-0 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-3xl">
                                <FiGlobe />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-[var(--text-main)]">Global Accessibility</h4>
                                <p className="text-[var(--text-muted)]">Breaking down geographical barriers to learning.</p>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </section>

            {/* Mission Grid */}
            <section className="py-24 px-4 lg:px-12 bg-[var(--bg-surface)] border-y border-[var(--border-color)]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-500 font-bold tracking-widest text-xs uppercase">
                            <FiTarget className="mr-2" /> Our Mission
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black text-[var(--text-main)]">
                            At FreeSiksha, our mission is to:
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Mission Item 1 */}
                        <div className="bg-[var(--bg-main)] p-10 rounded-[32px] border border-[var(--border-color)] shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 text-3xl mb-6 group-hover:scale-110 transition-transform">
                                <FiBookOpen />
                            </div>
                            <h3 className="text-2xl font-bold text-[var(--text-main)] mb-4">Democratize Education</h3>
                            <p className="text-[var(--text-muted)] text-lg">By offering completely free, high-quality learning resources and professional training to anyone with an internet connection.</p>
                        </div>
                        
                        {/* Mission Item 2 */}
                        <div className="bg-[var(--bg-main)] p-10 rounded-[32px] border border-[var(--border-color)] shadow-sm hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 text-3xl mb-6 group-hover:scale-110 transition-transform">
                                <FiCheckCircle />
                            </div>
                            <h3 className="text-2xl font-bold text-[var(--text-main)] mb-4">Bridge Skill Gaps</h3>
                            <p className="text-[var(--text-muted)] text-lg">Through professional, industry-aligned, and career-ready courses designed by absolute experts in their fields.</p>
                        </div>

                        {/* Mission Item 3 */}
                        <div className="bg-[var(--bg-main)] p-10 rounded-[32px] border border-[var(--border-color)] shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 text-3xl mb-6 group-hover:scale-110 transition-transform">
                                <FiUsers />
                            </div>
                            <h3 className="text-2xl font-bold text-[var(--text-main)] mb-4">Empower Communities</h3>
                            <p className="text-[var(--text-muted)] text-lg">By directly supporting students, dedicated educators, and expansive grassroots learning initiatives globally.</p>
                        </div>

                        {/* Mission Item 4 */}
                        <div className="bg-[var(--bg-main)] p-10 rounded-[32px] border border-[var(--border-color)] shadow-sm hover:shadow-xl hover:border-rose-500/30 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 text-3xl mb-6 group-hover:scale-110 transition-transform">
                                <FiHeart />
                            </div>
                            <h3 className="text-2xl font-bold text-[var(--text-main)] mb-4">Promote Lifelong Learning</h3>
                            <p className="text-[var(--text-muted)] text-lg">Through highly inclusive, digital-first, and multilingual educational content built to adapt to modern realities.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dynamic Stats Section */}
            <section className="py-24 px-4 lg:px-12 bg-[var(--bg-main)]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="p-8 text-center space-y-4 hover:shadow-2xl transition-all border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-[32px]">
                            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mx-auto text-2xl">
                                <FiBookOpen />
                            </div>
                            <h2 className="text-5xl font-black text-[var(--text-main)] relative">
                                <Counter from={0} to={85} suffix="+" duration={2.5} />
                            </h2>
                            <p className="text-[var(--text-muted)] font-bold uppercase tracking-wider text-sm">Expert Courses</p>
                        </div>
                        <div className="p-8 text-center space-y-4 hover:shadow-2xl transition-all border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-[32px]">
                            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 mx-auto text-2xl">
                                <FiUsers />
                            </div>
                            <h2 className="text-5xl font-black text-[var(--text-main)] relative">
                                <Counter from={0} to={330} suffix="+" duration={3} />
                            </h2>
                            <p className="text-[var(--text-muted)] font-bold uppercase tracking-wider text-sm">Active Mentors</p>
                        </div>
                        <div className="p-8 text-center space-y-4 hover:shadow-2xl transition-all border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-[32px]">
                            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto text-2xl">
                                <FiGlobe />
                            </div>
                            <h2 className="text-5xl font-black text-[var(--text-main)] relative">
                                <Counter from={0} to={10} suffix="k+" duration={3.5} />
                            </h2>
                            <p className="text-[var(--text-muted)] font-bold uppercase tracking-wider text-sm">Global Learners</p>
                        </div>
                        <div className="p-8 text-center space-y-4 hover:shadow-2xl transition-all border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-[32px]">
                            <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mx-auto text-2xl">
                                <FiHeart />
                            </div>
                            <h2 className="text-5xl font-black text-[var(--text-main)] relative">
                                <Counter from={0} to={100} suffix="%" duration={4} />
                            </h2>
                            <p className="text-[var(--text-muted)] font-bold uppercase tracking-wider text-sm">Free Forever</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Community CTA */}
            <section className="py-20 px-4 lg:px-12 mb-10">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] p-10 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-500/30 border border-blue-400/30">
                        {/* Decorative elements */}
                        <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/10 rounded-full blur-3xl opacity-50 mix-blend-overlay"></div>
                        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-900/50 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>

                        <div className="relative z-10 space-y-10">
                            <h2 className="text-5xl lg:text-6xl font-black tracking-tight drop-shadow-lg">Join Our Community</h2>
                            <p className="text-blue-100 text-xl lg:text-2xl max-w-3xl mx-auto font-medium leading-relaxed">
                                Ready to start your journey? Together, we're building the future of open education for everyone.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
                                <button 
                                    onClick={() => navigate("/signup")}
                                    className="bg-white text-blue-600 px-12 py-5 rounded-full font-black shadow-xl hover:scale-105 transition-transform text-lg"
                                >
                                    Get Started Free
                                </button>
                                <button 
                                    onClick={() => navigate("/allcourses")}
                                    className="bg-transparent border-2 border-white/30 hover:backdrop-blur-md hover:bg-white/10 text-white px-12 py-5 rounded-full font-bold transition-all text-lg"
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
