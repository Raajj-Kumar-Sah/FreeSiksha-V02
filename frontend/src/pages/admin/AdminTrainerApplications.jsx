import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../../config';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { FaCheck, FaTimes, FaInbox, FaUser, FaEnvelope, FaPhone, FaHashtag, FaInfoCircle, FaFileAlt, FaKey, FaTimesCircle } from 'react-icons/fa';

const AdminTrainerApplications = () => {
    const [applications, setApplications] = useState([]);
    const [formSchema, setFormSchema] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Approval Modal States
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Rejection Modal States
    // Rejection Modal States
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            console.log("Fetching trainer applications...");
            const [appRes, schemaRes] = await Promise.all([
                axios.get(`${serverUrl}/api/trainer/applications`, { withCredentials: true }),
                axios.get(`${serverUrl}/api/trainer/form`)
            ]);
            setApplications(appRes.data);
            setFormSchema(schemaRes.data.fields || []);
        } catch (error) {
            console.error("Fetch data error:", error);
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const openApproveModal = (app) => {
        setSelectedApp(app);
        setShowApproveModal(true);
    };

    const handleApprove = async () => {
        setSubmitting(true);
        try {
            await axios.post(`${serverUrl}/api/trainer/approve/${selectedApp._id}`, {}, { withCredentials: true });
            toast.success("Application Approved! Activation link sent to trainer.");
            setShowApproveModal(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Approval failed");
        } finally {
            setSubmitting(false);
        }
    };

    const openRejectModal = (app) => {
        setSelectedApp(app);
        setRejectionReason("");
        setShowRejectModal(true);
    };

    const handleReject = async () => {
        setSubmitting(true);
        try {
            await axios.post(`${serverUrl}/api/trainer/reject/${selectedApp._id}`, { reason: rejectionReason }, { withCredentials: true });
            toast.success("Application Rejected");
            setShowRejectModal(false);
            fetchData();
        } catch (error) {
            toast.error("Rejection failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <ClipLoader size={40} color="#2563eb" />
            <p className="mt-4 text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Accessing Trainer Database...</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Trainer <span className="text-blue-600">Applications</span></h2>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Pending Review: {applications.filter(a => a.status === 'pending').length}</p>
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
                    <p className="text-gray-400 mt-2 font-medium max-w-xs">No pending trainer applications found in the system.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {applications.map((app) => (
                        <div key={app._id} className="group relative bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-8 hover:shadow-xl hover:border-blue-100 transition-all">
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
                                            <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider block">{key}</span>
                                            <div className="text-sm font-black text-gray-700 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 break-words">
                                                {typeof val === 'string' && (val.startsWith('http')) ? (
                                                    <a href={val} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-2">
                                                        <FaFileAlt /> View Document
                                                    </a>
                                                ) : (
                                                    Array.isArray(val) ? val.join(", ") : (val || 'N/A')
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {app.status === 'pending' && (
                                <div className="flex xl:flex-col gap-3 min-w-[200px]">
                                    <button 
                                        onClick={() => openApproveModal(app)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                                    >
                                        <FaCheck /> APPROVE
                                    </button>
                                    <button 
                                        onClick={() => openRejectModal(app)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-gray-100 hover:border-red-200 hover:text-red-600 text-gray-400 px-8 py-4 rounded-2xl font-black transition-all active:scale-95"
                                    >
                                        <FaTimes /> REJECT
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Approval Modal */}
            {showApproveModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
                        <div className="p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-gray-900">Approve Trainer</h3>
                                    <p className="text-sm font-bold text-gray-400">Set access credentials</p>
                                </div>
                                <button onClick={() => setShowApproveModal(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                                    <FaTimes size={20} />
                                </button>
                            </div>

                            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 space-y-3">
                                <div className="flex items-center gap-3 text-blue-600">
                                    <FaInbox className="text-xl" />
                                    <span className="font-black uppercase tracking-widest text-xs">Secure Onboarding</span>
                                </div>
                                <p className="text-sm font-bold text-blue-900 leading-relaxed">
                                    Approving <b>{selectedApp?.name}</b> will send a secure activation link to <b>{selectedApp?.email}</b>. They will set their own password to activate the account.
                                </p>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button 
                                    onClick={handleApprove}
                                    disabled={submitting}
                                    className="flex-1 bg-gray-900 text-white py-5 rounded-3xl font-black shadow-2xl hover:bg-black hover:translate-y-[-2px] active:translate-y-[2px] transition-all disabled:opacity-50 flex justify-center items-center gap-3"
                                >
                                    {submitting ? <ClipLoader size={18} color="white" /> : <><FaCheck /> CONFIRM APPROVAL</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Rejection Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
                        <div className="p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-gray-900">Reject Application</h3>
                                    <p className="text-sm font-bold text-gray-400">Provide a reason (optional)</p>
                                </div>
                                <button onClick={() => setShowRejectModal(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                                    <FaTimes size={20} />
                                </button>
                            </div>

                            <textarea 
                                value={rejectionReason} 
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Explain why the application was rejected..."
                                className="w-full p-6 bg-gray-50 border-2 border-transparent focus:border-red-500 rounded-2xl font-medium text-gray-700 outline-none transition-all h-32"
                            />

                            <div className="flex gap-4 pt-4">
                                <button 
                                    onClick={handleReject}
                                    disabled={submitting}
                                    className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-red-500/20 hover:bg-red-700 transition-all disabled:opacity-50"
                                >
                                    {submitting ? <ClipLoader size={18} color="white" /> : "Confirm Rejection"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTrainerApplications;
