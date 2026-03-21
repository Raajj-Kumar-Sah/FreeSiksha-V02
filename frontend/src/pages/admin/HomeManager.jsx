import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { FaHome, FaSave, FaUpload, FaVideo, FaImage, FaPlus, FaTimes } from 'react-icons/fa';

const HomeManager = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        tagline: '',
        heroTitleStatic: '',
        heroWords: [],
        heroTitleSuffix: '',
        heroDescription: '',
        socialProofCount: 0,
        heroVideoUrl: '',
        heroImageUrl: ''
    });

    const [newWord, setNewWord] = useState('');
    const [media, setMedia] = useState({ video: null, image: null });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/home-page/settings`);
            setSettings(res.data);
        } catch (error) {
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        const formData = new FormData();
        formData.append('tagline', settings.tagline);
        formData.append('heroTitleStatic', settings.heroTitleStatic);
        formData.append('heroWords', JSON.stringify(settings.heroWords));
        formData.append('heroTitleSuffix', settings.heroTitleSuffix);
        formData.append('heroDescription', settings.heroDescription);
        formData.append('socialProofCount', settings.socialProofCount);

        if (media.video) formData.append('heroVideo', media.video);
        if (media.image) formData.append('heroImage', media.image);

        try {
            await axios.post(`${serverUrl}/api/home-page/settings`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            toast.success("Homepage updated successfully!");
            fetchSettings();
        } catch (error) {
            toast.error("Update failed");
        } finally {
            setSaving(false);
        }
    };

    const addWord = () => {
        if (!newWord.trim()) return;
        setSettings({ ...settings, heroWords: [...settings.heroWords, newWord.trim()] });
        setNewWord('');
    };

    const removeWord = (index) => {
        const newWords = settings.heroWords.filter((_, i) => i !== index);
        setSettings({ ...settings, heroWords: newWords });
    };

    if (loading) return <div className="flex justify-center p-20"><ClipLoader color="#2563eb" /></div>;

    return (
        <div className="max-w-5xl mx-auto animate-in fade-in duration-700 pb-20">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                        <FaHome size={20} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Homepage Manager</h2>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Control Hero Content & Media</p>
                    </div>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-600/20 hover:scale-105 transition-all disabled:opacity-50"
                >
                    {saving ? <ClipLoader size={16} color="white" /> : <><FaSave /> Save Changes</>}
                </button>
            </div>

            <form className="space-y-8">
                {/* Hero Text Content */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-6">
                    <h3 className="text-gray-900 font-black uppercase text-xs tracking-widest border-b border-gray-50 pb-4">Hero Text Breakdown</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hero Tagline</label>
                            <input 
                                type="text"
                                value={settings.tagline}
                                onChange={(e) => setSettings({...settings, tagline: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-bold text-gray-700"
                                placeholder="e.g. NON PROFIT EDUCATION"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Social Proof Count</label>
                            <input 
                                type="number"
                                value={settings.socialProofCount}
                                onChange={(e) => setSettings({...settings, socialProofCount: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-bold text-gray-700"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hero Title Prefix</label>
                            <input 
                                type="text"
                                value={settings.heroTitleStatic}
                                onChange={(e) => setSettings({...settings, heroTitleStatic: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-bold text-gray-700"
                                placeholder="Free & Quality"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hero Title Suffix</label>
                            <input 
                                type="text"
                                value={settings.heroTitleSuffix}
                                onChange={(e) => setSettings({...settings, heroTitleSuffix: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-bold text-gray-700"
                                placeholder="for All"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Main Description</label>
                        <textarea 
                            value={settings.heroDescription}
                            onChange={(e) => setSettings({...settings, heroDescription: e.target.value})}
                            rows="3"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-700 resize-none"
                        ></textarea>
                    </div>
                </div>

                {/* Typing Animation Words */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-6">
                    <h3 className="text-gray-900 font-black uppercase text-xs tracking-widest border-b border-gray-50 pb-4">Typing Animation Sequences</h3>
                    <div className="flex flex-wrap gap-2">
                        {settings.heroWords.map((word, i) => (
                            <div key={i} className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold border border-blue-100">
                                {word}
                                <button type="button" onClick={() => removeWord(i)} className="hover:text-red-500 transition-colors">
                                    <FaTimes size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-4">
                        <input 
                            type="text"
                            value={newWord}
                            onChange={(e) => setNewWord(e.target.value)}
                            className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-bold text-gray-700"
                            placeholder="Add new word..."
                        />
                        <button type="button" onClick={addWord} className="px-6 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all">
                            <FaPlus />
                        </button>
                    </div>
                </div>

                {/* Hero Media */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Hero Background Video</label>
                        <div className="relative group aspect-video bg-gray-900 rounded-[24px] overflow-hidden">
                            <video src={media.video ? URL.createObjectURL(media.video) : settings.heroVideoUrl} className="w-full h-full object-cover opacity-60" loop muted autoPlay />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <label className="cursor-pointer bg-white/20 backdrop-blur-md p-4 rounded-full text-white border border-white/30 hover:bg-white/40 transition-all">
                                    <FaVideo size={24} />
                                    <input type="file" hidden accept="video/mp4" onChange={(e) => setMedia({...media, video: e.target.files[0]})} />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Hero Side Image</label>
                        <div className="relative group aspect-video bg-gray-100 rounded-[24px] overflow-hidden">
                            <img src={media.image ? URL.createObjectURL(media.image) : settings.heroImageUrl} className="w-full h-full object-contain" alt="" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <label className="cursor-pointer bg-black/20 backdrop-blur-md p-4 rounded-full text-white border border-white/30 hover:bg-black/40 transition-all">
                                    <FaImage size={24} />
                                    <input type="file" hidden accept="image/*" onChange={(e) => setMedia({...media, image: e.target.files[0]})} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default HomeManager;
