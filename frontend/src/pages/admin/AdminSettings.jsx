import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../../config';
import { toast } from 'react-toastify';
import { FaUserShield, FaKey, FaSave, FaUserEdit, FaLock, FaShieldAlt } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

const AdminSettings = () => {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [settings, setSettings] = useState({
        username: '',
        oldPassword: '',
        newUsername: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchAdminSettings();
    }, []);

    const fetchAdminSettings = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/admin/settings`, { withCredentials: true });
            setSettings(prev => ({ ...prev, username: res.data.username, newUsername: res.data.username }));
        } catch (error) {
            toast.error("Failed to load settings");
        } finally {
            setFetching(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        if (!settings.oldPassword) return toast.error("Please enter current password for security verification");
        if (settings.newPassword && settings.newPassword !== settings.confirmPassword) {
            return toast.error("Passwords do not match");
        }

        setLoading(true);
        try {
            await axios.put(`${serverUrl}/api/admin/settings`, {
                oldPassword: settings.oldPassword,
                newUsername: settings.newUsername,
                newPassword: settings.newPassword
            }, { withCredentials: true });
            
            toast.success("Security Credentials Updated Successfully");
            setSettings(prev => ({
                ...prev,
                username: prev.newUsername,
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update credentials");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return (
        <div className="flex justify-center p-20"><ClipLoader color="#2563eb" /></div>
    );

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="bg-gray-900 rounded-[32px] overflow-hidden shadow-2xl border border-gray-800">
                <div className="p-10 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800">
                   <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/30 text-blue-500">
                            <FaShieldAlt size={30} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tight">System <span className="text-blue-500">Security</span></h2>
                            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">Manage Administrative Access & Identity</p>
                        </div>
                   </div>
                   <div className="hidden md:block">
                        <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest border border-emerald-500/20">
                            Verified Encrypted Session
                        </span>
                   </div>
                </div>

                <form onSubmit={handleUpdate} className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Identity Section */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-white font-black uppercase text-xs tracking-widest mb-6 border-l-4 border-blue-500 pl-4">Administrative Identity</h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Current Username</label>
                                    <div className="relative">
                                        <FaUserShield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                        <input 
                                            type="text" 
                                            value={settings.username}
                                            disabled
                                            className="w-full bg-gray-800/50 border border-gray-700/50 text-gray-400 px-12 py-4 rounded-2xl font-black text-sm cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest pl-1">New Username</label>
                                    <div className="relative">
                                        <FaUserEdit className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            type="text" 
                                            value={settings.newUsername}
                                            onChange={(e) => setSettings({...settings, newUsername: e.target.value})}
                                            className="w-full bg-gray-800 border-2 border-transparent focus:border-blue-600/50 text-white px-12 py-4 rounded-2xl font-black text-sm transition-all outline-none"
                                            placeholder="Update admin username"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-600/5 p-6 rounded-2xl border border-blue-600/10">
                            <p className="text-[10px] text-blue-400 font-bold leading-relaxed uppercase tracking-wider">
                                <FaShieldAlt className="inline mr-2" />
                                Changing credentials will invalidate current environment variable fallbacks in .env and switch to database-driven authentication.
                            </p>
                        </div>
                    </div>

                    {/* Security Section */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-white font-black uppercase text-xs tracking-widest mb-6 border-l-4 border-emerald-500 pl-4">Access Credentials</h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest pl-1">Current Password (Required)</label>
                                    <div className="relative">
                                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            type="password" 
                                            required
                                            value={settings.oldPassword}
                                            onChange={(e) => setSettings({...settings, oldPassword: e.target.value})}
                                            className="w-full bg-gray-800 border-2 border-emerald-500/20 focus:border-emerald-500 text-white px-12 py-4 rounded-2xl font-black text-sm transition-all outline-none"
                                            placeholder="Enter old password"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">New Password</label>
                                    <div className="relative">
                                        <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            type="password" 
                                            value={settings.newPassword}
                                            onChange={(e) => setSettings({...settings, newPassword: e.target.value})}
                                            className="w-full bg-gray-800 border-2 border-transparent focus:border-blue-600/50 text-white px-12 py-4 rounded-2xl font-black text-sm transition-all outline-none"
                                            placeholder="Leave blank to keep current"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Confirm New Password</label>
                                    <div className="relative">
                                        <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            type="password" 
                                            value={settings.confirmPassword}
                                            onChange={(e) => setSettings({...settings, confirmPassword: e.target.value})}
                                            className="w-full bg-gray-800 border-2 border-transparent focus:border-blue-600/50 text-white px-12 py-4 rounded-2xl font-black text-sm transition-all outline-none"
                                            placeholder="Re-type new password"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 rounded-2xl font-black shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
                                loading ? 'bg-gray-800 text-gray-600' : 'bg-blue-600 hover:bg-blue-500 text-white'
                            }`}
                        >
                            {loading ? <ClipLoader size={20} color="#666" /> : <><FaSave /> Commit Identity Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminSettings;
