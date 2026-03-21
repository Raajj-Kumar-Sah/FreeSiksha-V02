import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6";

function Profile() {
  let {userData} = useSelector(state=>state.user)
  let navigate = useNavigate()

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-4 py-10 flex items-center justify-center">
      <div className="bg-[var(--bg-surface)] shadow-lg border border-[var(--border-color)] rounded-3xl p-10 max-w-xl w-full relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
        
        <div className="flex items-center gap-2 mb-8 group/back cursor-pointer w-fit" onClick={()=>navigate("/")}>
          <FaArrowLeftLong className='text-[var(--text-main)] group-hover/back:-translate-x-1 transition-transform' />
          <span className="text-sm font-medium text-[var(--text-main)]">Back to Home</span>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            {userData?.photoUrl ? (
              <img src={userData.photoUrl} alt="Profile" className="w-28 h-28 rounded-3xl object-cover border-4 border-[var(--bg-surface)] shadow-xl" />
            ) : (
              <div className="w-28 h-28 rounded-3xl bg-blue-600 text-white flex items-center justify-center text-4xl font-black border-4 border-[var(--bg-surface)] shadow-xl">
                {userData?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 border-4 border-[var(--bg-surface)] rounded-full shadow-lg"></div>
          </div>
          
          <h2 className="text-3xl font-black mt-6 text-[var(--text-main)]">{userData?.name || "User"}</h2>
          <div className="inline-flex items-center px-4 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-[10px] font-bold tracking-widest uppercase mt-2">
            {userData.role}
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-10 space-y-6">
          <div className="p-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)]">
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Email Address</p>
            <p className="text-[var(--text-main)] font-medium">{userData?.email || "N/A"}</p>
          </div>

          <div className="p-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)]">
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">About Me</p>
            <p className="text-[var(--text-main)] leading-relaxed italic">"{userData?.description || "No bio added yet."}"</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)] text-center">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Courses</p>
              <p className="text-2xl font-black text-[var(--text-main)]">{userData?.enrolledCourses?.length || 0}</p>
            </div>
            <div className="p-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)] text-center">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Certificates</p>
              <p className="text-2xl font-black text-[var(--text-main)]">0</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10">
          <button 
            className="w-full btn-primary py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20" 
            onClick={()=>navigate("/editprofile")}
          >
            Edit Profile Settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
