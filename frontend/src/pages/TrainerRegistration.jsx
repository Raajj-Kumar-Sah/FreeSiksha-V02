import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { FaFileUpload, FaPaperPlane, FaUserGraduate, FaEnvelope, FaIdCard } from 'react-icons/fa';
import logo from '../assets/logo.jpg';

const TrainerRegistration = () => {
    const [formSchema, setFormSchema] = useState(null);
    const [formData, setFormData] = useState({});
    const [files, setFiles] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        fetchForm();
    }, []);

    const fetchForm = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/trainer/form`);
            setFormSchema(res.data);
            // Initialize form data
            const initialData = { name: '', email: '' }; // Core required fields
            setFormData(initialData);
        } catch (error) {
            toast.error("Failed to load registration form");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (fieldName, value) => {
        setFormData({ ...formData, [fieldName]: value });
    };

    const handleFileChange = (fieldName, file) => {
        setFiles({ ...files, [fieldName]: file });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.name || !formData.email) {
            return toast.error("Name and Email are required");
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        
        // Separate responses from core fields
        const responses = { ...formData };
        delete responses.name;
        delete responses.email;
        data.append('responses', JSON.stringify(responses));

        // Append files
        Object.entries(files).forEach(([fieldName, file]) => {
            data.append(fieldName, file);
        });

        setSubmitting(true);
        try {
            await axios.post(`${serverUrl}/api/trainer/apply`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setIsSubmitted(true);
            toast.success("Application submitted successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Submission failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
            <ClipLoader color="#2563eb" size={40} />
        </div>
    );

    if (isSubmitted) return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] p-4">
            <div className="max-w-md w-full bg-[var(--bg-surface)] p-12 rounded-[40px] shadow-2xl text-center space-y-6 border border-[var(--border-color)]">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaPaperPlane className="text-3xl text-emerald-600" />
                </div>
                <h1 className="text-3xl font-black text-[var(--text-main)]">Application Sent!</h1>
                <p className="text-[var(--text-muted)] font-medium">
                    Your application to join FreeSiksha as a Trainer is currently being reviewed by our administration.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-500/20">
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 leading-relaxed uppercase tracking-widest">
                        Once approved, you will receive an email with your dashboard login credentials.
                    </p>
                </div>
                <button 
                    onClick={() => navigate('/')}
                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black hover:bg-black transition-all"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--bg-main)] py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-[var(--bg-surface)] p-8 md:p-12 rounded-[48px] shadow-2xl border border-[var(--border-color)] space-y-10">
                    {/* Header */}
                    <div className="flex flex-col items-center text-center space-y-4">
                        <img src={logo} alt="FreeSiksha" className="h-16 w-16 rounded-2xl shadow-sm mb-2" />
                        <h1 className="text-4xl font-black text-[var(--text-main)] tracking-tight">Trainer Onboarding</h1>
                        <p className="text-[var(--text-muted)] font-medium max-w-sm">
                            Complete the form below to apply for a Trainer position at FreeSiksha.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Core Fields */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-[var(--text-main)] uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <FaIdCard className="text-blue-500" /> Full Name <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    required 
                                    value={formData.name} 
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full bg-[var(--bg-main)] border-2 border-transparent focus:border-blue-600 px-6 py-4 rounded-2xl font-bold text-[var(--text-main)] placeholder-[var(--text-muted)] outline-none transition-all shadow-sm"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-[var(--text-main)] uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <FaEnvelope className="text-blue-500" /> Email Address <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="email" 
                                    required 
                                    value={formData.email} 
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full bg-[var(--bg-main)] border-2 border-transparent focus:border-blue-600 px-6 py-4 rounded-2xl font-bold text-[var(--text-main)] placeholder-[var(--text-muted)] outline-none transition-all shadow-sm"
                                    placeholder="yourname@example.com"
                                />
                            </div>
                        </div>

                        {/* Dynamic Fields */}
                        <div className="space-y-8 pt-4 border-t border-[var(--border-color)]">
                            {formSchema?.fields.map((field, idx) => (
                                <div key={idx} className="space-y-3">
                                    <label className="text-xs font-black text-[var(--text-main)] uppercase tracking-widest ml-1 block">
                                        {field.fieldName} {field.required && <span className="text-red-500">*</span>}
                                    </label>

                                    {field.fieldType === 'text' && (
                                        <input 
                                            type="text" 
                                            required={field.required}
                                            value={formData[field.fieldName] || ""}
                                            onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
                                            className="w-full bg-[var(--bg-main)] border-2 border-transparent focus:border-blue-600 px-6 py-4 rounded-2xl font-bold text-[var(--text-main)] outline-none transition-all shadow-sm"
                                        />
                                    )}

                                    {field.fieldType === 'textarea' && (
                                        <textarea 
                                            required={field.required}
                                            value={formData[field.fieldName] || ""}
                                            onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
                                            className="w-full bg-[var(--bg-main)] border-2 border-transparent focus:border-blue-600 px-6 py-4 rounded-2xl font-bold text-[var(--text-main)] outline-none transition-all shadow-sm min-h-[120px]"
                                        />
                                    )}

                                    {field.fieldType === 'select' && (
                                        <select 
                                            required={field.required}
                                            value={formData[field.fieldName] || ""}
                                            onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
                                            className="w-full bg-[var(--bg-main)] border-2 border-transparent focus:border-blue-600 px-6 py-4 rounded-2xl font-bold text-[var(--text-main)] outline-none transition-all shadow-sm appearance-none cursor-pointer"
                                        >
                                            <option value="">Select an option</option>
                                            {field.options.map((o, i) => <option key={i} value={o}>{o}</option>)}
                                        </select>
                                    )}

                                    {field.fieldType === 'radio' && (
                                        <div className="space-y-3">
                                            {field.options.map((o, i) => (
                                                <label key={i} className="flex items-center gap-3 p-4 bg-[var(--bg-main)] rounded-2xl border-2 border-transparent hover:border-blue-200 cursor-pointer transition-all">
                                                    <input 
                                                        type="radio" 
                                                        required={field.required}
                                                        name={field.fieldName}
                                                        value={o}
                                                        checked={formData[field.fieldName] === o}
                                                        onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
                                                        className="w-5 h-5 accent-blue-600"
                                                    />
                                                    <span className="font-bold text-[var(--text-main)]">{o}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {field.fieldType === 'file' && (
                                        <div className="relative group">
                                            <input 
                                                type="file" 
                                                required={field.required}
                                                onChange={(e) => handleFileChange(field.fieldName, e.target.files[0])}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="border-2 border-dashed border-[var(--border-color)] rounded-2xl p-8 flex flex-col items-center gap-3 bg-[var(--bg-main)] group-hover:border-blue-400 transition-all">
                                                <FaFileUpload className="text-3xl text-[var(--text-muted)] group-hover:text-blue-500 transition-colors" />
                                                <span className="text-sm font-bold text-[var(--text-muted)]">
                                                    {files[field.fieldName] ? files[field.fieldName].name : "Upload Resume / Documents"}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[24px] font-black text-xl shadow-2xl shadow-blue-500/25 transition-all transform hover:-translate-y-1 active:translate-y-0.5 flex justify-center items-center gap-3"
                        >
                            {submitting ? <ClipLoader size={24} color="white" /> : <><FaPaperPlane /> Submit Application</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TrainerRegistration;
