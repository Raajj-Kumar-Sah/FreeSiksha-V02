import React from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';

const RegistrationNotice = () => {
    const { courseData } = useSelector(state => state.course);

    if (!Array.isArray(courseData)) return null;

    // Logic: Find courses that closed within the last 30 days
    const closedCourses = courseData.filter(course => {
        if (!course.isPublished || !course.registrationDeadline) return false;
        
        const deadline = new Date(course.registrationDeadline);
        const today = new Date();
        
        // Show if deadline has passed
        return deadline < today;
    }).sort((a, b) => new Date(b.registrationDeadline) - new Date(a.registrationDeadline));

    if (!closedCourses || closedCourses.length === 0) return null;

    // Show the most recently closed course
    const latestClosed = closedCourses[0];
    const deadlineDate = new Date(latestClosed.registrationDeadline).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="w-full bg-red-600/10 border-b border-red-500/20 py-3 px-4 relative z-40 overflow-hidden"
            >
                <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
                    <FaExclamationTriangle className="text-red-500 shrink-0" />
                    <p className="text-sm md:text-base font-bold tracking-tight text-center">
                        <span className="text-[var(--text-main)]">Important: </span>
                        <span className="animate-blink-red uppercase mx-1">
                            the registration of {latestClosed.title} has been closed on {deadlineDate}
                        </span>
                    </p>
                </div>
                
                {/* Subtle Background Glow */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-red-500/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]"></div>
            </motion.div>
        </AnimatePresence>
    );
};

export default RegistrationNotice;
