import React from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'
import { FiUsers, FiBookOpen, FiGlobe, FiHeart } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const AboutPage = () => {
    const navigate = useNavigate()

    return (
        <div className="w-full bg-[var(--bg-main)] text-[var(--text-main)] font-outfit">
            <Nav />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 lg:px-12 bg-[var(--bg-surface)]">
                <div className="max-w-7xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200">
                        <span className="text-xs font-bold text-blue-600 tracking-wider">OUR MISSION</span>
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-extrabold text-[var(--text-main)] leading-tight">
                        Empowering Education <br />
                        <span className="text-blue-600">for Everyone</span>
                    </h1>
                    <p className="text-xl text-[var(--text-muted)] leading-relaxed max-w-3xl mx-auto">
                        At <span className="text-blue-600 font-semibold">freesiksha.com</span>, we believe in providing free, quality education to all, fostering a community-driven platform that is inclusive, accessible and dedicated to lifelong learning.
                    </p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-4 lg:px-12 bg-[var(--bg-main)]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="premium-card p-8 text-center space-y-4 hover:shadow-blue-100/50">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mx-auto text-2xl">
                                <FiBookOpen />
                            </div>
                            <h2 className="text-4xl font-black text-[var(--text-main)]">85+</h2>
                            <p className="text-slate-500 font-medium">Expert-led Courses</p>
                        </div>
                        <div className="premium-card p-8 text-center space-y-4 hover:shadow-indigo-100/50">
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mx-auto text-2xl">
                                <FiUsers />
                            </div>
                            <h2 className="text-4xl font-black text-[var(--text-main)]">330+</h2>
                            <p className="text-slate-500 font-medium">Active Mentors</p>
                        </div>
                        <div className="premium-card p-8 text-center space-y-4">
                            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mx-auto text-2xl">
                                <FiGlobe />
                            </div>
                            <h2 className="text-4xl font-black text-[var(--text-main)]">10k+</h2>
                            <p className="text-slate-500 font-medium">Global Students</p>
                        </div>
                        <div className="premium-card p-8 text-center space-y-4">
                            <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 mx-auto text-2xl">
                                <FiHeart />
                            </div>
                            <h2 className="text-4xl font-black text-[var(--text-main)]">100%</h2>
                            <p className="text-slate-500 font-medium">Free Forever</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Community CTA */}
            <section className="py-20 px-4 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-blue-600 rounded-[40px] p-8 lg:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-200">
                        {/* Decorative circles */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>

                        <div className="relative z-10 space-y-8">
                            <h2 className="text-4xl lg:text-5xl font-bold">Ready to Start Your Journey?</h2>
                            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                                Join our thriving community of learners and educators. Together, we're building the future of open education.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <button 
                                    onClick={() => navigate("/signup")}
                                    className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold shadow-lg hover:scale-105 transition-all text-lg"
                                >
                                    Join Our Community
                                </button>
                                <button 
                                    onClick={() => navigate("/allcourses")}
                                    className="border-2 border-white/30 hover:border-white text-white px-10 py-4 rounded-full font-bold transition-all text-lg"
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
    )
}

export default AboutPage
