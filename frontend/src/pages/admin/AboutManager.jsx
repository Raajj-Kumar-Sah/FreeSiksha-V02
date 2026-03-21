import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../../config';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash, FaSave, FaImage, FaVideo, FaQuoteLeft, FaKeyboard, FaCloudUploadAlt } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

const AboutManager = () => {
    const [settings, setSettings] = useState({
        backgroundPhotos: [],
        quotes: [],
        typingTexts: [],
        videoUrl: "",
        title: "",
        subtitle: "",
        description: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/about/settings`);
            setSettings(res.data);
        } catch (error) {
            toast.error("Failed to load about settings");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('media', file);

        try {
            const res = await axios.post(`${serverUrl}/api/about/upload`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (type === 'bg') {
                setSettings({ ...settings, backgroundPhotos: [...settings.backgroundPhotos, res.data.url] });
            } else if (type === 'video') {
                setSettings({ ...settings, videoUrl: res.data.url });
            }
            toast.success("Media uploaded successfully");
        } catch (error) {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.post(`${serverUrl}/api/about/settings`, settings, { withCredentials: true });
            toast.success("Settings saved successfully");
        } catch (error) {
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    const addListItem = (key, defaultValue) => {
        setSettings({ ...settings, [key]: [...settings[key], defaultValue] });
    };

    const removeListItem = (key, index) => {
        setSettings({ ...settings, [key]: settings[key].filter((_, i) => i !== index) });
    };

    const updateListItem = (key, index, value) => {
        const newList = [...settings[key]];
        newList[index] = value;
        setSettings({ ...settings, [key]: newList });
    };

    if (loading) return <div className="flex justify-center py-20"><ClipLoader color="#2563eb" /></div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-black">About Page <span className="text-blue-600">Customizer</span></h2>
                    <p className="text-black/70 font-medium">Manage dynamic hero images, video, and typing effects</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-black hover:shadow-xl transition-all"
                >
                    {saving ? <ClipLoader size={18} color="white" /> : <><FaSave /> Publish Changes</>}
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                
                {/* 1. Background Photos */}
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6 text-black">
                    <div className="flex items-center justify-between font-black">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><FaImage /></div>
                            <h3 className="text-xl font-black text-black">Hero Slideshow</h3>
                        </div>
                        <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-blue-700 transition-colors">
                            <FaCloudUploadAlt /> Add Photo
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'bg')} />
                        </label>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {settings.backgroundPhotos.map((url, idx) => (
                            <div key={idx} className="relative group rounded-2xl overflow-hidden aspect-video border border-gray-100 shadow-sm">
                                <img src={url} className="w-full h-full object-cover" alt="Background" />
                                <button 
                                    onClick={() => removeListItem('backgroundPhotos', idx)}
                                    className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Video Player */}
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6 text-black">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><FaVideo /></div>
                            <h3 className="text-xl font-black text-black">Featured Video</h3>
                        </div>
                        <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-indigo-700 transition-colors">
                            <FaCloudUploadAlt /> Replace Video
                            <input type="file" className="hidden" accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} />
                        </label>
                    </div>
                    {settings.videoUrl ? (
                        <div className="relative rounded-2xl overflow-hidden aspect-video bg-black border border-gray-100 shadow-inner">
                            <video src={settings.videoUrl} className="w-full h-full object-contain" controls />
                        </div>
                    ) : (
                        <div className="h-48 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-black/40 gap-2">
                            <FaVideo size={30} />
                            <p className="text-xs font-bold uppercase tracking-widest">No Video Uploaded</p>
                        </div>
                    )}
                </div>

                {/* 3. Typing Animation Text */}
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6 text-black">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><FaKeyboard /></div>
                            <h3 className="text-xl font-black text-black">Typing Animation</h3>
                        </div>
                        <button onClick={() => addListItem('typingTexts', 'New Message')} className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2">
                            <FaPlus /> Add Line
                        </button>
                    </div>
                    <div className="space-y-3">
                        {settings.typingTexts.map((text, idx) => (
                            <div key={idx} className="flex gap-3">
                                <input 
                                    type="text" 
                                    value={text}
                                    onChange={(e) => updateListItem('typingTexts', idx, e.target.value)}
                                    className="flex-1 bg-gray-50 border-2 border-transparent focus:border-amber-400 px-4 py-3 rounded-xl font-bold text-sm outline-none transition-all text-black"
                                />
                                <button onClick={() => removeListItem('typingTexts', idx)} className="p-3 text-black/30 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Quotes Section */}
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6 text-black">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><FaQuoteLeft /></div>
                            <h3 className="text-xl font-black text-black">Inspiring Quotes</h3>
                        </div>
                        <button onClick={() => addListItem('quotes', { text: '', author: '' })} className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2">
                            <FaPlus /> Add Quote
                        </button>
                    </div>
                    <div className="space-y-4">
                        {settings.quotes.map((quote, idx) => (
                            <div key={idx} className="bg-gray-50 p-4 rounded-2xl space-y-3 relative group">
                                <button 
                                    onClick={() => removeListItem('quotes', idx)}
                                    className="absolute top-2 right-2 text-black/30 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <FaTrash size={12} />
                                </button>
                                <textarea 
                                    value={quote.text}
                                    onChange={(e) => {
                                        const newQuotes = [...settings.quotes];
                                        newQuotes[idx].text = e.target.value;
                                        setSettings({ ...settings, quotes: newQuotes });
                                    }}
                                    placeholder="Enter quote here..."
                                    className="w-full bg-white border-none p-3 rounded-xl font-medium text-sm outline-none shadow-sm text-black"
                                    rows={2}
                                />
                                <input 
                                    type="text" 
                                    value={quote.author}
                                    onChange={(e) => {
                                        const newQuotes = [...settings.quotes];
                                        newQuotes[idx].author = e.target.value;
                                        setSettings({ ...settings, quotes: newQuotes });
                                    }}
                                    placeholder="Author Name"
                                    className="w-full bg-white border-none p-3 rounded-xl font-black text-xs outline-none shadow-sm text-black/50"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. Header Texts */}
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6 xl:col-span-2 text-black">
                    <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center"><FaKeyboard /></div>
                        <h3 className="text-xl font-black text-black">Core Content</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-black/40 uppercase tracking-widest pl-1">Page Title</label>
                            <input 
                                type="text" 
                                value={settings.title}
                                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                                className="w-full bg-gray-50 px-6 py-4 rounded-2xl font-black text-lg outline-none focus:bg-white border-2 border-transparent focus:border-purple-200 transition-all text-black"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-black/40 uppercase tracking-widest pl-1">Main Accent</label>
                            <input 
                                type="text" 
                                value={settings.subtitle}
                                onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
                                className="w-full bg-gray-50 px-6 py-4 rounded-2xl font-black text-lg outline-none focus:bg-white border-2 border-transparent focus:border-purple-200 transition-all text-black"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-black text-black/40 uppercase tracking-widest pl-1">Mission Overview</label>
                            <textarea 
                                value={settings.description}
                                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                                rows={4}
                                className="w-full bg-gray-50 px-6 py-4 rounded-2xl font-bold text-sm outline-none focus:bg-white border-2 border-transparent focus:border-purple-200 transition-all text-black"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {uploading && (
                <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[200] flex flex-col items-center justify-center">
                    <ClipLoader size={50} color="#2563eb" />
                    <p className="mt-4 font-black text-black uppercase tracking-widest text-sm">Processing Media...</p>
                </div>
            )}
        </div>
    );
};

export default AboutManager;

