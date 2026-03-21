import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { FaLock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import logo from '../assets/logo.jpg';

const SetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }
        if (password.length < 8) {
            return toast.error("Password must be at least 8 characters long");
        }

        setLoading(true);
        try {
            const res = await axios.post(`${serverUrl}/api/trainer/set-password/${token}`, { password });
            toast.success(res.data.message);
            setIsSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to set password");
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] p-4">
                <div className="max-w-md w-full bg-[var(--bg-surface)] p-12 rounded-[40px] shadow-2xl text-center space-y-6 border border-[var(--border-color)] animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCheckCircle className="text-4xl text-emerald-600" />
                    </div>
                    <h1 className="text-3xl font-black text-[var(--text-main)]">Password Set!</h1>
                    <p className="text-[var(--text-muted)] font-medium">
                        Your account is now active. You are being redirected to the login page...
                    </p>
                    <div className="flex justify-center">
                        <ClipLoader color="#10b981" size={30} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-[var(--bg-surface)] p-8 md:p-12 rounded-[48px] shadow-2xl border border-[var(--border-color)] space-y-10">
                <div className="flex flex-col items-center text-center space-y-4">
                    <img src={logo} alt="FreeSiksha" className="h-16 w-16 rounded-2xl shadow-sm mb-2" />
                    <h1 className="text-3xl font-black text-[var(--text-main)] tracking-tight">Active Your Account</h1>
                    <p className="text-[var(--text-muted)] font-medium text-sm">
                        Please set a strong password to activate your Trainer account and start teaching.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-[var(--text-main)] uppercase tracking-widest ml-1 flex items-center gap-2">
                            <FaLock className="text-blue-500" /> New Password
                        </label>
                        <input 
                            type="password" 
                            required 
                            autoFocus
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[var(--bg-main)] border-2 border-transparent focus:border-blue-600 px-6 py-4 rounded-2xl font-bold text-[var(--text-main)] placeholder-[var(--text-muted)] outline-none transition-all shadow-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-[var(--text-main)] uppercase tracking-widest ml-1 flex items-center gap-2">
                            <FaLock className="text-blue-500" /> Confirm Password
                        </label>
                        <input 
                            type="password" 
                            required 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-[var(--bg-main)] border-2 border-transparent focus:border-blue-600 px-6 py-4 rounded-2xl font-bold text-[var(--text-main)] placeholder-[var(--text-muted)] outline-none transition-all shadow-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-500/20 flex items-start gap-3">
                        <FaExclamationCircle className="text-blue-600 mt-1 shrink-0" />
                        <p className="text-xs font-bold text-blue-700 dark:text-blue-400 leading-relaxed uppercase tracking-wider">
                            Minimum 8 characters with letters and numbers recommended for safety.
                        </p>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[24px] font-black text-xl shadow-2xl shadow-blue-500/25 transition-all transform hover:-translate-y-1 active:translate-y-0.5 flex justify-center items-center gap-3"
                    >
                        {loading ? <ClipLoader size={24} color="white" /> : "Set Password & Activate"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SetPassword;
