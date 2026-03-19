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
    <>
    <nav className="fixed top-0 left-0 w-full z-50 glass h-[72px] flex items-center justify-between px-4 lg:px-12">
      {/* Logo Section */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <img src={logo} className="w-10 h-10 rounded-lg shadow-sm" alt="FreeSiksha Logo" />
          <span className="text-xl font-bold tracking-tight text-blue-600">FreeSiksha</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6 text-[15px] font-medium text-[var(--text-muted)]">
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
        <div className="hidden md:flex items-center bg-[var(--bg-main)] px-4 py-2 rounded-full border border-[var(--border-color)] focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <IoMdSearch className="text-[var(--text-muted)] text-xl cursor-pointer" onClick={handleSearch} />
          <input 
            type="text" 
            placeholder="Search courses..." 
            className="bg-transparent border-none focus:outline-none ml-2 text-sm w-48 lg:w-64 text-[var(--text-main)]"
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
                className="text-[var(--text-main)] font-medium px-4 py-2 hover:text-blue-600 transition-colors"
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
                  <div className="absolute top-14 right-0 w-48 bg-[var(--bg-surface)] rounded-2xl shadow-xl border border-[var(--border-color)] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button onClick={() => { navigate("/profile"); setShowPro(false); }} className="w-full text-left px-4 py-2 hover:bg-[var(--bg-main)] text-[var(--text-main)]">My Profile</button>
                    <button onClick={() => { navigate("/enrolledcourses"); setShowPro(false); }} className="w-full text-left px-4 py-2 hover:bg-[var(--bg-main)] text-[var(--text-main)]">My Courses</button>
                    {userData.role === "educator" && (
                        <button onClick={() => { navigate("/enrollments"); setShowPro(false); }} className="w-full text-left px-4 py-2 hover:bg-[var(--bg-main)] text-[var(--text-main)]">Manage Enrollments</button>
                    )}
                    <hr className="my-1 border-[var(--border-color)]" />
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-red-500/10 text-red-600 dark:text-red-400">Logout</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-[var(--bg-surface)] text-[var(--text-muted)] transition-all shadow-sm border border-[var(--border-color)]"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <FiSun className="text-xl text-yellow-500" /> : <FiMoon className="text-xl text-blue-600" />}
        </button>

        {/* Mobile Menu Toggle */}
        <button className="lg:hidden p-2 text-[var(--text-main)]" onClick={() => setShowHam(!showHam)}>
          {showHam ? <GiSplitCross className="text-2xl" /> : <GiHamburgerMenu className="text-2xl" />}
        </button>
      </div>
    </nav>

      {/* Mobile Drawer (Moved outside <nav> to fix transparency issues from glass class) */}
      <div className={`fixed inset-0 bg-[var(--bg-main)] z-[100] transform transition-transform duration-300 ${showHam ? 'translate-x-0' : 'translate-x-full'} lg:hidden flex flex-col`}>
        <div className="p-6 flex flex-col h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
                <img src={logo} className="w-8 h-8 rounded-md" alt="Logo" />
                <span className="text-xl font-bold text-blue-600">FreeSiksha</span>
            </div>
            <button onClick={() => setShowHam(false)} className="p-2 text-[var(--text-main)] bg-[var(--bg-surface)] rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                <GiSplitCross className="text-2xl" />
            </button>
          </div>

          <div className="flex flex-col gap-6 text-xl font-bold text-[var(--text-main)] mb-8 px-2">
            <Link to="/" onClick={() => setShowHam(false)} className="hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/about" onClick={() => setShowHam(false)} className="hover:text-blue-600 transition-colors">About</Link>
            <Link to="/allcourses" onClick={() => setShowHam(false)} className="hover:text-blue-600 transition-colors">Courses</Link>
            <Link to="/#blog" onClick={() => setShowHam(false)} className="hover:text-blue-600 transition-colors">Blog</Link>
            
            {!userData && (
                <Link to="/signup" onClick={() => setShowHam(false)} className="hover:text-blue-600 transition-colors">Join FreeSiksha</Link>
            )}

            {userData && (
                <div className="pt-4 border-t border-[var(--border-color)] flex flex-col gap-6 mt-2">
                    <span className="text-sm uppercase tracking-widest text-[var(--text-muted)] font-black">Account</span>
                    <Link to="/profile" onClick={() => setShowHam(false)} className="hover:text-blue-600 transition-colors">My Profile</Link>
                    <Link to="/enrolledcourses" onClick={() => setShowHam(false)} className="hover:text-blue-600 transition-colors">My Enrolled Courses</Link>
                    
                    {userData.role === "educator" && (
                        <>
                           <Link to="/dashboard" onClick={() => setShowHam(false)} className="hover:text-blue-600 transition-colors text-blue-500">Educator Dashboard</Link>
                           <Link to="/enrollments" onClick={() => setShowHam(false)} className="hover:text-blue-600 transition-colors">Manage Enrollments</Link>
                        </>
                    )}
                </div>
            )}
          </div>

          <div className="mt-auto space-y-4 pt-8">
            {!userData ? (
              <div className="flex flex-col gap-3">
                <button onClick={() => { navigate("/login"); setShowHam(false); }} className="w-full bg-[var(--bg-surface)] border-2 border-[var(--border-color)] text-[var(--text-main)] py-4 rounded-2xl font-black text-lg">Sign In</button>
                <button onClick={() => { navigate("/signup"); setShowHam(false); }} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-blue-500/30">Register Now</button>
              </div>
            ) : (
              <button 
                onClick={() => { handleLogout(); setShowHam(false); }} 
                className="w-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 py-4 rounded-2xl font-black text-lg border border-red-200 dark:border-red-900/50"
              >
                  Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Nav