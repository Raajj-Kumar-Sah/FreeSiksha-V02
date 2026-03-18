import React from 'react'
import Nav from '../components/Nav'
import Logos from '../components/Logos';
import Cardspage from '../components/Cardspage';
import ExploreCourses from '../components/ExploreCourses';
import About from '../components/About.jsx';
import ReviewPage from '../components/ReviewPage';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/hero_students_collaboration.png' // This will be the generated image

function Home() {
  const navigate = useNavigate()

  return (
    <div className="w-full bg-[var(--bg-main)] text-[var(--text-main)]">
      <Nav />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 lg:px-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50/10 border border-blue-100/20">
              <span className="text-xs font-bold text-blue-600 tracking-wider">NON PROFIT EDUCATION</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-[var(--text-main)] leading-[1.1]">
              Free & Quality <br />
              <span className="text-blue-600">Education</span> for All
            </h1>
            
            <p className="text-lg text-[var(--text-muted)] leading-relaxed max-w-xl">
              Empowering learners worldwide with accessible, high-quality education and industry-recognized certifications. Join 1M+ students today.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate("/allcourses")}
                className="btn-primary px-8 py-4 rounded-full text-[16px]"
              >
                Explore Courses
              </button>
              <button 
                onClick={() => navigate("/signup")}
                className="btn-secondary px-8 py-4 rounded-full text-[16px]"
              >
                Join Now
              </button>
            </div>
            
            {/* Social Proof */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200"></div>
                ))}
              </div>
              <p className="text-sm text-[var(--text-muted)]">
                <span className="font-bold text-[var(--text-main)]">12,000+</span> seekers joined this month
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-600/5 rounded-[40px] transform rotate-3"></div>
            <div className="relative bg-[var(--bg-surface)] p-2 rounded-[32px] shadow-2xl border border-[var(--border-color)] overflow-hidden">
              <img 
                src={heroImg} 
                alt="Students collaborating" 
                className="w-full h-auto rounded-[24px]"
              />
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      <Logos />
      <ExploreCourses />
      <Cardspage />
      <About />
      <ReviewPage />
      <Contact />
      <Footer />
    </div>
  ) 
}

export default Home
