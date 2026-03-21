import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { FaCheck, FaTimes, FaInbox, FaUser, FaEnvelope, FaPhone, FaHashtag, FaInfoCircle, FaFileAlt } from 'react-icons/fa';

const AdminVolunteerApplications = () => {
    const [applications, setApplications] = useState([]);
    const [formSchema, setFormSchema] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [appRes, schemaRes] = await Promise.all([
                axios.get(`${serverUrl}/api/volunteer/applications`, { withCredentials: true }),
                axios.get(`${serverUrl}/api/volunteer/form`)
            ]);
            setApplications(appRes.data);
            setFormSchema(schemaRes.data.fields || []);
        } catch (error) {
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const handleStatus = async (id, status) => {
        try {
            await axios.post(`${serverUrl}/api/volunteer/applications/${id}/status`, { status }, { withCredentials: true });
            toast.success(`Application ${status}`);
            fetchData();
        } catch (error) {
            toast.error("Action failed");
        }
    };

    const getValidationIcon = (fieldName) => {
        const field = formSchema.find(f => f.fieldName === fieldName);
        if(!field) return <FaInfoCircle className="text-gray-300" />;
        
        switch(field.validationType) {
            case 'name': return <FaUser className="text-blue-400" title="Name Field" />;
            case 'email': return <FaEnvelope className="text-emerald-400" title="Email Field" />;
            case 'tel': return <FaPhone className="text-purple-400" title="Phone Field" />;
            case 'number': return <FaHashtag className="text-amber-400" title="Number Field" />;
            default: return <FaInfoCircle className="text-gray-300" />;
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <ClipLoader size={40} color="#2563eb" />
            <p className="mt-4 text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Accessing Contributor Database...</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Volunteer <span className="text-blue-600">Inbox</span></h2>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Awaiting Verification: {applications.filter(a => a.status === 'pending').length}</p>
                </div>
                <div className="flex bg-gray-50 p-2 rounded-2xl gap-2">
                    <div className="px-5 py-2 bg-white rounded-xl shadow-sm">
                        <span className="text-xs font-black text-gray-400 block uppercase tracking-tighter">Total</span>
                        <span className="text-xl font-black text-gray-900">{applications.length}</span>
                    </div>
                </div>
            </div>

            {applications.length === 0 ? (
                <div className="bg-white rounded-[40px] p-24 border-4 border-dashed border-gray-50 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <FaInbox className="text-5xl text-gray-200" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900">Queue is Clear</h3>
                    <p className="text-gray-400 mt-2 font-medium max-w-xs">No pending volunteer applications found in the system.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {applications.map((app) => (
                        <div key={app._id} className="group relative bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-8 hover:shadow-xl hover:border-blue-100 transition-all">
                            {/* Status Indicator Bar */}
                            <div className={`absolute left-0 top-0 bottom-0 w-2 transition-all ${
                                app.status === 'pending' ? 'bg-amber-400' :
                                app.status === 'approved' ? 'bg-emerald-500' : 'bg-red-500'
                            }`}></div>

                            <div className="flex-1 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center font-black text-xl text-gray-400 border border-gray-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        {app.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-2xl font-black text-gray-900">{app.name}</h3>
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                                                app.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                app.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                                            }`}>
                                                {app.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-1">
                                            <span className="text-sm font-bold text-gray-400 flex items-center gap-1.5"><FaEnvelope className="text-[10px]" /> {app.email}</span>
                                            <span className="text-sm font-bold text-gray-300">•</span>
                                            <span className="text-sm font-bold text-gray-400">Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50/50 p-6 rounded-[24px] border border-gray-50">
                                    {Object.entries(app.responses || {}).map(([key, val]) => (
                                        <div key={key} className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                {key.toLowerCase() === 'resume' ? <FaFileAlt className="text-blue-500" /> : getValidationIcon(key)}
                                                <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider">{key}</span>
                                            </div>
                                            <div className="text-sm font-black text-gray-700 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 overflow-hidden text-ellipsis whitespace-nowrap">
                                                {key.toLowerCase() === 'resume' && typeof val === 'string' && val.startsWith('http') ? (
                                                    <a href={val} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline font-bold flex items-center gap-2">
                                                        <FaFileAlt /> View Document
                                                    </a>
                                                ) : Array.isArray(val) ? val.join(", ") : (val || 'N/A')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {app.status === 'pending' && (
                                <div className="flex xl:flex-col gap-3 min-w-[180px]">
                                    <button 
                                        onClick={() => handleStatus(app._id, 'approved')}
                                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                                    >
                                        <FaCheck /> VERIFY
                                    </button>
                                    <button 
                                        onClick={() => handleStatus(app._id, 'rejected')}
                                        className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-gray-100 hover:border-red-200 hover:text-red-600 text-gray-400 px-8 py-4 rounded-2xl font-black transition-all active:scale-95"
                                    >
                                        <FaTimes /> DECLINE
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminVolunteerApplications;
