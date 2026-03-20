import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { FaVideo, FaUpload, FaCheckCircle, FaHdd } from 'react-icons/fa';

export default function AdminSettings() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/settings/public`);
            setSettings(res.data.settings);
        } catch (error) {
            toast.error("Failed to load platform settings");
        } finally {
            setLoading(false);
        }
    };

    const handleVideoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('video/')) {
            toast.error("Please select a valid video file (.mp4, .webm, etc)");
            return;
        }

        // Limit to 50MB (arbitrary check)
        if (file.size > 50 * 1024 * 1024) {
            toast.error("Video file is too large! Maximum 50MB allowed.");
            return;
        }

        const formData = new FormData();
        formData.append('video', file);

        setUploading(true);
        const uploadToast = toast.loading("Uploading video to Cloudinary... This may take a minute depending on file size.");

        try {
            const res = await axios.post(`${serverUrl}/api/settings/about-video`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            toast.update(uploadToast, { render: "Video uploaded successfully!", type: "success", isLoading: false, autoClose: 3000 });
            setSettings(res.data.settings);
        } catch (error) {
            toast.update(uploadToast, { render: "Video upload failed.", type: "error", isLoading: false, autoClose: 3000 });
            console.error(error);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    if (loading) return <div className="flex justify-center items-center py-20"><ClipLoader color="#3B82F6" size={50} /></div>;

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="mb-8 pb-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-3">
                        <FaHdd className="text-blue-600" /> Platform Configuration
                    </h2>
                    <p className="text-gray-500">Manage global site settings and media assets.</p>
                </div>
            </div>

            {/* About Page Video Section */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <FaVideo />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">About Page Intro Video</h3>
                        <p className="text-sm text-gray-500">This video is securely streamed via Cloudinary on the public About page.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center mt-6">
                    
                    {/* File Uploader */}
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-white hover:bg-gray-50 transition-colors">
                        <input 
                            type="file" 
                            accept="video/*" 
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={handleVideoUpload}
                            disabled={uploading}
                        />
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                            {uploading ? <ClipLoader color="#3B82F6" size={24} /> : <FaUpload />}
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">Upload New Video</h4>
                        <p className="text-sm text-gray-500 mb-6">MP4 or WebM up to 50MB</p>
                        
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${uploading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
                        >
                            {uploading ? "Processing..." : "Select File"}
                        </button>
                    </div>

                    {/* Preview */}
                    <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video shadow-inner border border-gray-200">
                        {settings?.aboutVideoUrl ? (
                            <video 
                                src={settings.aboutVideoUrl}
                                className="w-full h-full object-cover"
                                controls
                                preload="metadata"
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 p-6 text-center">
                                <FaVideo className="text-4xl mb-3 opacity-20" />
                                <p className="font-bold">No Video Uploaded</p>
                                <p className="text-sm">The About page will fallback to a default background.</p>
                            </div>
                        )}
                        {settings?.aboutVideoUrl && (
                            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                                <FaCheckCircle /> Live
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
        </div>
    );
}
