import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import Nav from '../components/Nav'
import Logos from '../components/Logos';
import Cardspage from '../components/Cardspage';
import ExploreCourses from '../components/ExploreCourses';
import About from '../components/About.jsx';
import ReviewPage from '../components/ReviewPage';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import CourseNotificationToast from '../components/CourseNotificationToast.jsx';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import heroImg from '../assets/hero_students_collaboration.png' 
import heroBgVideo from '../assets/hero_bg.mp4'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import axios from 'axios';
import { serverUrl } from '../App';

function Home() {
  const navigate = useNavigate()
  const {courseData} = useSelector(state => state.course);
  const {userData} = useSelector(state => state.user);
  const [newestOpenCourse, setNewestOpenCourse] = useState(null);
  
  const words = ["Education","Skills","Growth","Future","Success"];
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [recentStudents, setRecentStudents] = useState([]);

  // Social Proof animation counter
  const countV = useMotionValue(0);
  const roundedCount = useTransform(countV, (v) => Math.round(v));

  useEffect(() => {
    let target = parseInt(localStorage.getItem('socialCount') || '1200', 10);
    target += 1;
    if (target > 1500) {
      target = 1200;
    }
    localStorage.setItem('socialCount', target.toString());
    
    const controls = animate(countV, target, { duration: 2.5, ease: "easeOut" });
    return controls.stop;
  }, []);

  useEffect(() => {
    axios.get(`${serverUrl}/api/auth/recent-students`)
      .then(res => setRecentStudents(res.data))
      .catch(err => console.error("Failed to fetch recent students", err));
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2000);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, Math.max(reverse ? 75 : subIndex === words[index].length ? 1000 : 150, parseInt(Math.random() * 50)));

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse]);

  useEffect(() => {
    if (courseData && courseData.length > 0) {
      const openCourses = courseData.filter(course => {
        if (!course.isPublished) return false;
        if (!course.registrationDeadline) return false;
        if (new Date(course.registrationDeadline) <= new Date()) return false;
        // Check if already enrolled or pending
        if (userData) {
          if (userData.enrolledCourses?.some(id => (typeof id === 'string' ? id : id._id)?.toString() === course._id.toString())) return false;
          if (userData.pendingCourses?.some(id => (typeof id === 'string' ? id : id._id)?.toString() === course._id.toString())) return false;
        }
        return true;
      });
      
      // Sort to get newest (assuming createdAt exists)
      if (openCourses.length > 0) {
         openCourses.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
         setNewestOpenCourse(openCourses[0]);
      }
    }
  }, [courseData, userData]);

  return (
    <div className="w-full bg-[var(--bg-main)] text-[var(--text-main)] overflow-hidden">
      <SEO 
        title="Free & Quality Education for All"
        description="Freesiksha is India's leading free EdTech platform offering professional courses in Web Dev, AI, Data Science and more with industry certificates."
        keywords="free online courses India, EdTech platform students, skill development free, freesiksha, learn coding free"
      />
      <CourseNotificationToast course={newestOpenCourse} />
      <Nav />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-16 px-4 lg:px-12">
        {/* Background Video and Overlay */}
        <div className="hero-video-container">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="hero-video"
          >
            <source src={heroBgVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="hero-overlay"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full hero-content">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/20 backdrop-blur-md">
                <span className="text-xs font-bold text-blue-600 tracking-wider">NON PROFIT EDUCATION</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold text-[var(--text-main)] leading-[1.1]">
                Free & Quality <br />
                <span className="text-blue-600 inline-block min-w-[300px]">
                  {words[index].substring(0, subIndex)}
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className="inline-block w-[4px] h-[0.9em] bg-blue-600 ml-1 translate-y-2"
                  />
                </span>for All
              </h1>
              
              <p className="text-lg text-[var(--text-muted)] leading-relaxed max-w-xl">
                Empowering learners worldwide with accessible, high-quality education and industry-recognized certifications. Join 1M+ students today.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate("/allcourses")}
                  className="btn-primary px-8 py-4 rounded-full text-[16px] shadow-lg shadow-blue-600/20"
                >
                  Explore Courses
                </button>
                <button 
                  onClick={() => navigate("/signup")}
                  className="btn-secondary px-8 py-4 rounded-full text-[16px] backdrop-blur-md bg-white/5 border-white/10"
                >
                  Join Now
                </button>
              </div>
              
              {/* Social Proof */}
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  {recentStudents.length > 0 ? (
                    recentStudents.map((student, i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--bg-main)] bg-slate-200 overflow-hidden shadow-sm relative group z-10 hover:z-20 transition-all hover:scale-110">
                        <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover" />
                      </div>
                    ))
                  ) : (
                    [1, 2, 3].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--bg-main)] bg-slate-200 z-10 shadow-sm"></div>
                    ))
                  )}
                </div>
                <p className="text-sm text-[var(--text-muted)]">
                  <span className="font-bold text-[var(--text-main)] overflow-hidden inline-flex"><motion.span>{roundedCount}</motion.span>+</span> seekers joined this month
                </p>
              </div>
            </div>

            {/* Right Image/Graphic (Optional, keep it or modify) */}
            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 bg-blue-600/10 rounded-[40px] transform rotate-3 blur-sm"></div>
              <div className="relative bg-[var(--bg-surface)]/40 backdrop-blur-md p-2 rounded-[32px] shadow-2xl border border-white/10 overflow-hidden">
                <img 
                  src={heroImg} 
                  alt="Students collaborating" 
                  className="w-full h-auto rounded-[24px] opacity-90"
                />
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-600/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl"></div>
            </div>
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
