import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaChalkboardTeacher, FaHandsHelping, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { serverUrl } from '../App';
import DynamicForm from './DynamicForm';
import { toast } from 'react-toastify';

const JoinModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState('options'); // 'options' or 'volunteer-form'
    const [formSchema, setFormSchema] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showTrainerConfirm, setShowTrainerConfirm] = useState(false);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
    const [pendingFormData, setPendingFormData] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setStep('options');
            fetchVolunteerForm();
        }
    }, [isOpen]);

    const fetchVolunteerForm = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/volunteer/form`);
            if (!res.data || !res.data.isActive) {
                setFormSchema(null);
                return;
            }
            setFormSchema(res.data.fields);
        } catch (error) {
            setFormSchema(null);
        }
    };

    const handleVolunteerSubmit = async (formData) => {
        setPendingFormData(formData);
        setShowSubmitConfirm(true);
    };

    const confirmSubmit = async () => {
        setLoading(true);
        try {
            const data = new FormData();
            data.append("name", pendingFormData.Name || pendingFormData.name || "Anonymous");
            data.append("email", pendingFormData.Email || pendingFormData.email || "");

            const formAnswers = {};
            Object.entries(pendingFormData).forEach(([key, value]) => {
                if (value instanceof File) {
                    data.append("resume", value);
                } else {
                    formAnswers[key] = value;
                }
            });
            data.append("responses", JSON.stringify(formAnswers));

            await axios.post(`${serverUrl}/api/volunteer/apply`, data, { 
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true 
            });
            toast.success("Application submitted! Admin will contact you soon.");
            setShowSubmitConfirm(false);
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong, please try again");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-lg bg-[var(--bg-surface)] rounded-[32px] shadow-2xl border border-[var(--border-color)] overflow-hidden p-8"
                >
                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 text-[var(--text-muted)] hover:text-red-500 transition-colors"
                    >
                        <FaTimes className="text-xl" />
                    </button>

                    {step === 'options' && (
                        <div className="space-y-8">
                            <div className="text-center space-y-2">
                                <h2 className="text-3xl font-black text-[var(--text-main)]">Join <span className="text-blue-600">FreeSiksha</span></h2>
                                <p className="text-[var(--text-muted)] font-medium">Choose your path to empower the world</p>
                            </div>

                            <div className="grid gap-4">
                                <button 
                                    onClick={() => { navigate("/signup?role=student"); onClose(); }}
                                    className="group flex items-center gap-5 p-5 bg-[var(--bg-main)] hover:bg-blue-600/10 border border-[var(--border-color)] hover:border-blue-500/50 rounded-2xl transition-all shadow-sm"
                                >
                                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                        <FaUserGraduate className="text-2xl" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-black text-[var(--text-main)] text-xl">Enroll as Student</h3>
                                        <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider">Access 100+ Free Courses</p>
                                    </div>
                                </button>

                                <button 
                                    onClick={() => setStep('trainer-confirm')}
                                    className="group flex items-center gap-5 p-5 bg-[var(--bg-main)] hover:bg-emerald-600/10 border border-[var(--border-color)] hover:border-emerald-500/50 rounded-2xl transition-all shadow-sm"
                                >
                                    <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                                        <FaChalkboardTeacher className="text-2xl" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-black text-[var(--text-main)] text-xl">Join as Trainer</h3>
                                        <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider">Share your Expertise</p>
                                    </div>
                                </button>

                                <button 
                                    onClick={() => {
                                        if (!formSchema) {
                                            toast.info("No volunteer form is open yet. Please try again later.");
                                            return;
                                        }
                                        setStep('volunteer-form');
                                    }}
                                    className="group flex items-center gap-5 p-5 bg-[var(--bg-main)] hover:bg-purple-600/10 border border-[var(--border-color)] hover:border-purple-500/50 rounded-2xl transition-all shadow-sm"
                                >
                                    <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                                        <FaHandsHelping className="text-2xl" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-black text-[var(--text-main)] text-xl">Volunteer Now</h3>
                                        <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider">Help build the community</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {step === 'trainer-confirm' && (
                        <div className="space-y-8 py-4 text-center">
                            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/40 rounded-3xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto shadow-xl shadow-emerald-500/10">
                                <FaChalkboardTeacher size={32} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-[var(--text-main)]">Apply as a Trainer?</h3>
                                <p className="text-[var(--text-muted)] font-medium leading-relaxed">
                                    You are about to start your application to join <b>FreeSiksha</b> as an educator. Are you ready to share your knowledge?
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => { setStep('options'); navigate("/register-trainer"); onClose(); }}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                                >
                                    Yes, Proceed
                                </button>
                                <button 
                                    onClick={() => setStep('options')}
                                    className="flex-1 bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] py-4 rounded-2xl font-black hover:bg-[var(--bg-surface)] transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {step === 'volunteer-form' && showSubmitConfirm && (
                        <div className="space-y-8 py-4 text-center">
                            <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/40 rounded-3xl flex items-center justify-center text-purple-600 dark:text-purple-400 mx-auto shadow-xl shadow-purple-500/10">
                                <FaHandsHelping size={32} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-[var(--text-main)]">Submit Application?</h3>
                                <p className="text-[var(--text-muted)] font-medium leading-relaxed">
                                    Are you sure you want to submit your volunteer application to FreeSiksha?
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button 
                                    disabled={loading}
                                    onClick={confirmSubmit}
                                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-2xl font-black shadow-lg shadow-purple-500/20 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? "Submitting..." : "Yes, Submit"}
                                </button>
                                <button 
                                    disabled={loading}
                                    onClick={() => setShowSubmitConfirm(false)}
                                    className="flex-1 bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] py-4 rounded-2xl font-black hover:bg-[var(--bg-surface)] transition-all active:scale-95 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {step === 'volunteer-form' && !showSubmitConfirm && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setStep('options')}
                                    className="p-2 text-[var(--text-muted)] hover:text-blue-600 transition-colors"
                                >
                                    <FaTimes className="rotate-45" /> {/* Use as back arrow or similar icon */}
                                </button>
                                <h2 className="text-2xl font-black text-[var(--text-main)]">Volunteer Application</h2>
                            </div>

                            <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                {formSchema ? (
                                    <DynamicForm 
                                        schema={formSchema} 
                                        onSubmit={handleVolunteerSubmit} 
                                        loading={loading}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                        <ClipLoader size={30} color="var(--primary)" />
                                        <p className="text-sm font-bold text-[var(--text-muted)]">Loading Application Form...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default JoinModal;
