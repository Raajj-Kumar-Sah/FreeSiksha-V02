import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import axios from 'axios';
import { serverUrl } from '../App';
import BlogCard from '../components/BlogCard';
import { ClipLoader } from 'react-spinners';
import { FaFireAlt, FaRegClock } from 'react-icons/fa';
import SEO from '../components/SEO';

export default function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('newest'); // 'trending' or 'newest'

    useEffect(() => {
        fetchBlogs();
    }, [filter]);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${serverUrl}/api/blogs/public?filter=${filter}`);
            setBlogs(res.data);
        } catch (error) {
            console.error("Failed to fetch blogs", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <Nav />
        <SEO 
            title="Insights & Articles - Industry Trends"
            description="Explore the latest insights on technology, education, and career growth from Freesiksha's expert educators."
            keywords="edtech blogs india, tech tutorials, educational articles, freesiksha insights"
        />
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] pt-32 pb-24 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                
                {/* Header & Filters (Phase 5) */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-[var(--text-main)] tracking-tight mb-3">
                            FreeSiksha <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Insights</span>
                        </h1>
                        <p className="text-[var(--text-muted)] font-medium text-lg">Discover the latest industry trends, tutorials, and success stories.</p>
                    </div>

                    <div className="flex bg-[var(--bg-surface)] rounded-xl shadow-sm border border-[var(--border-color)] p-1">
                        <button 
                            onClick={() => setFilter('newest')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${filter === 'newest' ? 'bg-[var(--text-main)] text-[var(--bg-main)] shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-main)]'}`}
                        >
                            <FaRegClock /> Newest
                        </button>
                        <button 
                            onClick={() => setFilter('trending')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${filter === 'trending' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md' : 'text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50'}`}
                        >
                            <FaFireAlt /> Trending
                        </button>
                    </div>
                </div>

                {/* Grid (Phase 2) */}
                {loading ? (
                    <div className="flex justify-center items-center py-32">
                        <ClipLoader color="#3B82F6" size={50} />
                    </div>
                ) : blogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map(blog => (
                            <BlogCard key={blog._id} blog={blog} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-[var(--bg-surface)] rounded-3xl p-16 text-center border border-[var(--border-color)] shadow-sm">
                        <div className="w-24 h-24 bg-[var(--bg-main)] rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaRegClock className="text-4xl text-[var(--border-color)]" />
                        </div>
                        <h3 className="text-2xl font-bold text-[var(--text-main)] mb-2">No Articles Found</h3>
                        <p className="text-[var(--text-muted)] max-w-md mx-auto">There are currently no blogs available. Check back soon for fresh content from our educators!</p>
                    </div>
                )}
            </div>
        </div>
        <Footer />
        </>
    );
}
