import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { FaCommentSlash, FaStar } from 'react-icons/fa';

export default function AdminReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${serverUrl}/api/admin/reviews`, { withCredentials: true });
            setReviews(res.data);
        } catch (error) {
            toast.error("Failed to fetch reviews");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm("Are you sure you want to permanently delete this content?")) return;
        
        try {
            await axios.delete(`${serverUrl}/api/admin/reviews/${reviewId}`, { withCredentials: true });
            toast.success("Review permanently deleted");
            fetchReviews();
        } catch (error) {
            toast.error("Deletion failed");
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900">Content Moderation</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {reviews.length} Feedbacks
                </span>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><ClipLoader color="#3B82F6" /></div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-gray-100 text-gray-500 text-xs uppercase tracking-widest text-left">
                                <th className="p-4 font-bold">Reviewer</th>
                                <th className="p-4 font-bold">Course</th>
                                <th className="p-4 font-bold">Feedback / Rating</th>
                                <th className="p-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {reviews.map((r, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors group">
                                    <td className="p-4">
                                        <p className="font-bold text-gray-900">{r.user?.name || 'Unknown User'}</p>
                                        <p className="text-xs text-gray-500">{r.user?.email}</p>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-sm font-medium text-gray-800">{r.course?.title || 'Unknown Course'}</p>
                                    </td>
                                    <td className="p-4 max-w-sm">
                                        <div className="flex items-center text-yellow-400 mb-1 text-xs">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} className={i < r.rating ? 'text-yellow-400' : 'text-gray-300'} />
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-600 truncate">{r.comment || 'No written comment'}</p>
                                    </td>
                                    <td className="p-4 flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleDelete(r._id)} title="Delete Content" className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors">
                                            <FaCommentSlash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {reviews.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center p-8 text-gray-500 font-medium">No reviews require moderation</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
