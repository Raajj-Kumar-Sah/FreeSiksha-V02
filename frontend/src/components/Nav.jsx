import React, { useState } from 'react'
import logo from "../assets/logo.jpg"
import { IoMdPerson, IoMdSearch } from "react-icons/io";
import { GiHamburgerMenu, GiSplitCross } from "react-icons/gi";
import { useNavigate, Link } from 'react-router-dom';
import { serverUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from "react-icons/fi";

function Nav() {
  const [showHam, setShowHam] = useState(false)
  const [showPro, setShowPro] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { userData } = useSelector(state => state.user)
  const { isDarkMode, toggleTheme } = useTheme()

  const handleLogout = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
      dispatch(setUserData(null))
      toast.success("Logged out successfully")
    } catch (error) {
      console.error(error)
      toast.error("Logout failed")
    }
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (searchQuery.trim()) {
        navigate(`/searchwithai?query=${encodeURIComponent(searchQuery.trim())}`)
        setSearchQuery('')
      }
    }
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass h-[72px] flex items-center justify-between px-4 lg:px-12">
      {/* Logo Section */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <img src={logo} className="w-10 h-10 rounded-lg shadow-sm" alt="FreeSiksha Logo" />
          <span className="text-xl font-bold tracking-tight text-blue-600">FreeSiksha</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6 text-[15px] font-medium text-slate-600">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <Link to="/about" className="hover:text-blue-600 transition-colors">About</Link>
          <Link to="/allcourses" className="hover:text-blue-600 transition-colors">Courses</Link>
          <Link to="/signup" className="hover:text-blue-600 transition-colors">Join</Link>
          <Link to="/#blog" className="hover:text-blue-600 transition-colors">Blog</Link>
        </div>
      </div>

      {/* Action Section */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-slate-100 px-4 py-2 rounded-full border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <IoMdSearch className="text-slate-400 text-xl cursor-pointer" onClick={handleSearch} />
          <input 
            type="text" 
            placeholder="Search courses..." 
            className="bg-transparent border-none focus:outline-none ml-2 text-sm w-48 lg:w-64 text-slate-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        {/* Auth Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {!userData ? (
            <>
              <button 
                onClick={() => navigate("/login")}
                className="text-slate-700 font-medium px-4 py-2 hover:text-blue-600 transition-colors"
              >
                Login
              </button>
              <button 
                onClick={() => navigate("/signup")}
                className="btn-primary px-6 py-2.5 rounded-full text-sm"
              >
                Register
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              {userData.role === "educator" && (
                <button 
                  onClick={() => navigate("/dashboard")}
                  className="btn-secondary px-4 py-2 rounded-full text-sm"
                >
                  Dashboard
                </button>
              )}
              <div className="relative">
                <div 
                  className="w-10 h-10 rounded-full border-2 border-blue-100 p-0.5 cursor-pointer hover:border-blue-400 transition-all overflow-hidden"
                  onClick={() => setShowPro(!showPro)}
                >
                  {userData.photoUrl ? (
                    <img src={userData.photoUrl} className="w-full h-full rounded-full object-cover" alt="User Profile" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {userData?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                {showPro && (
                  <div className="absolute top-14 right-0 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button onClick={() => { navigate("/profile"); setShowPro(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700">My Profile</button>
                    <button onClick={() => { navigate("/enrolledcourses"); setShowPro(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700">My Courses</button>
                    <hr className="my-1 border-slate-100" />
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600">Logout</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all shadow-sm border border-slate-200 dark:border-slate-700"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <FiSun className="text-xl text-yellow-500" /> : <FiMoon className="text-xl text-blue-600" />}
        </button>

        {/* Mobile Menu Toggle */}
        <button className="lg:hidden p-2 text-slate-600" onClick={() => setShowHam(!showHam)}>
          {showHam ? <GiSplitCross className="text-2xl" /> : <GiHamburgerMenu className="text-2xl" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 bg-white z-[60] transform transition-transform duration-300 ${showHam ? 'translate-x-0' : 'translate-x-full'} lg:hidden`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-bold text-blue-600">FreeSiksha</span>
            <button onClick={() => setShowHam(false)} className="p-2"><GiSplitCross className="text-2xl" /></button>
          </div>

          <div className="flex flex-col gap-4 text-lg font-medium text-slate-700 mb-8">
            <Link to="/" onClick={() => setShowHam(false)}>Home</Link>
            <Link to="/about" onClick={() => setShowHam(false)}>About</Link>
            <Link to="/allcourses" onClick={() => setShowHam(false)}>Courses</Link>
          </div>

          <div className="mt-auto space-y-4">
            {!userData ? (
              <>
                <button onClick={() => navigate("/login")} className="w-full btn-secondary py-3">Login</button>
                <button onClick={() => navigate("/signup")} className="w-full btn-primary py-3">Register</button>
              </>
            ) : (
              <button onClick={handleLogout} className="w-full bg-red-50 text-red-600 py-3 rounded-xl">Logout</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Nav