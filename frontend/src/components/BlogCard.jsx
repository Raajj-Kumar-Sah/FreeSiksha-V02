import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaEye, FaCalendarAlt, FaUserEdit } from 'react-icons/fa';

export default function BlogCard({ blog }) {
    const navigate = useNavigate();

    // Phase 6 logic: NEW Badge if created within last 7 days
    const isNew = () => {
        const publishDate = new Date(blog.createdAt);
        const today = new Date();
        const diffTime = Math.abs(today - publishDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays <= 7;
    };

    return (
        <div 
            onClick={() => navigate(`/blog/${blog._id}`)}
            className="group relative bg-[var(--bg-surface)] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-[var(--border-color)] flex flex-col h-full"
        >
            {/* Phase 6: NEW Watermark Effect */}
            {isNew() && (
                <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-widest animate-pulse">
                    <span className="sparkle">✨</span> NEW
                </div>
            )}

            {/* Thumbnail */}
            <div className="relative h-56 w-full overflow-hidden bg-[var(--bg-main)]">
                        <img 
                            src={blog.thumbnail || 'https://via.placeholder.com/600x400'} 
                            alt={blog.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />           <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <span className="bg-blue-600/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                        {blog.category || 'Education'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-[var(--text-main)] mb-3 line-clamp-2 leading-tight group-hover:text-blue-500 transition-colors">
                    {blog.title}
                </h3>
                <p className="text-[var(--text-muted)] text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                    {blog.content.replace(/<[^>]+>/g, '')} {/* Strip HTML for plain preview */}
                </p>

                {/* Footer Metrics (Phase 3 & 4) */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border-color)]">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold shadow-inner">
                            <FaUserEdit size={12} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[var(--text-main)]">{blog.authorDetails?.name || 'Admin'}</p>
                            <div className="flex items-center text-[10px] text-[var(--text-muted)] gap-1 font-medium tracking-wide">
                                <FaCalendarAlt />
                                {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm font-bold text-[var(--text-muted)]">
                        <div className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                            <FaHeart className={blog.heartsCount > 0 ? "text-red-500" : "opacity-30"} />
                            <span className={blog.heartsCount > 0 ? "text-red-500" : ""}>{blog.heartsCount || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                            <FaEye className="opacity-50" />
                            <span>{blog.views || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
