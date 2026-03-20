import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { FaBookOpen, FaCheckCircle, FaTimesCircle, FaTrash } from 'react-icons/fa';

export default function AdminCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${serverUrl}/api/admin/courses`, { withCredentials: true });
            setCourses(res.data);
        } catch (error) {
            toast.error("Failed to fetch courses");
        } finally {
            setLoading(false);
        }
    };

    const handleApprovalToggle = async (courseId, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            await axios.put(`${serverUrl}/api/admin/courses/${courseId}/status`, 
                { isPublished: newStatus }, 
                { withCredentials: true }
            );
            toast.success(newStatus ? "Course Approved & Published" : "Course Un-Published");
            fetchCourses();
        } catch (error) {
            toast.error("Status update failed");
        }
    };

    const handleDelete = async (courseId) => {
        if (!window.confirm("Are you sure you want to permanently delete this course and all its resources?")) return;
        
        try {
            await axios.delete(`${serverUrl}/api/admin/courses/${courseId}`, { withCredentials: true });
            toast.success("Course permanently deleted");
            fetchCourses();
        } catch (error) {
            toast.error("Deletion failed");
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900">Course Administration</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {courses.length} Courses
                </span>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><ClipLoader color="#3B82F6" /></div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-gray-100 text-gray-500 text-xs uppercase tracking-widest text-left">
                                <th className="p-4 font-bold">Course Details</th>
                                <th className="p-4 font-bold">Creator</th>
                                <th className="p-4 font-bold">Category</th>
                                <th className="p-4 font-bold">System ID</th>
                                <th className="p-4 font-bold">Status</th>
                                <th className="p-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {courses.map(course => (
                                <tr key={course._id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-4">
                                            {course.thumbnail ? (
                                                <img src={course.thumbnail} alt={course.title} className="w-16 h-12 rounded-lg object-cover bg-gray-200" />
                                            ) : (
                                                <div className="w-16 h-12 rounded-lg bg-blue-50 text-blue-400 flex items-center justify-center">
                                                    <FaBookOpen />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-gray-900 truncate max-w-[200px]">{course.title}</p>
                                                <p className="text-xs text-gray-500 font-medium">₹{course.price || 'Free'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-bold text-gray-800 text-sm">{course.creator?.name || 'Unknown'}</p>
                                        <p className="text-xs text-gray-500">{course.creator?.email || 'N/A'}</p>
                                    </td>
                                    <td className="p-4 text-sm font-medium text-gray-600">
                                        {course.category}
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-xs font-mono font-bold px-2 py-1 rounded border ${course.courseUniqueId ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                                            {course.courseUniqueId || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide
                                            ${course.isPublished ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}
                                        `}>
                                            {course.isPublished ? 'Published' : 'Pending Review'}
                                        </span>
                                    </td>
                                    <td className="p-4 flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity items-center min-h-[64px]">
                                        {course.isPublished ? (
                                            <button onClick={() => handleApprovalToggle(course._id, true)} title="Unpublish / Reject" className="p-2 text-orange-500 hover:bg-orange-100 rounded-lg transition-colors">
                                                <FaTimesCircle />
                                            </button>
                                        ) : (
                                            <button onClick={() => handleApprovalToggle(course._id, false)} title="Approve & Publish" className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                                                <FaCheckCircle />
                                            </button>
                                        )}
                                        <button onClick={() => handleDelete(course._id)} title="Perm Delete" className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2">
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {courses.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center p-8 text-gray-500 font-medium">No courses found in the system</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
