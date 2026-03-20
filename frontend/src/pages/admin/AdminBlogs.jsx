import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { FaPlus, FaTrash, FaEdit, FaEye, FaHeart } from 'react-icons/fa';

export default function AdminBlogs({ userRole }) {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [content, setContent] = useState("");
    const [thumbnail, setThumbnail] = useState(null);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/blogs/manager/all`, { withCredentials: true });
            setBlogs(res.data);
        } catch (error) {
            toast.error("Failed to load your blogs.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBlog = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("category", category);
            formData.append("content", content);
            if (thumbnail) formData.append("thumbnail", thumbnail);
            
            // Pass the role implicitly or explicitly
            formData.append("authorRole", userRole); // 'educator' or 'admin'

            await axios.post(`${serverUrl}/api/blogs/create`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });

            toast.success("Blog published safely!");
            setIsFormOpen(false);
            resetForm();
            fetchBlogs();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to publish blog.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this blog?")) return;
        try {
            await axios.delete(`${serverUrl}/api/blogs/manager/${id}`, { withCredentials: true });
            toast.success("Blog trashed.");
            setBlogs(blogs.filter(b => b._id !== id));
        } catch (error) {
            toast.error("Deletion rejected.");
        }
    };

    const resetForm = () => {
        setTitle("");
        setCategory("");
        setContent("");
        setThumbnail(null);
    };

    if (loading) return <div className="flex justify-center p-20"><ClipLoader color="#3B82F6" size={40} /></div>;

    return (
        <div className="p-6 min-h-screen bg-[var(--bg-main)]">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-black text-[var(--text-main)]">Manage Content</h2>
                    <p className="text-[var(--text-muted)] mt-1 font-medium italic">Write, edit, and moderate platform insights.</p>
                </div>
                {!isFormOpen && userRole !== 'admin' && (
                    <button 
                        onClick={() => setIsFormOpen(true)}
                        className="btn-primary py-3.5 px-8 rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all text-sm"
                    >
                        <FaPlus /> New Article
                    </button>
                )}
            </div>

            {/* Creation Form Overlay / Section */}
            {isFormOpen && (
                <div className="bg-[var(--bg-surface)] rounded-[32px] p-8 md:p-12 shadow-2xl border border-[var(--border-color)] mb-12 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
                    {/* Background Sparkles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-10 -z-10 translate-x-1/2 -translate-y-1/2"></div>
                    
                    <h3 className="text-2xl font-bold text-[var(--text-main)] mb-8 flex items-center gap-3">
                        <span className="p-2 bg-blue-500/10 rounded-xl">✍️</span> Draft New Article
                    </h3>

                    <form onSubmit={handleCreateBlog} className="space-y-8 max-w-5xl relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[var(--text-main)] ml-1">Engaging Title</label>
                                <input 
                                    type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-[var(--text-main)] placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                    placeholder="Enter extreme hook title..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[var(--text-main)] ml-1">Category / Tag</label>
                                <input 
                                    type="text" required value={category} onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-[var(--text-main)] placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                    placeholder="e.g. Next.js, Success Stories, Study Tips"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-[var(--text-main)] ml-1">Banner Image (Thumbnail)</label>
                            <input 
                                type="file" required accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])}
                                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-5 py-3.5 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all cursor-pointer text-sm text-[var(--text-muted)]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-[var(--text-main)] ml-1">Main Content Body</label>
                            <p className="text-xs text-[var(--text-muted)] mb-3 opacity-70">Plain text or HTML supported for ultimate rendering control.</p>
                            <textarea
                                required value={content} onChange={(e) => setContent(e.target.value)} rows={12}
                                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-[var(--text-main)] resize-y min-h-[300px]"
                                placeholder={`<h2>Step 1: Introduction</h2>\n<p>HTML is fully supported here for ultimate rendering control.</p>`}
                            />
                        </div>

                        <div className="flex justify-end gap-4 pt-6">
                            <button 
                                type="button" onClick={() => { setIsFormOpen(false); resetForm(); }}
                                className="px-8 py-4 font-bold text-[var(--text-muted)] bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl hover:bg-[var(--bg-surface)] hover:text-[var(--text-main)] transition-all active:scale-95 text-sm"
                            >
                                Cancel Draft
                            </button>
                            <button 
                                type="submit" disabled={submitting}
                                className="px-10 py-4 font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-600/20 active:scale-95 transition-all text-sm"
                            >
                                {submitting ? <ClipLoader size={20} color="#fff" /> : "🚀 Publish Post"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List Phase */}
            {blogs.length === 0 ? (
                <div className="bg-[var(--bg-surface)] rounded-[40px] p-20 text-center border border-[var(--border-color)] shadow-inner">
                    <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaEdit className="text-4xl text-blue-500 opacity-80" />
                    </div>
                    <h3 className="text-2xl font-black text-[var(--text-main)] mb-3">Your Content Archive is Empty</h3>
                    <p className="text-[var(--text-muted)] text-lg max-w-md mx-auto">Publish your very first learning block to start accumulating hearts and inspiring seekers!</p>
                </div>
            ) : (
                <div className="bg-[var(--bg-surface)] rounded-[32px] shadow-2xl border border-[var(--border-color)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[var(--bg-main)]/50 border-b border-[var(--border-color)] text-[var(--text-muted)] text-xs tracking-widest uppercase font-black">
                                    <th className="p-6">Thumbnail</th>
                                    <th className="p-6">Title</th>
                                    <th className="p-6">Engagement</th>
                                    <th className="p-6">Published</th>
                                    <th className="p-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-color)]">
                                {blogs.map(b => (
                                    <tr key={b._id} className="hover:bg-blue-500/5 transition-colors group">
                                        <td className="p-6">
                                            <div className="w-28 h-16 rounded-xl overflow-hidden bg-[var(--bg-main)] border border-[var(--border-color)] shadow-sm group-hover:shadow-md transition-all">
                                                <img src={b.thumbnail} alt="thumb" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <p className="font-bold text-[var(--text-main)] text-lg line-clamp-1 group-hover:text-blue-500 transition-colors">{b.title}</p>
                                            <div className="inline-block text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-1.5 px-2 py-0.5 bg-blue-500/10 rounded-full">
                                                {b.category}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 text-red-500 font-black bg-red-500/10 px-3 py-1.5 rounded-xl border border-red-500/20">
                                                    <FaHeart size={14} className="group-hover:animate-bounce" /> {b.hearts.length}
                                                </div>
                                                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20">
                                                    <FaEye size={14} /> {b.views}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-[var(--text-muted)] font-bold text-sm">
                                            {new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="p-6 text-right space-x-4">
                                            <button 
                                                onClick={() => window.open(`/blog/${b._id}`, '_blank')}
                                                className="w-10 h-10 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] inline-flex items-center justify-center text-[var(--text-muted)] hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm"
                                                title="View Live"
                                            >
                                                <FaEye size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(b._id)}
                                                className="w-10 h-10 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] inline-flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:border-red-500 transition-all shadow-sm"
                                                title="Trash"
                                            >
                                                <FaTrash size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
