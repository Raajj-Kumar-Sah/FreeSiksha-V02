import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { FaHeart, FaEye, FaArrowLeft, FaCalendarAlt, FaUserEdit } from 'react-icons/fa';
import DOMPurify from 'dompurify'; // Important for safely rendering HTML content
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function BlogDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [heartCount, setHeartCount] = useState(0);

    useEffect(() => {
        fetchBlogAndTrackView();
    }, [id]);

    const fetchBlogAndTrackView = async () => {
        setLoading(true);
        try {
            // Fetch Details
            const res = await axios.get(`${serverUrl}/api/blogs/${id}`, { withCredentials: true });
            setBlog(res.data);
            setHeartCount(res.data.hearts.length);
            
            // Check if current user liked it (assumes frontend has user state, or we just rely on the toggle response)
            // For a robust app, you'd check if user._id is in res.data.hearts. For now, trusting backend toggle logic.
            
            // Increment View (Fire and forget)
            axios.post(`${serverUrl}/api/blogs/${id}/view`).catch(e => console.log('View tracking failed'));
        } catch (error) {
            toast.error("Failed to load blog");
            navigate('/blogs');
        } finally {
            setLoading(false);
        }
    };

    const handleHeartToggle = async () => {
        try {
            const res = await axios.post(`${serverUrl}/api/blogs/${id}/heart`, {}, { withCredentials: true });
            setIsLiked(res.data.isLiked);
            setHeartCount(res.data.heartsLength);
            
            // Heart Animation Effect
            const icon = document.getElementById('heart-btn-icon');
            if (icon) {
                icon.classList.add('scale-150');
                setTimeout(() => icon.classList.remove('scale-150'), 200);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                toast.warning("Please login to like this post!");
                navigate('/login');
            } else {
                toast.error("Failed to update like");
            }
        }
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center"><ClipLoader color="#3B82F6" size={60} /></div>;
    if (!blog) return null;

    return (
        <>
        <Nav />
        <SEO 
            title={blog.title}
            description={blog.content ? blog.content.substring(0, 160).replace(/<[^>]*>?/gm, '') : ""}
            ogImage={blog.thumbnail}
            ogUrl={window.location.href}
        />
        <script type="application/ld+json">
            {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": blog.title,
                "image": blog.thumbnail,
                "author": {
                    "@type": "Person",
                    "name": "FreeSiksha Educator"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "FreeSiksha",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "http://localhost:5173/logo.jpg"
                    }
                },
                "datePublished": blog.createdAt
            })}
        </script>
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] pt-28 pb-24 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-6">
                
                {/* Back Button */}
                <button 
                    onClick={() => navigate('/blogs')}
                    className="flex items-center gap-2 text-[var(--text-muted)] hover:text-blue-600 font-bold mb-8 transition-colors"
                >
                    <FaArrowLeft /> Back to Insights
                </button>
            <Breadcrumbs 
                items={[
                    { label: 'Blogs', path: '/blogs' },
                    { label: blog.title, path: `/blog/${id}` }
                ]} 
            />

            {/* Banner wrapper */}
            <div className="bg-[var(--bg-surface)] rounded-[40px] shadow-sm border border-[var(--border-color)] overflow-hidden mb-12">
                {/* Hero Image */}
                <div className="h-80 md:h-[400px] w-full relative bg-gray-900">
                    <img 
                        src={blog.thumbnail || 'https://via.placeholder.com/1200x600'} 
                        alt={blog.title} 
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                    
                    <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                        <div>
                            <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg mb-4 inline-block">
                                {blog.category || 'Education'}
                            </span>
                            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-lg max-w-2xl">
                                {blog.title}
                            </h1>
                        </div>
                    </div>
                </div>

                    {/* Meta Bar */}
                    <div className="px-10 py-6 border-b border-[var(--border-color)] flex flex-wrap justify-between items-center gap-4 bg-[var(--bg-main)]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xl shadow-inner">
                                <FaUserEdit />
                            </div>
                            <div>
                                <p className="font-bold text-[var(--text-main)] text-lg">{blog.authorId?.name || 'Administrator'}</p>
                                <div className="flex items-center text-sm text-[var(--text-muted)] gap-1.5 font-medium">
                                    <FaCalendarAlt className="opacity-50" />
                                    {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </div>
                            </div>
                        </div>

                        {/* Interactive Metrics */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-[var(--text-muted)] font-bold">
                                <FaEye size={20} className="opacity-50" />
                                <span>{blog.views + 1} Views</span> {/* Optimistic +1 for current view */}
                            </div>
                            <button 
                                onClick={handleHeartToggle}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold shadow-sm transition-all border ${isLiked || heartCount > 0 ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20' : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-color)] hover:bg-[var(--bg-main)]'}`}
                            >
                                <FaHeart id="heart-btn-icon" size={20} className={`transition-transform duration-300 ${isLiked ? 'text-red-500' : ''}`} />
                                {heartCount} Likes
                            </button>
                        </div>
                    </div>

                    {/* Rich Content Area */}
                    <div className="p-10 md:p-14">
                        <div 
                            className="prose prose-lg prose-blue max-w-none text-[var(--text-main)] leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content.replace(/\n/g, '<br/>')) }}
                        />
                    </div>
                </div>

            </div>
        </div>
        <Footer />
        </>
    );
}
