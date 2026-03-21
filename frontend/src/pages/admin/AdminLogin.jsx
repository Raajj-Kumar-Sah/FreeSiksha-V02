import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import security_auth_bg from '../../assets/security_auth_bg.png';
import logo from '../../assets/logo.jpg';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setUserData } from '../../redux/userSlice';

export default function AdminLogin() {
    const { userData } = useSelector(state => state.user);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (userData?.role === "admin") {
            navigate("/admin");
        }
    }, [userData, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${serverUrl}/api/admin/login`, { username, password }, { withCredentials: true });
            
            // Store token for Hybrid Auth fallback
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
            }

            // Set user data directly from login response to avoid race conditions
            if (res.data.admin) {
                dispatch(setUserData(res.data.admin));
            }
            
            navigate("/admin");
            
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-black">
            {/* Left Side: Branding / Security Graphic */}
            <div 
                className="hidden md:flex w-1/2 flex-col justify-center items-center relative overflow-hidden bg-cover bg-center border-r border-gray-800"
                style={{ backgroundImage: `url(${security_auth_bg})` }}
            >
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
                <div className="z-10 flex flex-col items-center">
                    <img src={logo} alt="FreeSiksha Admin" className="w-24 h-24 rounded-2xl drop-shadow-2xl border border-gray-700" />
                    <h1 className="text-4xl font-black text-white mt-6 tracking-widest text-center">SYSTEM <span className="text-blue-500">OVERRIDE</span></h1>
                    <p className="text-gray-400 mt-4 max-w-sm text-center">Restricted access portal for authorized Super Administrators only.</p>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-gray-950 p-8">
                <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <h2 className="text-3xl font-black text-white mb-8">Admin Access</h2>
                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Admin Username</label>
                            <input 
                                type="text" 
                                className="w-full px-5 py-4 bg-gray-950/50 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                placeholder="master_admin" 
                                onChange={(e)=>setUsername(e.target.value)} 
                                value={username} 
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Master Password</label>
                            <input 
                                type="password" 
                                className="w-full px-5 py-4 bg-gray-950/50 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                placeholder="••••••••" 
                                onChange={(e)=>setPassword(e.target.value)} 
                                value={password} 
                                required 
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-900/50 flex justify-center items-center"
                        >
                            {loading ? <ClipLoader size={24} color="white"/> : "INITIALIZE SESSION"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
