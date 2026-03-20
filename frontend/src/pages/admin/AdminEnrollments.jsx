import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { FaUserGraduate, FaSignOutAlt } from 'react-icons/fa';

export default function AdminEnrollments() {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${serverUrl}/api/admin/enrollments`, { withCredentials: true });
            setEnrollments(res.data);
        } catch (error) {
            toast.error("Failed to fetch enrollments");
        } finally {
            setLoading(false);
        }
    };

    const handleRevoke = async (courseId, studentId) => {
        if (!window.confirm("Are you sure you want to forcibly remove this student from the course?")) return;
        
        try {
            await axios.delete(`${serverUrl}/api/admin/enrollments/${courseId}/${studentId}`, { withCredentials: true });
            toast.success("Enrollment successfully revoked");
            fetchEnrollments();
        } catch (error) {
            toast.error("Failed to revoke enrollment");
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900">Global Enrollments</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {enrollments.length} Active
                </span>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><ClipLoader color="#3B82F6" /></div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-gray-100 text-gray-500 text-xs uppercase tracking-widest text-left">
                                <th className="p-4 font-bold">Student Name</th>
                                <th className="p-4 font-bold">FS-ID</th>
                                <th className="p-4 font-bold">Enrolled Course</th>
                                <th className="p-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {enrollments.map((record, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold">
                                                <FaUserGraduate />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{record.studentName}</p>
                                                <p className="text-sm text-gray-500">{record.studentEmail}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-xs font-mono font-bold px-2 py-1 rounded border ${record.studentFSID !== 'N/A' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                                            {record.studentFSID}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-bold text-gray-800 text-sm truncate max-w-xs">{record.courseTitle}</p>
                                        <p className="text-xs text-gray-500 mt-1">Course ID: {record.courseId}</p>
                                    </td>
                                    <td className="p-4 flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity items-center min-h-[64px]">
                                        <button onClick={() => handleRevoke(record.courseId, record.studentId)} title="Force Revoke Access" className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-2 border border-red-100">
                                            <FaSignOutAlt /> REVOKE
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {enrollments.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center p-8 text-gray-500 font-medium">No enrollments found across any courses</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
