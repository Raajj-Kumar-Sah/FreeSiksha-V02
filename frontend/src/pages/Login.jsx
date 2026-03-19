import React, { useState } from 'react'
import logo from '../assets/logo.jpg'
import google from '../assets/google.jpg'
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

function Login() {
    // Auth Fields
    const [identifier, setIdentifier] = useState("")
    const [password, setPassword] = useState("")
    
    // UI States
    const navigate = useNavigate()
    const [show,setShow] = useState(false)
    const [loading,setLoading]= useState(false)
    const dispatch = useDispatch()
    
    // OTP States
    const [showOtpScreen, setShowOtpScreen] = useState(false)
    const [otp, setOtp] = useState("")
    const [otpEmail, setOtpEmail] = useState("")

    const handleLogin = async () => {
        if(!identifier) {
            return toast.error("Please enter your email or phone number.");
        }
        if(!password) {
            return toast.error("Please enter your password.");
        }
        setLoading(true)
        try {
            const payload = { identifier, password }
            const result = await axios.post(serverUrl + "/api/auth/login" , payload, {withCredentials:true})
            
            if (result.data.requireOtp) {
                setOtpEmail(result.data.email);
                setShowOtpScreen(true);
                toast.success(result.data.message || "OTP sent to your registered email!");
            } else {
                dispatch(setUserData(result.data));
                navigate("/");
                toast.success("Login Successfully");
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
            toast.error(error.response?.data?.message || "Login failed");
        }
    }

    const handleVerifyOtp = async () => {
        if(!otp) return toast.error("Please enter the OTP");
        setLoading(true)
        try {
            const result = await axios.post(serverUrl + "/api/auth/verify-auth-otp", { email: otpEmail, otp }, {withCredentials:true});
            dispatch(setUserData(result.data));
            navigate("/");
            toast.success("Account Verified & Logged In!");
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
            toast.error(error.response?.data?.message || "Invalid OTP");
        }
    }

    const googleLogin = async () => {
        try {
            const response = await signInWithPopup(auth,provider)
            let user = response.user
            let name = user.displayName;
            let email=user.email
            let role=""
            
            const result = await axios.post(serverUrl + "/api/auth/googlesignup" , {name , email , role}, {withCredentials:true} )
            dispatch(setUserData(result.data))
            navigate("/");
            toast.success("Login Successfully")
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Google Login failed")
        }
    }

  return (
    <div className='min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-4 py-12 font-sans'>
        <div className='w-full max-w-6xl bg-[var(--bg-surface)] shadow-2xl rounded-[32px] flex flex-col md:flex-row overflow-hidden border border-[var(--border-color)] min-h-[650px] relative'>
            
            {/* Floating Back Button */}
            <button onClick={() => navigate("/")} className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 text-[var(--text-muted)] hover:text-blue-600 font-bold transition-colors group z-20 bg-[var(--bg-surface)] px-4 py-2 rounded-xl shadow-sm border border-[var(--border-color)]">
                <MdArrowBack className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Home</span>
            </button>

            {/* Left Side: Form Section */}
            <div className='w-full md:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-[var(--bg-surface)] relative z-10 pt-20'>
                <div className='w-full max-w-md mx-auto space-y-8'>
                    
                    {!showOtpScreen ? (
                        <>
                            <div className='space-y-2 text-center md:text-left'>
                                <h1 className='font-black text-[var(--text-main)] text-3xl md:text-4xl tracking-tight'>Welcome Back</h1>
                                <h2 className='text-[var(--text-muted)] font-medium text-base'>Securely login to your learning dashboard</h2>
                            </div>
                            
                            <form className='space-y-5' onSubmit={(e)=>e.preventDefault()}>
                                <div className='space-y-2'>
                                    <label htmlFor="identifier" className='text-xs font-bold text-[var(--text-main)] uppercase tracking-wider ml-1'>Email Address or Phone Number</label>
                                    <input id='identifier' type="text" className='w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3.5 text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium shadow-sm' placeholder='name@example.com or 9876543210' onChange={(e)=>setIdentifier(e.target.value)} value={identifier} />
                                </div>
                                
                                <div className='space-y-2 relative'>
                                    <label htmlFor="password" className='text-xs font-bold text-[var(--text-main)] uppercase tracking-wider ml-1'>Password</label>
                                    <div className="relative">
                                        <input id='password' type={show ? "text" : "password"} className='w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3.5 text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium shadow-sm pr-12' placeholder='••••••••' onChange={(e)=>setPassword(e.target.value)} value={password} />
                                        <div className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-[var(--text-muted)] hover:text-blue-500 transition-colors" onClick={()=>setShow(!show)}>
                                            {show ? <MdRemoveRedEye className="w-5 h-5" /> : <MdOutlineRemoveRedEye className="w-5 h-5" />}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-end">
                                    <span className='text-sm font-bold text-blue-600 hover:text-blue-500 cursor-pointer transition-colors' onClick={()=>navigate("/forgotpassword")}>Forgot your password?</span>
                                </div>
                                
                                <button className='w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-black shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2' disabled={loading} onClick={handleLogin}>
                                    {loading ? <ClipLoader size={24} color='white' /> : "Sign In to Account"}
                                </button>
                            </form>
                            
                            <div className='flex items-center gap-4 opacity-70'>
                                <div className='h-[1px] flex-1 bg-[var(--border-color)]'></div>
                                <span className='text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest'>Or continue with</span>
                                <div className='h-[1px] flex-1 bg-[var(--border-color)]'></div>
                            </div>
                            
                            <button className='w-full bg-[var(--bg-main)] border-2 border-[var(--border-color)] hover:border-blue-500/30 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 text-[var(--text-main)] py-3.5 rounded-xl font-bold flex justify-center items-center gap-3 transition-all' onClick={googleLogin}>
                                <img src={google} alt="Google" className='w-5 h-5' />
                                Sign in with Google
                            </button>
                            
                            <p className='text-center text-[var(--text-muted)] font-medium'>
                                Don't have an account? <span className='text-blue-600 font-bold hover:underline cursor-pointer ml-1' onClick={()=>navigate("/signup")}>Create one now</span>
                            </p>
                        </>
                    ) : (
                        // OTP Verification Screen
                        <div className="flex flex-col items-center justify-center space-y-8 pt-6">
                            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-4 border-8 border-blue-50 dark:border-blue-900/20">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-blue-600 dark:text-blue-400">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                </svg>
                            </div>
                            <div className="text-center space-y-2">
                                <h2 className="text-3xl font-black text-[var(--text-main)]">Check your email</h2>
                                <p className="text-[var(--text-muted)] font-medium max-w-xs mx-auto">
                                    We've sent a 4-digit verification code to <span className="text-[var(--text-main)] font-bold">{otpEmail}</span>
                                </p>
                            </div>

                            <form className="w-full space-y-6" onSubmit={(e)=>e.preventDefault()}>
                                <div className="space-y-2">
                                    <label htmlFor="otp" className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider ml-1">Verification Code</label>
                                    <input 
                                        id="otp" 
                                        type="text" 
                                        maxLength={4}
                                        className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-5 py-4 text-center text-3xl tracking-[1em] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-black shadow-inner" 
                                        placeholder="····" 
                                        onChange={(e)=>setOtp(e.target.value)} 
                                        value={otp} 
                                    />
                                </div>
                                
                                <button className='w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-black shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2' disabled={loading || otp.length < 4} onClick={handleVerifyOtp}>
                                    {loading ? <ClipLoader size={24} color='white' /> : "Verify & Sign In"}
                                </button>
                                
                                <button type="button" className='w-full py-3 text-[var(--text-muted)] font-bold hover:text-[var(--text-main)] transition-colors' onClick={() => setShowOtpScreen(false)}>
                                    Back to Login
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Right Side: Security & Branding Graphic */}
            <div className='hidden md:flex w-1/2 bg-blue-600 relative flex-col items-center justify-center p-12 overflow-hidden border-l border-[var(--border-color)] dark:border-blue-800'>
                {/* Dynamic animated backgrounds */}
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-blue-500 blur-3xl opacity-60 animate-pulse"></div>
                    <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-800 blur-3xl opacity-60 animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30"></div>
                </div>
                
                <div className='relative z-10 w-full flex flex-col items-center text-center max-w-sm mx-auto space-y-8'>
                    {/* Floating Branding Badge */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[32px] shadow-2xl transform transition-transform hover:scale-105 duration-500 w-full">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-6 border border-white/30">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-widest drop-shadow-md">FREESIKSHA<span className="text-blue-300">.COM</span></h2>
                        <div className="h-1.5 w-16 bg-blue-400 mx-auto mt-6 rounded-full opacity-70"></div>
                    </div>
                    
                    {/* Security Value Props */}
                    <div className="w-full space-y-4 text-left">
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4 hover:bg-white/20 transition-colors cursor-default">
                            <div className="bg-blue-500/40 p-3 rounded-xl text-white border border-white/20 shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-white font-bold tracking-wide">Secure Authentication</h3>
                                <p className="text-blue-100 text-sm font-medium opacity-80">Enterprise-grade encryption limits</p>
                            </div>
                        </div>
                        
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4 hover:bg-white/20 transition-colors cursor-default">
                            <div className="bg-blue-500/40 p-3 rounded-xl text-white border border-white/20 shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-white font-bold tracking-wide">Data Privacy Ensured</h3>
                                <p className="text-blue-100 text-sm font-medium opacity-80">100% protection rating guaranteed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default Login
