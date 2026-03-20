import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import { serverUrl } from '../App'
import { toast } from 'react-toastify'

function ForgotPassword() {
    let navigate = useNavigate()
    const [step,setStep] = useState(1)
    const [email,setEmail] = useState("")
    const [otp,setOtp] = useState("")
    const [loading,setLoading]= useState(false)
    const [newpassword,setNewPassword]= useState("")
    const [conPassword,setConpassword]= useState("")

   const handleStep1 = async () => {
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/sendotp` , {email} , {withCredentials:true})
      console.log(result)
      setStep(2)
      toast.success(result.data.message)
      setLoading(false)
      
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
      setLoading(false)
    }
    
   }
    const handleStep2 = async () => {
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/verifyotp` , {email,otp} , {withCredentials:true})
      console.log(result)
      
      toast.success(result.data.message)
      setLoading(false)
      setStep(3)
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
      setLoading(false)
    }
    
   }
    const handleStep3 = async () => {
    setLoading(true)
    try {
      if(newpassword !== conPassword){
        return toast.error("password does not match")
      }
      const result = await axios.post(`${serverUrl}/api/auth/resetpassword` , {email,password:newpassword} , {withCredentials:true})
      console.log(result)
      toast.success(result.data.message)
      setLoading(false)
      navigate("/login")
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
      setLoading(false)
    }
    
   }


  return (
     <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] px-4">
      { step==1 && <div className="bg-[var(--bg-surface)] shadow-xl rounded-3xl p-10 max-w-md w-full border border-[var(--border-color)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full -mr-12 -mt-12"></div>
        <h2 className="text-3xl font-black mb-2 text-center text-[var(--text-main)]">
          Forgot <span className="text-blue-600">Password?</span>
        </h2>
        <p className="text-[var(--text-muted)] text-sm text-center mb-8">No worries! Enter your email to receive an OTP.</p>

          <form onSubmit={(e)=>e.preventDefault()} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-blue-600 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-5 py-3.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                placeholder="you@example.com"
                onChange={(e)=>setEmail(e.target.value)}
                value={email}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center" 
              disabled={loading} 
              onClick={handleStep1}
            >
              {loading ? <ClipLoader size={24} color='white'/> : "Send Reset OTP"}
            </button>
          </form>
        

        <div className="mt-8 text-center">
            <button onClick={()=>navigate("/login")} className="text-sm font-bold text-[var(--text-muted)] hover:text-blue-600 transition-colors uppercase tracking-widest">
                Back to Login
            </button>
        </div>
      </div>}

      {step==2 && <div className="bg-[var(--bg-surface)] shadow-xl rounded-3xl p-10 max-w-md w-full border border-[var(--border-color)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full -mr-12 -mt-12"></div>
        <h2 className="text-3xl font-black text-center text-[var(--text-main)] mb-2">
          Verify <span className="text-blue-600">OTP</span>
        </h2>
        <p className="text-[var(--text-muted)] text-sm text-center mb-8">Enter the 4-digit code sent to your email.</p>

          <form onSubmit={(e)=>e.preventDefault()} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-blue-600 uppercase tracking-widest ml-1">
                Verification Code
              </label>
              <input
                type="text"
                className="w-full px-5 py-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl text-[var(--text-main)] text-center text-2xl font-black tracking-[1em] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="0000"
                maxLength={4}
                onChange={(e)=>setOtp(e.target.value)}
                value={otp}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center" 
              disabled={loading} 
              onClick={handleStep2} 
            >
              {loading ? <ClipLoader size={24} color='white'/> : "Verify & Continue"}
            </button>
          </form>

          <div className="mt-8 text-center">
              <button onClick={()=>navigate("/login")} className="text-sm font-bold text-[var(--text-muted)] hover:text-blue-600 transition-colors uppercase tracking-widest">
                  Back to Login
              </button>
          </div>
      </div>}

      {step==3 && <div className="bg-[var(--bg-surface)] shadow-xl rounded-3xl p-10 max-w-md w-full border border-[var(--border-color)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full -mr-12 -mt-12"></div>
        <h2 className="text-3xl font-black text-center text-[var(--text-main)] mb-2">
          New <span className="text-blue-600">Password</span>
        </h2>
        <p className="text-[var(--text-muted)] text-sm text-center mb-8">Set a strong password to secure your account.</p>

        <form className="space-y-6" onSubmit={(e)=>e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-xs font-bold text-blue-600 uppercase tracking-widest ml-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-5 py-3.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              onChange={(e)=>setNewPassword(e.target.value)}
              value={newpassword}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-blue-600 uppercase tracking-widest ml-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-5 py-3.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              onChange={(e)=>setConpassword(e.target.value)}
              value={conPassword}
            />
          </div>

          <button
            type="submit"
            className="w-full btn-primary py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center" 
            onClick={handleStep3}
          >
            {loading ? <ClipLoader size={24} color='white'/> : "Reset Password"}
          </button>
        </form>

        <div className="mt-8 text-center" onClick={()=>navigate("/login")}>
            <button className="text-sm font-bold text-[var(--text-muted)] hover:text-blue-600 transition-colors uppercase tracking-widest">
                Back to Login
            </button>
        </div>
      </div>}
    </div>
  )
}

export default ForgotPassword
