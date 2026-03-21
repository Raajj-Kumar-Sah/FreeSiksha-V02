import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash, FaSave, FaWrench, FaArrowUp, FaArrowDown, FaEye, FaRegCheckSquare, FaDotCircle, FaChevronDown, FaAlignLeft, FaGripVertical, FaFileUpload } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

const TrainerFormBuilder = () => {
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);

    useEffect(() => {
        fetchForm();
    }, []);

    const fetchForm = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/trainer/form`);
            setFields(res.data.fields || []);
        } catch (error) {
            console.error("No form found, starting fresh");
        } finally {
            setLoading(false);
        }
    };

    const addField = () => {
        setFields([...fields, { 
            fieldName: '', 
            fieldType: 'text', 
            validationType: 'none',
            required: false, 
            options: ['Option 1'] 
        }]);
    };

    const removeField = (index) => {
        setFields(fields.filter((_, i) => i !== index));
    };

    const updateField = (index, key, value) => {
        const newFields = [...fields];
        newFields[index][key] = value;
        setFields(newFields);
    };

    const addOption = (fieldIndex) => {
        const newFields = [...fields];
        newFields[fieldIndex].options.push(`Option ${newFields[fieldIndex].options.length + 1}`);
        setFields(newFields);
    };

    const updateOption = (fieldIndex, optionIndex, value) => {
        const newFields = [...fields];
        newFields[fieldIndex].options[optionIndex] = value;
        setFields(newFields);
    };

    const removeOption = (fieldIndex, optionIndex) => {
        const newFields = [...fields];
        newFields[fieldIndex].options = newFields[fieldIndex].options.filter((_, i) => i !== optionIndex);
        setFields(newFields);
    };

    const moveField = (index, direction) => {
        if ((index === 0 && direction === -1) || (index === fields.length - 1 && direction === 1)) return;
        const newFields = [...fields];
        const temp = newFields[index];
        newFields[index] = newFields[index + direction];
        newFields[index + direction] = temp;
        setFields(newFields);
    };

    const handleSave = async () => {
        if (fields.some(f => !f.fieldName)) {
            return toast.error("All questions must have a title");
        }
        setSaving(true);
        try {
            await axios.post(`${serverUrl}/api/trainer/form`, { fields }, { withCredentials: true });
            toast.success("Trainer form updated successfully");
        } catch (error) {
            toast.error("Failed to save trainer form");
        } finally {
            setSaving(false);
        }
    };

    const getIconForType = (type) => {
        switch(type) {
            case 'text': return <FaAlignLeft className="text-blue-500" />;
            case 'textarea': return <FaAlignLeft className="text-blue-500" />;
            case 'select': return <FaChevronDown className="text-emerald-500" />;
            case 'radio': return <FaDotCircle className="text-purple-500" />;
            case 'checkbox': return <FaRegCheckSquare className="text-amber-500" />;
            case 'file': return <FaFileUpload className="text-red-500" />;
            default: return <FaWrench />;
        }
    };

    if (loading) return <div className="flex justify-center py-20"><ClipLoader color="#2563eb" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                            <FaWrench className="text-white text-xl" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Trainer Form <span className="text-blue-600">Builder</span></h2>
                    </div>
                    <p className="text-gray-400 font-bold text-sm tracking-wide ml-1">DYNAMIC ONBOARDING ENGINE v2.0</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setPreviewMode(!previewMode)}
                        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black transition-all border-2 ${previewMode ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100'}`}
                    >
                        <FaEye /> {previewMode ? "Edit Mode" : "Live Preview"}
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center justify-center gap-2 bg-gray-900 border-b-4 border-black text-white px-8 py-3 rounded-2xl font-black hover:translate-y-[-2px] active:translate-y-[2px] transition-all shadow-xl"
                    >
                        {saving ? <ClipLoader size={18} color="white" /> : <><FaSave /> Save Changes</>}
                    </button>
                </div>
            </div>

            {previewMode ? (
                /* LIVE PREVIEW SECTION */
                <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-gray-100 space-y-12 min-h-[600px]">
                    <div className="space-y-2 border-l-8 border-blue-600 pl-6">
                        <h1 className="text-4xl font-black text-gray-900">Trainer Registration</h1>
                        <p className="text-gray-500 font-medium">Apply to share your expertise with our learners.</p>
                    </div>
                    
                    <div className="space-y-10">
                        {fields.map((field, idx) => (
                            <div key={idx} className="space-y-4">
                                <label className="text-lg font-black text-gray-800 flex items-center gap-2">
                                    {field.fieldName || "Untitled Question"}
                                    {field.required && <span className="text-red-500 font-black">*</span>}
                                </label>
                                
                                {field.fieldType === 'text' && (
                                    <input type="text" className="w-full border-b-2 border-gray-100 focus:border-blue-600 py-3 outline-none transition-all text-gray-600 font-medium" placeholder="Short answer text" disabled />
                                )}
                                
                                {field.fieldType === 'textarea' && (
                                    <textarea className="w-full border-b-2 border-gray-100 focus:border-blue-600 py-3 outline-none transition-all text-gray-600 font-medium" placeholder="Long answer text" disabled rows={2} />
                                )}

                                {field.fieldType === 'select' && (
                                    <div className="relative group max-w-md">
                                        <select className="w-full bg-gray-50 border border-gray-200 py-4 px-6 rounded-2xl appearance-none font-bold text-gray-600" disabled>
                                            <option>Choose an option</option>
                                            {field.options.map((o, i) => <option key={i}>{o}</option>)}
                                        </select>
                                        <FaChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                )}

                                {field.fieldType === 'radio' && (
                                    <div className="space-y-3">
                                        {field.options.map((o, i) => (
                                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors w-full max-w-md border border-transparent">
                                                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                                    <div className="w-3 h-3 rounded-full bg-transparent"></div>
                                                </div>
                                                <span className="font-bold text-gray-700">{o}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {field.fieldType === 'checkbox' && (
                                    <div className="space-y-3">
                                        {field.options.map((o, i) => (
                                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors w-full max-w-md border border-transparent">
                                                <div className="w-6 h-6 rounded-lg border-2 border-gray-300 flex items-center justify-center"></div>
                                                <span className="font-bold text-gray-700">{o}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {field.fieldType === 'file' && (
                                    <div className="border-4 border-dashed border-gray-100 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 bg-gray-50/50">
                                        <FaFileUpload className="text-3xl text-gray-300" />
                                        <span className="text-sm font-bold text-gray-400">Upload documents (PDF, DOC, Images)</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                /* EDIT MODE SECTION */
                <div className="space-y-6">
                    {fields.map((field, index) => (
                        <div key={index} className="group relative bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all hover:border-blue-200">
                            {/* Accent Bar */}
                            <div className="absolute left-0 top-0 bottom-0 w-2 bg-gray-200 group-hover:bg-blue-600 transition-all"></div>
                            
                            <div className="p-8 space-y-8">
                                {/* Row 1: Question and Type */}
                                <div className="flex flex-col lg:flex-row gap-6">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaGripVertical className="text-gray-300 group-hover:text-blue-500 cursor-grab active:cursor-grabbing" />
                                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Question Name</label>
                                        </div>
                                        <input 
                                            type="text" 
                                            value={field.fieldName}
                                            onChange={(e) => updateField(index, 'fieldName', e.target.value)}
                                            placeholder="Untitled Question"
                                            className="w-full text-xl font-black text-gray-900 bg-gray-50 hover:bg-white focus:bg-white border-2 border-transparent focus:border-blue-600 px-6 py-4 rounded-2xl outline-none transition-all"
                                        />
                                    </div>
                                    <div className="lg:w-72 space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Field Category</label>
                                        <div className="relative">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2">
                                                {getIconForType(field.fieldType)}
                                            </div>
                                            <select 
                                                value={field.fieldType}
                                                onChange={(e) => updateField(index, 'fieldType', e.target.value)}
                                                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 rounded-2xl font-black text-sm text-gray-700 outline-none appearance-none cursor-pointer transition-all"
                                            >
                                                <option value="text">Short Answer</option>
                                                <option value="textarea">Paragraph</option>
                                                <option value="radio">Multiple Choice</option>
                                                <option value="checkbox">Checkboxes</option>
                                                <option value="select">Dropdown Menu</option>
                                                <option value="file">File Upload</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Row 2: Options (if choice-based) */}
                                {['select', 'radio', 'checkbox'].includes(field.fieldType) && (
                                    <div className="bg-gray-50 p-6 rounded-3xl space-y-4 border border-gray-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">Configure Choices</h4>
                                            <button onClick={() => addOption(index)} className="text-xs font-black text-blue-600 hover:underline flex items-center gap-1">
                                                <FaPlus /> Add Option
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {field.options.map((option, optIdx) => (
                                                <div key={optIdx} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                                    <input 
                                                        type="text" 
                                                        value={option}
                                                        onChange={(e) => updateOption(index, optIdx, e.target.value)}
                                                        className="flex-1 bg-white border-2 border-transparent focus:border-emerald-500/50 px-4 py-3 rounded-xl text-sm font-bold text-gray-700 outline-none shadow-sm transition-all"
                                                    />
                                                    <button 
                                                        onClick={() => removeOption(index, optIdx)}
                                                        className="p-3 text-gray-300 hover:text-red-500 rounded-xl hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <FaTrash size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Row 3: Utility Controls */}
                                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => moveField(index, -1)}
                                            disabled={index === 0}
                                            className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-gray-50 transition-all"
                                        >
                                            <FaArrowUp />
                                        </button>
                                        <button 
                                            onClick={() => moveField(index, 1)}
                                            disabled={index === fields.length - 1}
                                            className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-gray-50 transition-all"
                                        >
                                            <FaArrowDown />
                                        </button>
                                    </div>
                                    
                                    <div className="flex items-center gap-8">
                                        <label className="flex items-center gap-3 cursor-pointer select-none group/toggle">
                                            <div className="relative">
                                                <input 
                                                    type="checkbox" 
                                                    checked={field.required}
                                                    onChange={(e) => updateField(index, 'required', e.target.checked)}
                                                    className="sr-only"
                                                />
                                                <div className={`w-11 h-6 rounded-full transition-colors ${field.required ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                                                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${field.required ? 'translate-x-5' : 'translate-x-0'} shadow-sm`}></div>
                                            </div>
                                            <span className="text-sm font-black text-gray-600 group-hover/toggle:text-blue-600 transition-all">REQUIRED FIELD</span>
                                        </label>
                                        <div className="h-8 w-px bg-gray-100 mx-2"></div>
                                        <button 
                                            onClick={() => removeField(index)}
                                            className="p-4 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <button 
                        onClick={addField}
                        className="w-full bg-white border-4 border-dashed border-gray-100 p-8 rounded-[40px] flex flex-col items-center justify-center gap-4 text-gray-300 hover:border-blue-200 hover:text-blue-400 hover:bg-blue-50/20 transition-all group"
                    >
                        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-100 transition-all">
                            <FaPlus className="text-2xl" />
                        </div>
                        <span className="text-xl font-black uppercase tracking-widest">Append New Question Card</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default TrainerFormBuilder;
