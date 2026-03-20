import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { FaUserShield, FaBan, FaCheckCircle, FaTrash } from 'react-icons/fa';

export default function AdminUsers({ role }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900 capitalize">{role} Management</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {users.length} Records
                </span>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><ClipLoader color="#3B82F6" /></div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-gray-100 text-gray-500 text-xs uppercase tracking-widest text-left">
                                <th className="p-4 font-bold">User</th>
                                <th className="p-4 font-bold">Role</th>
                                <th className="p-4 font-bold">Status</th>
                                <th className="p-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map(u => (
                                <tr key={u._id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                {u.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{u.name}</p>
                                                <p className="text-sm text-gray-500">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide ${u.role === 'educator' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide
                                            ${u.status === 'active' ? 'bg-green-100 text-green-700' : ''}
                                            ${u.status === 'suspended' ? 'bg-orange-100 text-orange-700' : ''}
                                            ${u.status === 'banned' ? 'bg-red-100 text-red-700' : ''}
                                            ${!u.status ? 'bg-green-100 text-green-700' : ''} 
                                        `}>
                                            {u.status || 'active'}
                                        </span>
                                    </td>
                                    <td className="p-4 flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                        {u.status === 'suspended' || u.status === 'banned' ? (
                                            <button onClick={() => handleStatusChange(u._id, 'active')} title="Activate" className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                                                <FaCheckCircle />
                                            </button>
                                        ) : (
                                            <button onClick={() => handleStatusChange(u._id, 'suspended')} title="Suspend" className="p-2 text-orange-500 hover:bg-orange-100 rounded-lg transition-colors">
                                                <FaBan />
                                            </button>
                                        )}
                                        <button onClick={() => handleStatusChange(u._id, 'banned')} title="Ban" className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                                                <FaUserShield />
                                        </button>
                                        <button onClick={() => handleDelete(u._id)} title="Perm Delete" className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2">
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center p-8 text-gray-500 font-medium">No {role}s found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
