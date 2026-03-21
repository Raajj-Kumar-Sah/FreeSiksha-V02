import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../../config';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { 
    FaUserShield, FaBan, FaCheckCircle, FaTrash, FaFileExport, 
    FaSearch, FaKey, FaSave, FaTimes, FaChalkboardTeacher, 
    FaIdCard, FaHistory, FaExternalLinkAlt, FaPlus, FaEnvelope
} from 'react-icons/fa';

export default function ManageTrainers() {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Edit Modal State
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({
        email: "",
        studentId: "",
        password: ""
    });

    // Profile View Modal
    const [viewMode, setViewMode] = useState(false);

    // Add Trainer Modal State
    const [addMode, setAddMode] = useState(false);
    const [addData, setAddData] = useState({
        name: "",
        email: "",
        password: ""
    });

    useEffect(() => {
        fetchTrainers();
    }, []);

    const fetchTrainers = async () => {
        setLoading(true);
        try {
            console.log("ManageTrainers: Fetching trainers from", `${serverUrl}/api/admin/users?role=trainer`);
            const res = await axios.get(`${serverUrl}/api/admin/users?role=trainer`, { withCredentials: true });
            console.log("ManageTrainers: API Response:", res.data);
            setTrainers(res.data);
        } catch (error) {
            console.error("ManageTrainers: Fetch error:", error);
            toast.error("Failed to fetch trainers");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (userId, newStatus) => {
        try {
            await axios.put(`${serverUrl}/api/admin/users/${userId}/status`, { status: newStatus }, { withCredentials: true });
            toast.success(`Trainer account marked as ${newStatus}`);
            fetchTrainers();
        } catch (error) {
            toast.error("Status update failed");
        }
    };
    
    const openEditModal = (trainer) => {
        setSelectedTrainer(trainer);
        setEditData({
            email: trainer.email || "",
            studentId: trainer.studentId || "",
            password: ""
        });
        setEditMode(true);
    };

    const openViewModal = (trainer) => {
        setSelectedTrainer(trainer);
        setViewMode(true);
    };

    const handleUpdateCredentials = async () => {
        try {
            await axios.put(`${serverUrl}/api/admin/users/${selectedTrainer._id}/credentials`, editData, { withCredentials: true });
            toast.success("Trainer credentials updated successfully");
            setEditMode(false);
            fetchTrainers();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update credentials");
        }
    };

    const handleResendActivation = async (trainer) => {
        try {
            await axios.post(`${serverUrl}/api/trainer/approve/${trainer.trainerApplicationId || trainer._id}`, { resend: true }, { withCredentials: true });
            toast.success("Activation link resent successfully");
        } catch (error) {
            toast.error("Failed to resend link");
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to permanently remove this trainer? This cannot be undone.")) return;
        try {
            await axios.delete(`${serverUrl}/api/admin/users/${userId}`, { withCredentials: true });
            toast.success("Trainer permanently removed");
            fetchTrainers();
        } catch (error) {
            toast.error("Deletion failed");
        }
    };

    const handleAddTrainer = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${serverUrl}/api/admin/users/trainer`, addData, { withCredentials: true });
            toast.success(res.data.message);
            setAddMode(false);
            setAddData({ name: "", email: "", password: "" });
            fetchTrainers();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create trainer account");
        }
    };

    const filteredTrainers = trainers.filter(t => {
        // Show everything except explicitly rejected/pending ONLY if they are not the target of this section
        // But to be safe, let's log the statuses we are seeing
        if (t.status === 'rejected') return false; 
        
        // If they are pending, they should stay in the Inbox, but if the admin is here, 
        // maybe they want to see them? No, let's keep them in separate sections as requested.
        if (t.status === 'pending') return false;

        const name = (t.name || "").toLowerCase();
        const email = (t.email || "").toLowerCase();
        const studentId = (t.studentId || "").toLowerCase();
        const search = searchTerm.toLowerCase();

        return name.includes(search) || email.includes(search) || studentId.includes(search);
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                        <FaChalkboardTeacher size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Manage <span className="text-blue-600">Trainers</span></h2>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
                            {trainers.length} Approved Educators Active
                        </p>
                    </div>
                </div>
                
                <div className="flex flex-1 max-w-xl gap-3">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input 
                            type="text" 
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold focus:outline-none transition-all shadow-inner"
                        />
                    </div>
                    <button 
                        onClick={() => setAddMode(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg active:scale-95 whitespace-nowrap"
                    >
                        <FaPlus /> Add New Trainer
                    </button>
                    <button 
                        onClick={() => window.open(`${serverUrl}/api/admin/export?role=trainer`, "_blank")}
                        className="flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-black transition-all shadow-lg active:scale-95"
                    >
                        <FaFileExport /> Export
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-32 bg-white rounded-[40px] border border-gray-100">
                    <ClipLoader color="#2563eb" size={50} />
                    <p className="mt-6 text-gray-400 font-black uppercase tracking-widest text-xs animate-pulse">Syncing Trainer Records...</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {filteredTrainers.map(t => (
                        <div key={t._id} className="group bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-8 hover:shadow-2xl hover:border-blue-100 transition-all transform hover:-translate-y-1">
                            <div className="flex-1 flex flex-col md:flex-row md:items-center gap-8">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 flex items-center justify-center font-black text-3xl border-2 border-white shadow-xl">
                                        {(t.name || "?").charAt(0).toUpperCase()}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white ${
                                        t.status === 'active' || !t.status ? 'bg-emerald-500' : 'bg-red-500'
                                    }`}></div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-2xl font-black text-gray-900">{t.name}</h3>
                                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border ${
                                            t.status === 'active' || !t.status ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                            t.status === 'suspended' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-red-50 text-red-700 border-red-100'
                                        }`}>
                                            {t.status || 'active'}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-400">
                                        <span className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                                            <FaIdCard className="text-blue-500" /> {t.studentId || 'ID PENDING'}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <FaHistory className="text-gray-300" /> Joined {new Date(t.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.email}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                                <button 
                                    onClick={() => openViewModal(t)}
                                    className="p-4 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-2xl transition-all border border-gray-100 flex items-center gap-2 font-black text-xs uppercase"
                                >
                                    <FaExternalLinkAlt /> View Details
                                </button>
                                <button 
                                    onClick={() => openEditModal(t)}
                                    className="p-4 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-2xl transition-all border border-blue-100 active:scale-90"
                                    title="Edit Credentials"
                                >
                                    <FaKey />
                                </button>
                                {t.status === 'approved' && (
                                    <button 
                                        onClick={() => handleResendActivation(t)}
                                        className="p-4 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-2xl transition-all border border-amber-100 flex items-center gap-2 font-black text-xs uppercase"
                                        title="Resend Activation Link"
                                    >
                                        <FaEnvelope /> Resend
                                    </button>
                                )}
                                {t.status === 'suspended' || t.status === 'banned' ? (
                                    <button 
                                        onClick={() => handleStatusChange(t._id, 'active')}
                                        className="p-4 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-2xl transition-all border border-emerald-100 flex items-center gap-2 font-black text-xs uppercase"
                                    >
                                        <FaCheckCircle /> Reactivate
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => handleStatusChange(t._id, 'suspended')}
                                        className="p-4 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-2xl transition-all border border-orange-100 flex items-center gap-2 font-black text-xs uppercase"
                                    >
                                        <FaBan /> Suspend
                                    </button>
                                )}
                                <button 
                                    onClick={() => handleDelete(t._id)}
                                    className="p-4 bg-white text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all border border-gray-100 active:scale-90"
                                    title="Permanent Remove"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredTrainers.length === 0 && (
                        <div className="bg-white rounded-[40px] p-24 text-center border-4 border-dashed border-gray-50 flex flex-col items-center">
                            <FaSearch className="text-6xl text-gray-100 mb-6" />
                            <h3 className="text-2xl font-black text-gray-900">No Trainers Found</h3>
                            <p className="text-gray-400 font-medium mt-2">Try adjusting your search filters or check Pending Applications.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Credential Edit Modal */}
            {editMode && (
                <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[32px] sm:rounded-[48px] w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden">
                        <div className="bg-gray-950 p-6 sm:p-10 text-white relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight pr-8">{selectedTrainer?.name}</h3>
                            <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Security Adjustments</p>
                            <button onClick={() => setEditMode(false)} className="absolute top-6 right-6 sm:top-10 sm:right-10 text-gray-500 hover:text-white transition-colors">
                                <FaTimes size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6 sm:p-10 space-y-6 sm:space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Assigned Email</label>
                                <input 
                                    type="email" 
                                    value={editData.email}
                                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 px-6 py-4 rounded-3xl font-black text-gray-700 outline-none transition-all shadow-sm"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Trainer FS-ID</label>
                                <input 
                                    type="text" 
                                    value={editData.studentId}
                                    onChange={(e) => setEditData({ ...editData, studentId: e.target.value })}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 px-6 py-4 rounded-3xl font-black tracking-widest text-gray-700 outline-none transition-all shadow-sm uppercase"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Override Password</label>
                                <div className="relative">
                                    <FaKey className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                                    <input 
                                        type="password" 
                                        placeholder="Enter to Reset Password"
                                        value={editData.password}
                                        onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 pl-14 pr-6 py-4 rounded-3xl font-black text-gray-700 outline-none transition-all shadow-sm"
                                    />
                                </div>
                                <p className="text-[10px] text-orange-500 font-bold ml-2">⚠️ Warning: This will override the trainer's local password.</p>
                            </div>

                            <button 
                                onClick={handleUpdateCredentials}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 sm:py-5 rounded-[24px] sm:rounded-[32px] font-black shadow-2xl shadow-blue-500/20 transition-all hover:-translate-y-1 active:translate-y-0.5 flex items-center justify-center gap-3 text-base sm:text-lg"
                            >
                                <FaSave /> Update Trainer Security
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile View Modal */}
            {viewMode && (
                <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[32px] sm:rounded-[48px] w-full max-w-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="bg-gray-50 p-6 sm:p-10 border-b border-gray-100 flex justify-between items-start">
                            <div className="flex items-center gap-4 sm:gap-6">
                                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-[32px] bg-white border border-gray-200 flex items-center justify-center text-gray-400 font-black text-2xl sm:text-4xl shadow-sm">
                                    {(selectedTrainer?.name || "?").charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-xl sm:text-3xl font-black text-gray-900">{selectedTrainer?.name}</h3>
                                    <p className="text-blue-600 font-black text-xs sm:text-sm tracking-wider uppercase">{selectedTrainer?.studentId}</p>
                                    <div className="mt-2 flex gap-2">
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border ${
                                            selectedTrainer?.status === 'active' || !selectedTrainer?.status ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                                        }`}>
                                            {selectedTrainer?.status || 'active'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setViewMode(false)} className="p-2 sm:p-3 hover:bg-white rounded-2xl text-gray-400 border border-transparent hover:border-gray-100 transition-all">
                                <FaTimes size={20} className="sm:w-6 sm:h-6" />
                            </button>
                        </div>
                        
                        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 sm:space-y-10 custom-scrollbar">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</span>
                                    <p className="font-bold text-gray-900 break-words">{selectedTrainer?.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</span>
                                    <p className="font-bold text-gray-900">{selectedTrainer?.phone || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">City</span>
                                    <p className="font-bold text-gray-900">{selectedTrainer?.city || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Qualification</span>
                                    <p className="font-bold text-gray-900">{selectedTrainer?.qualification || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-gray-100 pb-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Bio / Description
                                </h4>
                                <p className="text-sm font-medium text-gray-600 leading-relaxed bg-gray-50 p-6 rounded-3xl border border-gray-50 italic">
                                    {selectedTrainer?.description || "No bio information provided."}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-gray-100 pb-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Profile Overview
                                </h4>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-50">
                                        <span className="text-xs font-bold text-gray-500">Member Since</span>
                                        <span className="text-xs font-black text-gray-900">{new Date(selectedTrainer?.createdAt).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-50">
                                        <span className="text-xs font-bold text-gray-500">Last Profile Update</span>
                                        <span className="text-xs font-black text-gray-900">{new Date(selectedTrainer?.updatedAt).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-gray-50 border-t border-gray-100">
                             <button 
                                onClick={() => setViewMode(false)}
                                className="w-full bg-white text-gray-900 py-4 rounded-3xl font-black border border-gray-200 hover:bg-gray-100 transition-all"
                             >
                                CLOSE PROFILE
                             </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Trainer Modal */}
            {addMode && (
                <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in zoom-in duration-300">
                    <div className="bg-white rounded-[32px] sm:rounded-[48px] w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden">
                        <div className="bg-blue-600 p-6 sm:p-10 text-white relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight flex items-center gap-3 pr-8">
                                <FaPlus /> Add New Trainer
                            </h3>
                            <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Manual Account Creation</p>
                            <button onClick={() => setAddMode(false)} className="absolute top-6 right-6 sm:top-10 sm:right-10 text-blue-200 hover:text-white transition-colors">
                                <FaTimes size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddTrainer} className="p-6 sm:p-10 space-y-6 sm:space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Full Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={addData.name}
                                    onChange={(e) => setAddData({ ...addData, name: e.target.value })}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 px-6 py-4 rounded-3xl font-black text-gray-700 outline-none transition-all shadow-sm"
                                    placeholder="e.g. John Doe"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Email Address</label>
                                <input 
                                    type="email" 
                                    required
                                    value={addData.email}
                                    onChange={(e) => setAddData({ ...addData, email: e.target.value })}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 px-6 py-4 rounded-3xl font-black text-gray-700 outline-none transition-all shadow-sm"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Assign Password</label>
                                <div className="relative">
                                    <FaKey className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                                    <input 
                                        type="password" 
                                        required
                                        min={8}
                                        placeholder="Min 8 characters"
                                        value={addData.password}
                                        onChange={(e) => setAddData({ ...addData, password: e.target.value })}
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600 pl-14 pr-6 py-4 rounded-3xl font-black text-gray-700 outline-none transition-all shadow-sm"
                                    />
                                </div>
                                <p className="text-[10px] text-blue-500 font-bold ml-2 italic">Note: These credentials will be sent to the trainer via email.</p>
                            </div>

                            <button 
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[32px] font-black shadow-2xl shadow-blue-500/20 transition-all hover:-translate-y-1 active:translate-y-0.5 flex items-center justify-center gap-3 text-lg"
                            >
                                <FaPlus /> Create Trainer Account
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
