import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaFire } from 'react-icons/fa';

const CourseNotificationToast = ({ course }) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!course) return;
    const hasSeen = sessionStorage.getItem(`seen_toast_${course._id}`);
    if (!hasSeen) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 2500);
      return () => clearTimeout(timer);
    }
  }, [course]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem(`seen_toast_${course._id}`, 'true');
  };

  const handleAction = () => {
    handleClose();
    navigate(`/viewcourse/${course._id}`);
  };

  if (!isVisible || !course) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full bg-[var(--bg-surface)] border-l-4 border-blue-500 rounded-2xl shadow-2xl p-4 flex gap-4 transition-all duration-500 animate-[bounce_1s_ease-in-out]">
      <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shrink-0">
        <FaFire size={24} className="animate-pulse" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Enrollment Open</span>
          <button onClick={handleClose} className="text-[var(--text-muted)] hover:text-red-500 transition-colors p-1">
            <FaTimes size={12} />
          </button>
        </div>
        <h4 className="font-bold text-[var(--text-main)] truncate">{course.title}</h4>
        <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-1 mb-3">{course.subTitle || "New course available."}</p>
        <button onClick={handleAction} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-md transition-colors">
          View & Enroll
        </button>
      </div>
    </div>
  );
};

export default CourseNotificationToast;
