import React from 'react'
import { SiViaplay } from "react-icons/si";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";
import { LiaUikit } from "react-icons/lia";
import { MdAppShortcut } from "react-icons/md";
import { FaHackerrank } from "react-icons/fa";
import { TbBrandOpenai } from "react-icons/tb";
import { SiGoogledataproc } from "react-icons/si";
import { BsClipboardDataFill } from "react-icons/bs";
import { SiOpenaigym } from "react-icons/si";
import { useNavigate } from 'react-router-dom';
function ExploreCourses() {
  const navigate = useNavigate()
  return (
    <div className='w-full min-h-[50vh] flex flex-col lg:flex-row items-center justify-center gap-12 py-16 px-6 lg:px-12'>
        <div className='w-full lg:w-[40%] flex flex-col items-center lg:items-start text-center lg:text-left justify-center gap-4'>
          <h2 className='text-4xl lg:text-5xl font-black text-main leading-tight'>Explore<br/>Our Courses</h2>
          <p className='text-base sm:text-lg text-muted max-w-md'>Quality education at your fingertips. Discover our wide range of professional courses today.</p>
          <button className='px-8 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl text-lg font-bold flex items-center gap-3 mt-4 hover:scale-105 transition-all shadow-xl' onClick={()=>navigate("/allcourses")}>
            Explore Courses <SiViaplay className='w-6 h-6' />
          </button>
        </div>
        <div className='w-full lg:w-[60%] flex items-center justify-center gap-6 sm:gap-10 flex-wrap'>
          <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center'>
            <div className='w-[100px] h-[90px] bg-blue-50/10 rounded-lg flex items-center justify-center '><TbDeviceDesktopAnalytics className='w-[60px] h-[60px] text-blue-500' /></div>
            <span className="text-main">Web Development</span>
          </div>
          <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center '>
            <div className='w-[100px] h-[90px] bg-emerald-50/10 rounded-lg flex items-center justify-center '><LiaUikit className='w-[60px] h-[60px] text-emerald-500' /></div>
            <span className="text-main">UI UX Designing</span>
          </div>
          <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center'>
            <div className='w-[100px] h-[90px] bg-rose-50/10 rounded-lg flex items-center justify-center '><MdAppShortcut className='w-[50px] h-[50px] text-rose-500' /></div>
            <span className="text-main">App Development</span>
          </div>
          <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center'>
            <div className='w-[100px] h-[90px] bg-purple-50/10 rounded-lg flex items-center justify-center '><FaHackerrank className='w-[55px] h-[55px] text-purple-500' /></div>
            <span className="text-main">Ethical Hacking</span>
          </div>
          <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center'>
            <div className='w-[100px] h-[90px] bg-indigo-50/10 rounded-lg flex items-center justify-center '><TbBrandOpenai className='w-[55px] h-[55px] text-indigo-500' /></div>
            <span className="text-main">AI/ML</span>
          </div>
          <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center'>
            <div className='w-[100px] h-[90px] bg-orange-50/10 rounded-lg flex items-center justify-center '><SiGoogledataproc className='w-[45px] h-[45px] text-orange-500' /></div>
            <span className="text-main">Data Science</span>
          </div>
          <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center '>
            <div className='w-[100px] h-[90px] bg-cyan-50/10 rounded-lg flex items-center justify-center '><BsClipboardDataFill className='w-[50px] h-[50px] text-cyan-500' /></div>
            <span className="text-main">Data Analytics</span>
          </div>
          <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center'>
            <div className='w-[100px] h-[90px] bg-teal-50/10 rounded-lg flex items-center justify-center '><SiOpenaigym className='w-[50px] h-[50px] text-teal-500' /></div>
            <span className="text-main">AI Tools</span>
          </div>
        </div>

      
    </div>
  )
}

export default ExploreCourses
