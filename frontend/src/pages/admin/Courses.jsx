import React, { useEffect } from 'react'

import { FaEdit } from "react-icons/fa";

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { setCreatorCourseData } from '../../redux/courseSlice';
import img1 from "../../assets/empty.jpg"
import { FaArrowLeftLong } from "react-icons/fa6";
import Nav from "../../components/Nav";

function Courses() {

  let navigate = useNavigate()
  let dispatch = useDispatch()

  const { creatorCourseData, courseData } = useSelector(state => state.course)

  useEffect(() => {
    const getCreatorData = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/course/getcreatorcourses", { withCredentials: true })

        await dispatch(setCreatorCourseData(result.data))


        console.log(result.data)

      } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)
      }

    }
    getCreatorData()
  }, [])

  const togglePublish = async (courseId, currentStatus) => {
    try {
      const result = await axios.post(`${serverUrl}/api/course/editcourse/${courseId}`, { isPublished: !currentStatus }, { withCredentials: true })
      
      // Update creatorCourseData
      const updatedCreatorCourses = creatorCourseData.map(c => c._id === courseId ? result.data : c)
      dispatch(setCreatorCourseData(updatedCreatorCourses))
      
      // Update general courseData (published list)
      if (result.data.isPublished) {
        if (!courseData.find(c => c._id === courseId)) {
          dispatch(setCourseData([result.data, ...courseData]))
        } else {
          dispatch(setCourseData(courseData.map(c => c._id === courseId ? result.data : c)))
        }
      } else {
        dispatch(setCourseData(courseData.filter(c => c._id !== courseId)))
      }
      
      toast.success(result.data.isPublished ? "Course Published" : "Course Unpublished")
    } catch (error) {
      console.error(error)
      toast.error("Failed to update status")
    }
  }



  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      <Nav />
      
      <div className="w-full px-6 py-10 space-y-8 mt-[72px] max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex items-center gap-2 group cursor-pointer w-fit" onClick={() => navigate("/dashboard")}>
                <FaArrowLeftLong className='text-[var(--text-main)] group-hover:-translate-x-1 transition-transform' />
                <span className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider">Dashboard</span>
            </div>
            
            <button className="btn-primary py-3 px-6 rounded-xl font-bold shadow-lg shadow-blue-500/20 w-full md:w-auto" onClick={() => navigate("/createcourses")}>
                + Create New Course
            </button>
        </div>

        <div className="space-y-1 mb-8">
            <h1 className="text-3xl font-black text-[var(--text-main)]">Your <span className="text-blue-600">Courses</span></h1>
            <p className="text-[var(--text-muted)] text-sm">Manage, publish, and edit all your active and drafted courses here.</p>
        </div>


        {/* Desktop Layout - Table */}
        <div className="hidden md:block bg-[var(--bg-surface)] rounded-[32px] shadow-xl border border-[var(--border-color)] overflow-hidden">
          <table className="min-w-full text-sm text-left">
            <thead className="border-b border-[var(--border-color)] bg-[var(--bg-main)]">
              <tr>
                <th className="py-5 px-6 font-bold text-[var(--text-muted)] uppercase tracking-wider text-xs">Course Details</th>
                <th className="py-5 px-6 font-bold text-[var(--text-muted)] uppercase tracking-wider text-xs">Status</th>
                <th className="py-5 px-6 font-bold text-[var(--text-muted)] uppercase tracking-wider text-xs text-right text-transparent select-none">Action</th>
              </tr>
            </thead>
            <tbody>
              {creatorCourseData?.map((course, index) => (
                <tr key={index} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-main)] transition-colors group">
                  <td className="py-4 px-6 flex items-center gap-5">
                    {course?.thumbnail ? (
                        <img src={course?.thumbnail} alt="Thumbnail" className="w-16 h-12 object-cover rounded-xl shadow-sm border border-[var(--border-color)]" />
                    ) : (
                        <div className="w-16 h-12 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)] flex items-center justify-center">
                            <img src={img1} alt='Fallback' className="w-full h-full object-cover rounded-xl opacity-50" />
                        </div>
                    )}
                    <span className="font-bold text-[var(--text-main)] line-clamp-1 max-w-sm">{course?.title}</span>
                  </td>
                  <td className="py-4 px-6">
                    <button 
                      onClick={() => togglePublish(course._id, course.isPublished)}
                      className={`px-4 py-1.5 justify-center rounded-full text-xs font-bold transition-all shadow-sm ${course?.isPublished ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20" : "text-amber-600 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-500/20"}`}
                    >
                      {course?.isPublished ? "● Published" : "● Draft"}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button 
                        onClick={() => navigate(`/addcourses/${course?._id}`)}
                        className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-blue-600 hover:border-blue-200 dark:hover:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all shadow-sm"
                    >
                        <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {creatorCourseData?.length === 0 && (
              <div className="text-center py-16">
                  <p className="text-[var(--text-muted)] font-medium">You haven't created any courses yet.</p>
              </div>
          )}
        </div>


        {/* Mobile Layout - Cards */}
        <div className="md:hidden space-y-4">
          {creatorCourseData?.map((course, index) => (
            <div key={index} className="bg-[var(--bg-surface)] rounded-2xl shadow-lg border border-[var(--border-color)] overflow-hidden">
              <div className="p-4 flex gap-4 items-start">
                 {course?.thumbnail ? (
                    <img src={course?.thumbnail} alt="Thumbnail" className="w-20 h-16 rounded-xl object-cover shadow-sm border border-[var(--border-color)]" />
                ) : (
                    <div className="w-20 h-16 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)] flex items-center justify-center">
                        <img src={img1} alt='Fallback' className="w-full h-full object-cover rounded-xl opacity-50" />
                    </div>
                )}
                
                <div className="flex-1 space-y-1">
                  <h2 className="font-bold text-[var(--text-main)] text-sm line-clamp-2 leading-tight">{course?.title}</h2>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[var(--border-color)]">
                    <button 
                        onClick={() => togglePublish(course._id, course.isPublished)}
                        className={`px-3 py-1 flex-1 text-[10px] rounded-lg font-bold transition-colors border ${course?.isPublished ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" : "text-amber-600 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20"}`}
                    >
                        {course?.isPublished ? "Published" : "Draft"}
                    </button>
                    <button 
                        onClick={() => navigate(`/addcourses/${course?._id}`)}
                        className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-blue-600 transition-colors"
                    >
                        <FaEdit className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
           {creatorCourseData?.length === 0 && (
              <div className="text-center py-10 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)]">
                  <p className="text-[var(--text-muted)] text-sm font-medium">No courses found.</p>
              </div>
          )}
        </div>
      </div>
    </div>
  );

}

export default Courses
