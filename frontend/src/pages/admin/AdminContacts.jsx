import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { FaInbox, FaTrash, FaEnvelope, FaUser, FaClock, FaEye, FaArrowLeft } from 'react-icons/fa';
import moment from 'moment';

const AdminContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${serverUrl}/api/admin/contacts`, { withCredentials: true });
            setContacts(res.data);
        } catch (error) {
            toast.error("Failed to fetch inquiries");
        } finally {
            setLoading(false);
        }
    };

    const [deleteId, setDeleteId] = useState(null);

    const handleDelete = async (id) => {
        const idStr = id.toString();
        try {
            console.log("Deleting inquiry:", idStr);
            setLoading(true);
            await axios.delete(`${serverUrl}/api/admin/contacts/${idStr}`, { withCredentials: true });
            toast.success("Inquiry deleted successfully");
            
            setContacts(prev => prev.filter(c => c._id.toString() !== idStr));
            if (selectedMessage?._id?.toString() === idStr) setSelectedMessage(null);
            setDeleteId(null);
        } catch (error) {
            console.error("Deletion error:", error);
            toast.error(error.response?.data?.message || "Failed to delete inquiry");
        } finally {
            setLoading(false);
        }
    };

    const handleView = (contact) => {
        setSelectedMessage(contact);
        if (contact.status === 'new') {
            markAsRead(contact._id);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.put(`${serverUrl}/api/admin/contacts/${id}/read`, {}, { withCredentials: true });
            setContacts(prev => prev.map(c => c._id === id ? { ...c, status: 'read' } : c));
        } catch (error) {
            console.warn("Failed to mark as read:", error);
        }
    };

    if (loading && contacts.length === 0) return (
        <div className="flex justify-center p-20"><ClipLoader color="#2563eb" /></div>
    );

    return (
        <div className="animate-in fade-in duration-700 relative">
            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl border border-white/20 animate-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <FaTrash size={24} />
                        </div>
                        <h3 className="text-xl font-black text-center text-gray-900 mb-2">Delete Inquiry?</h3>
                        <p className="text-gray-500 text-center text-sm mb-8 leading-relaxed">This action cannot be undone. The message will be permanently removed from the records.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 py-4 bg-gray-50 text-gray-600 font-bold rounded-2xl hover:bg-gray-100 transition-all">Cancel</button>
                            <button onClick={() => handleDelete(deleteId)} className="flex-1 py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-200">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {selectedMessage ? (
                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden max-w-4xl mx-auto">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                        <button onClick={() => setSelectedMessage(null)} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold transition-all">
                            <FaArrowLeft /> Back to Inbox
                        </button>
                        <button onClick={() => setDeleteId(selectedMessage._id)} className="p-3 bg-red-50 text-red-500 hover:bg-red-100 rounded-2xl transition-all">
                            <FaTrash />
                        </button>
                    </div>
                    {/* ... rest of detail view ... */}
                    <div className="p-10 space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sender Identity</label>
                                <div className="flex items-center gap-3 text-gray-900 font-black text-xl">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><FaUser size={16}/></div>
                                    {selectedMessage.name}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Channel</label>
                                <div className="flex items-center gap-3 text-blue-600 font-bold underline">
                                    <FaEnvelope size={16}/>
                                    {selectedMessage.email}
                                </div>
                            </div>
                        </div>
                        <div className="pt-8 border-t border-gray-100">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Message Payload</label>
                            <div className="bg-gray-50 p-8 rounded-[24px] text-gray-700 leading-relaxed font-medium text-lg whitespace-pre-wrap font-sans">
                                {selectedMessage.message}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest pt-4">
                            <FaClock /> Logged on {moment(selectedMessage.createdAt).format('MMMM Do YYYY, h:mm a')}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-[32px] shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-8 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                <FaInbox size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900">Communication Inbox</h2>
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Manage Global Contact Submissions</p>
                            </div>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">
                            {contacts.length} Total Inquiries
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white border-b border-gray-100 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                                    <th className="p-6">Sender Details</th>
                                    <th className="p-6">Brief Snippet</th>
                                    <th className="p-6">Arrival Date</th>
                                    <th className="p-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {contacts.map(c => (
                                    <tr key={c._id} className={`hover:bg-blue-50/40 transition-all group cursor-pointer ${c.status === 'new' ? 'bg-blue-50/10' : ''}`} onClick={(e) => { if (!e.target.closest('button')) handleView(c); }}>
                                        <td className="p-6">
                                            <p className={`font-black tracking-tight leading-tight ${c.status === 'new' ? 'text-blue-900' : 'text-gray-700'}`}>{c.name}</p>
                                            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">{c.email}</p>
                                        </td>
                                        <td className="p-6 text-gray-500 text-sm font-medium">
                                            {c.message.substring(0, 60)}...
                                        </td>
                                        <td className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            {moment(c.createdAt).fromNow()}
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex gap-2 justify-end">
                                                <button onClick={(e) => { e.stopPropagation(); handleView(c); }} className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-2xl transition-all border border-blue-100 lg:opacity-0 group-hover:opacity-100">
                                                    <FaEye />
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); setDeleteId(c._id); }} className="p-3 bg-red-50 text-red-500 hover:bg-red-100 rounded-2xl transition-all border border-red-100 lg:opacity-0 group-hover:opacity-100">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {contacts.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="p-24 text-center">
                                            <FaInbox className="text-4xl text-gray-100 mb-4 mx-auto" />
                                            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Your inbox is currently empty</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminContacts;
