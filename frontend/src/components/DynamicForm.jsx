import React from 'react';

const DynamicForm = ({ schema, formData, setFormData }) => {
    
    const handleInputChange = (fieldName, value) => {
        setFormData({ ...formData, [fieldName]: value });
    };

    const handleCheckboxChange = (fieldName, option, checked) => {
        const currentValues = formData[fieldName] || [];
        let newValues;
        if (checked) {
            newValues = [...currentValues, option];
        } else {
            newValues = currentValues.filter(val => val !== option);
        }
        setFormData({ ...formData, [fieldName]: newValues });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {schema.map((field, index) => (
                <div key={index} className="space-y-3">
                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                        {field.fieldName}
                        {field.required && <span className="text-red-500">*</span>}
                    </label>

                    {field.fieldType === 'text' && (
                        <input 
                            type={
                                field.validationType === 'email' ? 'email' : 
                                field.validationType === 'number' ? 'number' : 
                                field.validationType === 'tel' ? 'tel' : 
                                'text'
                            }
                            required={field.required}
                            className="w-full bg-white/50 backdrop-blur-sm border-2 border-gray-100 focus:border-blue-500 rounded-2xl px-6 py-4 outline-none transition-all font-bold text-gray-700 shadow-sm"
                            placeholder={
                                field.validationType === 'name' ? 'Jane Doe' :
                                field.validationType === 'email' ? 'example@gmail.com' :
                                field.validationType === 'tel' ? '+91 00000 00000' :
                                `Enter your ${field.fieldName.toLowerCase()}...`
                            }
                            value={formData[field.fieldName] || ""}
                            onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
                        />
                    )}

                    {field.fieldType === 'textarea' && (
                        <textarea 
                            required={field.required}
                            className="w-full bg-white/50 backdrop-blur-sm border-2 border-gray-100 focus:border-blue-500 rounded-2xl px-6 py-4 outline-none transition-all font-bold text-gray-700 shadow-sm"
                            placeholder={`Tell us about your ${field.fieldName.toLowerCase()}...`}
                            rows={3}
                            value={formData[field.fieldName] || ""}
                            onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
                        />
                    )}

                    {field.fieldType === 'select' && (
                        <select 
                            required={field.required}
                            className="w-full bg-white/50 backdrop-blur-sm border-2 border-gray-100 focus:border-blue-500 rounded-2xl px-6 py-4 outline-none transition-all font-bold text-gray-700 shadow-sm appearance-none"
                            value={formData[field.fieldName] || ""}
                            onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
                        >
                            <option value="">Select an option</option>
                            {field.options.map((opt, i) => (
                                <option key={i} value={opt}>{opt}</option>
                            ))}
                        </select>
                    )}

                    {field.fieldType === 'radio' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {field.options.map((opt, i) => (
                                <label key={i} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData[field.fieldName] === opt ? 'bg-blue-50 border-blue-500 shadow-md' : 'bg-white/30 border-gray-100 hover:border-blue-200'}`}>
                                    <input 
                                        type="radio" 
                                        name={field.fieldName}
                                        required={field.required}
                                        value={opt}
                                        checked={formData[field.fieldName] === opt}
                                        onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
                                        className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="font-bold text-gray-700">{opt}</span>
                                </label>
                            ))}
                        </div>
                    )}

                    {field.fieldType === 'checkbox' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {field.options.map((opt, i) => (
                                <label key={i} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${(formData[field.fieldName] || []).includes(opt) ? 'bg-blue-50 border-blue-500 shadow-md' : 'bg-white/30 border-gray-100 hover:border-blue-200'}`}>
                                    <input 
                                        type="checkbox" 
                                        checked={(formData[field.fieldName] || []).includes(opt)}
                                        onChange={(e) => handleCheckboxChange(field.fieldName, opt, e.target.checked)}
                                        className="w-5 h-5 text-blue-600 rounded-lg focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="font-bold text-gray-700">{opt}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default DynamicForm;
