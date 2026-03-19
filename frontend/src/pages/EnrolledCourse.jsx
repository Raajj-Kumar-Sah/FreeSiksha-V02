import React, { useState } from 'react';
import Nav from '../components/Nav';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from 'axios';
import { toast } from 'react-toastify';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';

function EnrolledCourse() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const [loadingId, setLoadingId] = useState(null);

  const handleUnenroll = async (courseId) => {
    if (!window.confirm("Are you sure you want to unenroll from this course? You will lose access to its lectures.")) return;
    setLoadingId(courseId);
    try {
        await axios.post(`${serverUrl}/api/course/${courseId}/unenroll`, {}, { withCredentials: true });
        toast.success("Successfully unenrolled from course");
        
        // Remove locally from redux
        const updatedUser = {
            ...userData,
            enrolledCourses: userData.enrolledCourses.filter(c => c._id !== courseId)
        };
        dispatch(setUserData(updatedUser));

    } catch (error) {
        toast.error("Failed to unenroll");
        console.error(error);
    } finally {
        setLoadingId(null);
    }
  };

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
                className="bg-[var(--bg-surface)] rounded-3xl shadow-lg overflow-hidden border border-[var(--border-color)] group hover:-translate-y-1 transition-all duration-300 flex flex-col"
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
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[var(--text-main)] mb-2">{course.title}</h2>
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-xs font-bold px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-md uppercase tracking-widest">{course.level}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mt-4">
                      <button 
                        className="w-full btn-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10" 
                        onClick={()=>navigate(`/viewlecture/${course._id}`)}
                      >
                        Watch Now
                      </button>
                      
                      <button 
                        disabled={loadingId === course._id}
                        className="w-full py-3 rounded-xl font-bold border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all disabled:opacity-50" 
                        onClick={()=>handleUnenroll(course._id)}
                      >
                        {loadingId === course._id ? "Removing..." : "Unenroll"}
                      </button>
                  </div>
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
