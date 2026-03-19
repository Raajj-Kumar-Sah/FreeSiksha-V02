import React from 'react';
import Nav from '../../components/Nav';
import { useSelector } from "react-redux";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import img from "../../assets/empty.jpg"; // fallback photo
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";
function Dashboard() {
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user);
  const { creatorCourseData } = useSelector((state) => state.course);
  // update based on your store

  // Sample data - Replace with real API/course data
  const courseProgressData = creatorCourseData?.map(course => ({
    name: course.title.slice(0, 10) + "...",
    lectures: course.lectures.length || 0
  })) || [];

  const enrollData = creatorCourseData?.map(course => ({
    name: course.title.slice(0, 10) + "...",
    enrolled: course.enrolledStudents?.length || 0
  })) || [];

  const totalEarnings = creatorCourseData?.reduce((sum, course) => {
    const studentCount = course.enrolledStudents?.length || 0;
    const courseRevenue = course.price ? course.price * studentCount : 0;
    return sum + courseRevenue;
  }, 0) || 0;

  return (
    <div className="flex min-h-screen bg-[var(--bg-main)]">
      <Nav />
      
      <div className="w-full px-6 py-10 space-y-10 mt-[72px] relative max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-8 group cursor-pointer w-fit" onClick={()=>navigate("/")}>
          <FaArrowLeftLong className='text-[var(--text-main)] group-hover:-translate-x-1 transition-transform' />
          <span className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider">Home</span>
        </div>

        {/* Welcome Section */}
        <div className="bg-[var(--bg-surface)] rounded-[32px] shadow-xl p-8 flex flex-col md:flex-row items-center gap-8 border border-[var(--border-color)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16"></div>
          <img
            src={userData?.photoUrl || img}
            alt="Educator"
            className="w-32 h-32 rounded-3xl object-cover border-4 border-[var(--bg-main)] shadow-xl relative z-10"
          />
          <div className="text-center md:text-left space-y-4 flex-1">
            <div className="space-y-1">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Dashboard Overview</p>
              <h1 className="text-3xl font-black text-[var(--text-main)]">
                Welcome, {userData?.name || "Educator"} 👋
              </h1>
            </div>
            
            <div className="flex flex-wrap items-center gap-6">
              <div className="bg-[var(--bg-main)] px-6 py-3 rounded-2xl border border-[var(--border-color)] shadow-sm">
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Total Earnings</p>
                <h3 className='text-2xl font-black text-[var(--text-main)]'>₹{totalEarnings.toLocaleString()}</h3>
              </div>
              <div className="bg-[var(--bg-main)] px-6 py-3 rounded-2xl border border-[var(--border-color)] shadow-sm">
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Total Courses</p>
                <h3 className='text-2xl font-black text-[var(--text-main)]'>{creatorCourseData?.length || 0}</h3>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto mt-6">
              <button 
                className="btn-primary px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all flex-1" 
                onClick={() => navigate("/courses")}
              >
                Manage Courses
              </button>
              <button 
                className="bg-blue-50 dark:bg-blue-900/40 text-blue-600 px-8 py-3.5 rounded-2xl font-bold hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all flex-1 border border-blue-200 dark:border-blue-700" 
                onClick={() => navigate("/enrollments")}
              >
                Manage Enrollments
              </button>
            </div>
          </div>
        </div>

        {/* Graphs Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Course Progress Chart */}
          <div className="bg-[var(--bg-surface)] rounded-[32px] shadow-lg p-8 border border-[var(--border-color)]">
            <h2 className="text-xl font-black text-[var(--text-main)] mb-8 uppercase tracking-wider">Course Progress (Lectures)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseProgressData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 10, fontWeight: 700}}/>
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 10, fontWeight: 700}}/>
                <Tooltip 
                  contentStyle={{backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', borderRadius: '16px', color: 'var(--text-main)'}}
                  itemStyle={{color: '#2563eb', fontWeight: 'bold'}}
                />
                <Bar dataKey="lectures" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Enrolled Students Chart */}
          <div className="bg-[var(--bg-surface)] rounded-[32px] shadow-lg p-8 border border-[var(--border-color)]">
            <h2 className="text-xl font-black text-[var(--text-main)] mb-8 uppercase tracking-wider">Student Enrollment</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={enrollData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 10, fontWeight: 700}}/>
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 10, fontWeight: 700}}/>
                <Tooltip 
                  contentStyle={{backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', borderRadius: '16px', color: 'var(--text-main)'}}
                  itemStyle={{color: '#818cf8', fontWeight: 'bold'}}
                />
                <Bar dataKey="enrolled" fill="#818cf8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
