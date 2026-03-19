import React from 'react';
import Nav from '../components/Nav';

import { useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";

function EnrolledCourse() {
  const navigate = useNavigate()

  const { userData } = useSelector((state) => state.user);

     
   
 

  return (
    <div className="min-h-screen w-full px-4 py-9 bg-[var(--bg-main)]">
      <Nav />
      
      <div className="max-w-7xl mx-auto mt-[72px] relative">
        <div className="flex items-center gap-2 mb-8 group cursor-pointer w-fit" onClick={()=>navigate("/")}>
          <FaArrowLeftLong className='text-[var(--text-main)] group-hover:-translate-x-1 transition-transform' />
          <span className="text-sm font-medium text-[var(--text-main)]">Back to Home</span>
        </div>

        <h1 className="text-4xl text-center font-black text-[var(--text-main)] mb-12">
          My Enrolled <span className="text-blue-600">Courses</span>
        </h1>

        {userData.enrolledCourses.length === 0 ? (
          <div className="bg-[var(--bg-surface)] rounded-3xl p-12 text-center border border-[var(--border-color)]">
            <p className="text-[var(--text-muted)] text-lg mb-6">You haven’t enrolled in any courses yet.</p>
            <button 
              onClick={() => navigate("/allcourses")}
              className="btn-primary px-8 py-3 rounded-xl font-bold"
            >
              Explore Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {userData.enrolledCourses.map((course) => (
              <div
                key={course._id}
                className="bg-[var(--bg-surface)] rounded-3xl shadow-lg overflow-hidden border border-[var(--border-color)] group hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {course.category}
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-lg font-bold text-[var(--text-main)] mb-2 line-clamp-1">{course.title}</h2>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-xs font-bold px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-md uppercase tracking-widest">{course.level}</span>
                  </div>
                  <button 
                    className="w-full btn-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10" 
                    onClick={()=>navigate(`/viewlecture/${course._id}`)}
                  >
                    Watch Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EnrolledCourse
