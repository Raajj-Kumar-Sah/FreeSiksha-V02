import React, { useState, useEffect } from 'react'
import logo from '../assets/logo.jpg'
import google from '../assets/google.jpg'
import security_auth_bg from '../assets/security_auth_bg.png'
import axios from 'axios'
import { serverUrl } from '../App'
import { MdOutlineRemoveRedEye, MdRemoveRedEye, MdArrowBack } from "react-icons/md";
import { useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../../utils/Firebase'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { useSearchParams } from 'react-router-dom'
import { FaChalkboardTeacher } from 'react-icons/fa'

function SignUp() {
    // Standard Auth Fields
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword]= useState("")
    const [role,setRole] = useState(searchParams.get('role') || "student")
    
    useEffect(() => {
        if (role === 'trainer') {
            navigate('/register-trainer');
        }
    }, [role, navigate]);
    
    // New Demographic Fields
    const [phone, setPhone] = useState("")
    const [age, setAge] = useState("")
    const [gender, setGender] = useState("Male")
    const [qualification, setQualification] = useState("12th")
    const [city, setCity] = useState("")

    // UI States
    const [show,setShow] = useState(false)
    const [loading,setLoading]= useState(false)
    
    // OTP States
    const [showOtpScreen, setShowOtpScreen] = useState(false)
    const [otp, setOtp] = useState("")
    const [otpEmail, setOtpEmail] = useState("")

    const handleSignUp = async () => {
        if(!name || !email || !password || !phone || !age || !city) {
            return toast.error("Please fill all required fields.");
        }
        setLoading(true)
        try {
            const payload = { 
                name, email, password, roleValue: role, 
                phone, age: Number(age), gender, qualification, city 
            }
            const result = await axios.post(serverUrl + "/api/auth/signup" , payload, {withCredentials:true})
            
            if (result.data.requireOtp) {
                setOtpEmail(result.data.email);
                setShowOtpScreen(true);
                toast.success(result.data.message || (role === 'trainer' ? "Application submitted! Waiting for approval." : "OTP sent to your email!"));
            } else {
                // Store token for Hybrid Auth fallback
                if (result.data.token) {
                    localStorage.setItem('token', result.data.token);
                }
                dispatch(setUserData(result.data.user || result.data));
                navigate("/");
                toast.success("SignUp Successfully");
            }
            setLoading(false)
        } 
        catch (error) {
            console.log(error)
            setLoading(false)
            toast.error(error.response?.data?.message || "Signup failed");
        }
    }

    const handleVerifyOtp = async () => {
        if(!otp) return toast.error("Please enter the OTP");
        setLoading(true)
        try {
            const result = await axios.post(serverUrl + "/api/auth/verify-auth-otp", { email: otpEmail, otp }, {withCredentials:true});
            
            // Hybrid Auth storage
            if (result.data.token) {
                localStorage.setItem('token', result.data.token);
            }
            
            dispatch(setUserData(result.data.user || result.data));
            navigate("/");
            toast.success("Account Verified & Logged In!");
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
            toast.error(error.response?.data?.message || "Invalid OTP");
        }
    }

    const googleSignUp = async () => {
        try {
            const response = await signInWithPopup(auth,provider)
            let user = response.user
            let email = user.email;
            let photoUrl = user.photoURL;
            
            const result = await axios.post(serverUrl + "/api/auth/googlesignup" , { name, email, photoUrl, role }, { withCredentials: true } )
            
            // Hybrid Auth storage
            if (result.data.token) {
                localStorage.setItem('token', result.data.token);
            }
            
            dispatch(setUserData(result.data.user || result.data))
            navigate("/")
            toast.success("SignUp Successfully")
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Google Signup failed")
        }
    }

  return (
    <div className='min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-4 py-12 font-sans'>
        <div className='w-full max-w-6xl bg-[var(--bg-surface)] shadow-2xl rounded-[32px] flex flex-col md:flex-row overflow-hidden border border-[var(--border-color)] relative my-8 lg:my-12'>
            
            {/* Left Side: Form Section */}
            <div className='w-full md:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-[var(--bg-surface)] relative z-10'>
                <button onClick={() => navigate("/")} className="w-fit mb-8 flex items-center gap-2 text-[var(--text-muted)] hover:text-blue-600 font-bold transition-colors group z-20 bg-[var(--bg-surface)] px-4 py-2 rounded-xl border border-[var(--border-color)] shadow-sm self-start">
                    <MdArrowBack className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Home</span>
                </button>
                <div className='w-full max-w-md mx-auto space-y-8 pb-8'>
                    
                    {!showOtpScreen ? (
                        <>
                            <div className='space-y-2 text-center md:text-left'>
                                <img src={logo} alt="FreeSiksha Logo" className="h-16 w-16 object-contain mx-auto md:mx-0 mb-4 rounded-2xl shadow-sm border border-[var(--border-color)] p-1 bg-white" />
                                <h1 className='font-black text-[var(--text-main)] text-3xl md:text-4xl tracking-tight'>Let's get Started</h1>
                                <h2 className='text-[var(--text-muted)] font-medium text-base'>Create your FreeSiksha account</h2>
                            </div>
                            
                            <form className='space-y-5' onSubmit={(e)=>e.preventDefault()}>
                                {/* Core Fields */}
                                <div className='space-y-2'>
                                    <label htmlFor="name" className='text-xs font-bold text-[var(--text-main)] uppercase tracking-wider ml-1'>Name</label>
                                    <input id='name' type="text" className='w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium shadow-sm' placeholder='Amit Sharma' onChange={(e)=>setName(e.target.value)} value={name} />
                                </div>

                                <div className='space-y-2'>
                                    <label htmlFor="email" className='text-xs font-bold text-[var(--text-main)] uppercase tracking-wider ml-1'>Email Address (OTP requires active email)</label>
                                    <input id='email' type="email" className='w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium shadow-sm' placeholder='amit.sharma@gmail.com' onChange={(e)=>setEmail(e.target.value)} value={email} />
                                </div>
                                
                                {/* 2-Col Grid for Demographics */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className='space-y-2'>
                                        <label htmlFor="phone" className='text-xs font-bold text-[var(--text-main)] uppercase tracking-wider ml-1'>Phone No.</label>
                                        <input id='phone' type="tel" className='w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium shadow-sm' placeholder='e.g. 9876543210' onChange={(e)=>setPhone(e.target.value)} value={phone} />
                                    </div>
                                    <div className='space-y-2'>
                                        <label htmlFor="age" className='text-xs font-bold text-[var(--text-main)] uppercase tracking-wider ml-1'>Age</label>
                                        <input id='age' type="number" min="10" max="100" className='w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium shadow-sm' placeholder='e.g 22' onChange={(e)=>setAge(e.target.value)} value={age} />
                                    </div>

                                    <div className='space-y-2'>
                                        <label htmlFor="gender" className='text-xs font-bold text-[var(--text-main)] uppercase tracking-wider ml-1'>Gender</label>
                                        <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className='w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium shadow-sm appearance-none'>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className='space-y-2'>
                                        <label htmlFor="qualification" className='text-xs font-bold text-[var(--text-main)] uppercase tracking-wider ml-1'>Qualification</label>
                                        <select id="qualification" value={qualification} onChange={(e) => setQualification(e.target.value)} className='w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium shadow-sm appearance-none'>
                                            <option value="10th">10th</option>
                                            <option value="12th">12th</option>
                                            <option value="Diploma">Diploma</option>
                                            <option value="Graduation">Graduation</option>
                                            <option value="Post graduation">Post graduation</option>
                                        </select>
                                    </div>

                                    <div className='space-y-2 col-span-2'>
                                        <label htmlFor="city" className='text-xs font-bold text-[var(--text-main)] uppercase tracking-wider ml-1'>City</label>
                                        <input id='city' type="text" className='w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium shadow-sm' placeholder='Mumbai, Maharashtra' onChange={(e)=>setCity(e.target.value)} value={city} />
                                    </div>
                                </div>

                                <div className='space-y-2 relative'>
                                    <label htmlFor="password" className='text-xs font-bold text-[var(--text-main)] uppercase tracking-wider ml-1'>Password</label>
                                    <div className="relative">
                                        <input id='password' type={show ? "text" : "password"} className='w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium shadow-sm pr-12' placeholder='••••••••' onChange={(e)=>setPassword(e.target.value)} value={password} />
                                        <div className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-[var(--text-muted)] hover:text-blue-500 transition-colors" onClick={()=>setShow(!show)}>
                                            {show ? <MdRemoveRedEye className="w-5 h-5" /> : <MdOutlineRemoveRedEye className="w-5 h-5" />}
                                        </div>
                                    </div>
                                </div>

                                <div className='space-y-2 pt-2'>
                                   <label className='text-xs font-bold text-[var(--text-main)] uppercase tracking-wider ml-1'>I am a...</label>
                                   <div className='flex items-center gap-3'>
                                      <button type="button" className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all border ${role === 'student' ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-500/30 shadow-md" : "bg-[var(--bg-main)] text-[var(--text-muted)] border-[var(--border-color)] hover:border-blue-300"}`} onClick={()=>setRole("student")}>
                                        Student
                                      </button>
                                      <button type="button" className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all border ${role === 'trainer' ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-500/30 shadow-md" : "bg-[var(--bg-main)] text-[var(--text-muted)] border-[var(--border-color)] hover:border-blue-300"}`} onClick={()=>setRole("trainer")}>
                                        Trainer
                                      </button>
                                   </div>
                                </div>
                                
                                <button className='w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-black shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2 mt-4' disabled={loading} onClick={handleSignUp}>
                                    {loading ? <ClipLoader size={24} color='white' /> : "Create Account"}
                                </button>
                            </form>
                            
                            <div className='flex items-center gap-4 opacity-70 mt-6'>
                                <div className='h-[1px] flex-1 bg-[var(--border-color)]'></div>
                                <span className='text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest'>Or continue with</span>
                                <div className='h-[1px] flex-1 bg-[var(--border-color)]'></div>
                            </div>
                            
                            <button className='w-full mt-6 bg-[var(--bg-main)] border-2 border-[var(--border-color)] hover:border-blue-500/30 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 text-[var(--text-main)] py-3.5 rounded-xl font-bold flex justify-center items-center gap-3 transition-all' onClick={googleSignUp}>
                                <img src={google} alt="Google" className='w-5 h-5' />
                                Sign up with Google
                            </button>
                            
                            <p className='text-center text-[var(--text-muted)] font-medium mt-6'>
                                Already have an account? <span className='text-blue-600 font-bold hover:underline cursor-pointer ml-1' onClick={()=>navigate("/login")}>Sign in here</span>
                            </p>
                        </>
                    ) : (
                        // OTP Verification Screen
                        <div className="flex flex-col items-center justify-center space-y-8 pt-10">
                            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-4 border-8 border-blue-50 dark:border-blue-900/20">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-blue-600 dark:text-blue-400">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                </svg>
                            </div>
                            <div className="text-center space-y-2">
                                <h2 className="text-3xl font-black text-[var(--text-main)]">Check your email</h2>
                                <p className="text-[var(--text-muted)] font-medium max-w-xs mx-auto">
                                    We've sent a 6-digit verification code to <span className="text-[var(--text-main)] font-bold">{otpEmail}</span>
                                </p>
                            </div>

                            <form className="w-full space-y-6" onSubmit={(e)=>e.preventDefault()}>
                                <div className="space-y-2">
                                    <label htmlFor="otp" className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider ml-1">Verification Code</label>
                                    <input 
                                        id="otp" 
                                        type="text" 
                                        maxLength={6}
                                        className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-5 py-4 text-center text-2xl tracking-[0.5em] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-black shadow-inner" 
                                        placeholder="······" 
                                        onChange={(e)=>setOtp(e.target.value)} 
                                        value={otp} 
                                    />
                                </div>
                                
                                <button className='w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-black shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2' disabled={loading || otp.length < 6} onClick={handleVerifyOtp}>
                                    {loading ? <ClipLoader size={24} color='white' /> : "Verify & Create Account"}
                                </button>
                                
                                <button type="button" className='w-full py-3 text-[var(--text-muted)] font-bold hover:text-[var(--text-main)] transition-colors' onClick={() => setShowOtpScreen(false)}>
                                    Back to Registration
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Right Side: Showcase Image */}
            <div 
                className='hidden md:flex w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden border-l border-[var(--border-color)] dark:border-blue-800 bg-cover bg-center'
                style={{ backgroundImage: `url(${security_auth_bg})` }}
            >
                {/* Dark overlay for better text/content blending */}
                <div className="absolute inset-0 bg-blue-900/70 dark:bg-black/60 backdrop-blur-[2px]"></div>
            </div>
            
        </div>
    </div>
  )
}

export default SignUp
