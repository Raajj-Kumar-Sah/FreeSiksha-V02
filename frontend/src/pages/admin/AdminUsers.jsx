import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { FaUserShield, FaBan, FaCheckCircle, FaTrash, FaFileExport, FaSearch } from 'react-icons/fa';

export default function AdminUsers({ role }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchUsers();
    }, [role]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${serverUrl}/api/admin/users?role=${role}`, { withCredentials: true });
            setUsers(res.data);
        } catch (error) {
            toast.error(`Failed to fetch ${role}s`);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (userId, newStatus) => {
        try {
            await axios.put(`${serverUrl}/api/admin/users/${userId}/status`, { status: newStatus }, { withCredentials: true });
            toast.success(`User marked as ${newStatus}`);
            fetchUsers();
        } catch (error) {
            toast.error("Status update failed");
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you absolutely sure you want to permanently delete this user? This action cannot be undone.")) return;
        
        try {
            await axios.delete(`${serverUrl}/api/admin/users/${userId}`, { withCredentials: true });
            toast.success("User permanently deleted");
            fetchUsers();
        } catch (error) {
            toast.error("Deletion failed");
        }
    };

    const handleExport = () => {
        window.open(`${serverUrl}/api/admin/export?role=${role}`, "_blank");
        toast.info(`Preparing ${role} records for export...`);
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between bg-gray-50 gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-black text-gray-900 capitalize">{role} Management</h2>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                        {users.length} Total
                    </span>
                </div>
                
                <div className="flex flex-1 max-w-md gap-2">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                        <input 
                            type="text" 
                            placeholder={`Search ${role}s...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 font-bold"
                        />
                    </div>
                    <button 
                        onClick={handleExport}
                        className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-black hover:bg-black transition-all shadow-sm"
                    >
                        <FaFileExport /> Export
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-20"><ClipLoader color="#2563eb" /></div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-gray-100 text-gray-400 text-[10px] uppercase font-black tracking-widest text-left">
                                <th className="p-6">Member Identity</th>
                                <th className="p-6 text-center">Platform Role</th>
                                <th className="p-6 text-center">Account Status</th>
                                <th className="p-6 text-right">Administrative Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.map(u => (
                                <tr key={u._id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 flex items-center justify-center font-black text-lg border border-blue-100">
                                                {u.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 leading-tight">{u.name}</p>
                                                <p className="text-xs text-gray-400 font-bold">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-center">
                                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border ${
                                            u.role === 'educator' ? 'bg-purple-50 text-purple-700 border-purple-100' : 
                                            u.role === 'volunteer' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-gray-50 text-gray-600 border-gray-100'
                                        }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-6 text-center">
                                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest
                                            ${u.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : ''}
                                            ${u.status === 'suspended' ? 'bg-orange-50 text-orange-700 border-orange-100' : ''}
                                            ${u.status === 'banned' ? 'bg-red-50 text-red-700 border-red-100' : ''}
                                            ${!u.status ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : ''} 
                                        `}>
                                            {u.status || 'active'}
                                        </span>
                                    </td>
                                    <td className="p-6 flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                        {u.status === 'suspended' || u.status === 'banned' ? (
                                            <button onClick={() => handleStatusChange(u._id, 'active')} title="Activate" className="p-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all border border-emerald-100">
                                                <FaCheckCircle />
                                            </button>
                                        ) : (
                                            <button onClick={() => handleStatusChange(u._id, 'suspended')} title="Suspend" className="p-2.5 bg-orange-50 text-orange-500 hover:bg-orange-100 rounded-xl transition-all border border-orange-100">
                                                <FaBan />
                                            </button>
                                        )}
                                        <button onClick={() => handleStatusChange(u._id, 'banned')} title="Ban" className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all border border-red-100">
                                                <FaUserShield />
                                        </button>
                                        <button onClick={() => handleDelete(u._id)} title="Perm Delete" className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all ml-2 border border-gray-100">
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center p-24">
                                        <div className="flex flex-col items-center">
                                            <FaSearch className="text-4xl text-gray-200 mb-4" />
                                            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No records found matching search</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
