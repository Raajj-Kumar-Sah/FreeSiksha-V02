import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlayCircle } from 'react-icons/fa';
import { FaArrowLeftLong } from "react-icons/fa6";

function ViewLecture() {
  const { courseId } = useParams();
  const { courseData } = useSelector((state) => state.course);
  const {userData} = useSelector((state) => state.user)
  const selectedCourse = courseData?.find((course) => course._id === courseId);

  const [selectedLecture, setSelectedLecture] = useState(
    selectedCourse?.lectures?.[0] || null
  );
  const navigate = useNavigate()
  const courseCreator = userData?._id === selectedCourse?.creator ? userData : null;


  return (
    <div className="min-h-screen bg-[var(--bg-main)] p-6 flex flex-col lg:flex-row gap-8 mt-[72px]">
      
      {/* Left - Video & Course Info */}
      <div className="flex-1 space-y-6">
        <div className="bg-[var(--bg-surface)] rounded-[32px] shadow-xl border border-[var(--border-color)] p-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16"></div>
          
          {/* Header */}
          <div className="mb-8 overflow-hidden">
            <div className="flex items-center gap-3 mb-4 group cursor-pointer w-fit" onClick={()=>navigate(-1)}>
              <div className="w-8 h-8 rounded-full bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center group-hover:-translate-x-1 transition-transform">
                <FaArrowLeftLong className='text-[var(--text-main)] text-sm' />
              </div>
              <span className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider">Back to Course</span>
            </div>
            
            <h1 className="text-3xl font-black text-[var(--text-main)] leading-tight">{selectedCourse?.title}</h1>
            
            <div className="mt-4 flex flex-wrap gap-4">
              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-[10px] font-bold rounded-md uppercase tracking-widest">
                {selectedCourse?.category}
              </span>
              <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 text-[10px] font-bold rounded-md uppercase tracking-widest">
                {selectedCourse?.level}
              </span>
              <span className="text-[var(--text-muted)] text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                {selectedCourse?.lectures?.length} Lectures
              </span>
            </div>
          </div>

          {/* Video Player */}
          <div className="aspect-video bg-black rounded-3xl overflow-hidden mb-8 shadow-2xl ring-1 ring-white/10 group relative">
            {selectedLecture?.videoUrl ? (
              <video
                src={selectedLecture.videoUrl}
                controls
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <FaPlayCircle className="text-white text-3xl opacity-50" />
                </div>
                <p className="text-white/60 text-sm font-medium uppercase tracking-widest">Select a lecture from the sidebar to start</p>
              </div>
            )}
          </div>

          {/* Selected Lecture Details */}
          <div className="p-6 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)]">
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Current Lesson</p>
            <h2 className="text-xl font-bold text-[var(--text-main)]">{selectedLecture?.lectureTitle || "No Lecture Selected"}</h2>
          </div>
        </div>
      </div>

      {/* Right - Curriculum Sidebar */}
      <aside className="w-full lg:w-[400px] flex flex-col gap-6">
        <div className="bg-[var(--bg-surface)] rounded-[32px] shadow-xl border border-[var(--border-color)] p-6 overflow-hidden sticky top-[92px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-[var(--text-main)]">Curriculum</h2>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
              {selectedCourse?.lectures?.length || 0}
            </div>
          </div>

          <div className="flex flex-col gap-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 scrollbar-hide">
            {selectedCourse?.lectures?.length > 0 ? (
              selectedCourse.lectures.map((lecture, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedLecture(lecture)}
                  className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                    selectedLecture?._id === lecture._id
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-[var(--bg-main)] border-[var(--border-color)] text-[var(--text-main)] hover:border-blue-400 hover:bg-[var(--bg-surface)]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    selectedLecture?._id === lecture._id ? 'bg-white/20 text-white' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600'
                  }`}>
                    <FaPlayCircle className="text-lg" />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedLecture?._id === lecture._id ? 'text-white/70' : 'text-blue-600'}`}>Lesson {index + 1}</p>
                    <h4 className="text-sm font-bold truncate leading-tight">{lecture.lectureTitle}</h4>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-[var(--text-muted)] text-sm font-medium">No lectures found.</p>
              </div>
            )}
          </div>

          {/* Instructor Quick Info */}
          {courseCreator && (
            <div className="mt-8 pt-8 border-t border-[var(--border-color)]">
              <div className="flex items-center gap-4 p-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)]">
                <img
                  src={courseCreator.photoUrl || '/default-avatar.png'}
                  alt="Instructor"
                  className="w-12 h-12 rounded-xl object-cover border-2 border-[var(--bg-surface)] shadow-md"
                />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Instructor</p>
                  <h4 className="text-sm font-black text-[var(--text-main)] truncate">{courseCreator.name}</h4>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default ViewLecture;
