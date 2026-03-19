import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Nav from '../../components/Nav';
import { serverUrl } from '../../App';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { ClipLoader } from 'react-spinners';

function Enrollments() {
  const { userData } = useSelector(state => state.user);
  const { courseData } = useSelector(state => state.course); // from our global fetch hook
  
  const [educatorCourses, setEducatorCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Filter courses created by the educator
  useEffect(() => {
    if (userData?._id && courseData?.length > 0) {
      const myCourses = courseData.filter(c => c.creator === userData._id);
      setEducatorCourses(myCourses);
      if (myCourses.length > 0 && !selectedCourse) {
        setSelectedCourse(myCourses[0]._id);
      }
    }
  }, [userData, courseData]);

  // Fetch students for the selected course
  const fetchStudents = async () => {
    if (!selectedCourse) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${serverUrl}/api/course/${selectedCourse}/students`, { withCredentials: true });
      setEnrolledStudents(data.enrolled || []);
      setPendingStudents(data.pending || []);
    } catch (error) {
       console.error(error);
       toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedCourse]);

  const handleApprove = async (studentId) => {
      setActionLoading(studentId);
      try {
          await axios.post(`${serverUrl}/api/course/${selectedCourse}/approve/${studentId}`, {}, { withCredentials: true });
          toast.success("Student approved successfully!");
          fetchStudents();
      } catch (error) {
          toast.error("Failed to approve student");
      } finally {
          setActionLoading(null);
      }
  };

  const handleReject = async (studentId) => {
      setActionLoading(studentId);
      try {
          await axios.post(`${serverUrl}/api/course/${selectedCourse}/reject/${studentId}`, {}, { withCredentials: true });
          toast.success("Student request rejected.");
          fetchStudents();
      } catch (error) {
           toast.error("Failed to reject student");
      } finally {
           setActionLoading(null);
      }
  };

  const handleRemove = async (studentId) => {
      if (!window.confirm("Are you sure you want to forcibly remove this student from the course?")) return;
      setActionLoading(studentId);
      try {
          await axios.post(`${serverUrl}/api/course/${selectedCourse}/removestudent/${studentId}`, {}, { withCredentials: true });
          toast.success("Student has been removed from the course.");
          fetchStudents();
      } catch (error) {
           toast.error("Failed to remove student");
      } finally {
           setActionLoading(null);
      }
  };

// ... inside the table rendering logic for Active Students...
// But wait, it's easier to inject inside the component instead of replacing 150 lines. Let me just replace the whole Active Students table structure.
// Note to self: The tool replaces precisely what I input. I will replace the block from the Active students table header down to its closing tag.


  // Export Utilities
  const exportToCSV = () => {
      const courseObj = educatorCourses.find(c => c._id === selectedCourse);
      const csvData = [
          ["Name", "Email", "Status", "Request Date"],
          ...pendingStudents.map(s => [s.name, s.email, "Pending", new Date(s.createdAt).toLocaleDateString()]),
          ...enrolledStudents.map(s => [s.name, s.email, "Enrolled", new Date(s.createdAt).toLocaleDateString()])
      ];
      
      const csvContent = csvData.map(e => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Course_Enrollments_${courseObj?.title || 'Report'}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const exportToPDF = () => {
      const courseObj = educatorCourses.find(c => c._id === selectedCourse);
      const doc = new jsPDF();
      doc.text(`Student Enrollments: ${courseObj?.title || 'Course'}`, 14, 15);
      
      const tableData = [
          ...pendingStudents.map(s => [s.name, s.email, "Pending", new Date(s.createdAt).toLocaleDateString()]),
          ...enrolledStudents.map(s => [s.name, s.email, "Enrolled", new Date(s.createdAt).toLocaleDateString()])
      ];

      doc.autoTable({
          startY: 25,
          head: [['Name', 'Email', 'Status', 'Request Date']],
          body: tableData,
      });

      doc.save(`Course_Enrollments_${courseObj?.title || 'Report'}.pdf`);
  };


  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)]">
        <Nav />
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 mt-[72px]">
            
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                     <h1 className="text-3xl font-black text-[var(--text-main)] mb-2">Manage Enrollments</h1>
                     <p className="text-[var(--text-muted)] font-medium">Review student requests and export participant lists.</p>
                </div>
                
                {educatorCourses.length > 0 && selectedCourse && (
                    <div className="flex flex-col sm:flex-row gap-3">
                        <select 
                            className="bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none font-medium min-w-[250px]"
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                        >
                            {educatorCourses.map(course => (
                                <option key={course._id} value={course._id}>{course.title}</option>
                            ))}
                        </select>
                        <button onClick={exportToCSV} className="px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:border-blue-300 transition-all rounded-xl font-bold flex flex-1 sm:flex-none items-center justify-center gap-2 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Export CSV
                        </button>
                        <button onClick={exportToPDF} className="px-4 py-3 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all rounded-xl font-bold flex flex-1 sm:flex-none items-center justify-center gap-2 shadow-sm">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            Export PDF
                        </button>
                    </div>
                )}
            </div>

            {educatorCourses.length === 0 ? (
                <div className="bg-[var(--bg-surface)] rounded-3xl p-12 text-center border border-[var(--border-color)]">
                    <h3 className="text-xl font-bold text-[var(--text-main)]">No Courses Found</h3>
                    <p className="text-[var(--text-muted)] mt-2">Create a course before you can manage enrollments.</p>
                </div>
            ) : loading ? (
                 <div className="flex items-center justify-center py-20">
                    <ClipLoader size={40} color="var(--primary)" />
                 </div>
            ) : (
                <div className="space-y-8">
                    {/* Pending Approvals Table */}
                    <div className="bg-[var(--bg-surface)] rounded-[24px] shadow-sm border border-[var(--border-color)] overflow-hidden">
                        <div className="px-6 py-5 border-b border-[var(--border-color)] bg-blue-50/50 dark:bg-blue-900/10 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-[var(--text-main)]">Pending Requests</h2>
                            <span className="bg-blue-100 text-blue-700 dark:bg-blue-600 dark:text-white px-3 py-1 rounded-full text-xs font-bold">{pendingStudents.length}</span>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[var(--bg-main)] text-[var(--text-muted)] text-xs uppercase font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Student Name</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Request Date</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingStudents.length === 0 ? (
                                        <tr><td colSpan="4" className="px-6 py-8 text-center text-[var(--text-muted)] font-medium">No pending requests at the moment.</td></tr>
                                    ) : (
                                        pendingStudents.map(student => (
                                            <tr key={student._id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-main)]/50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-[var(--text-main)]">{student.name}</td>
                                                <td className="px-6 py-4 text-[var(--text-muted)] text-sm">{student.email}</td>
                                                <td className="px-6 py-4 text-[var(--text-muted)] text-sm">{new Date(student.createdAt).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            disabled={actionLoading === student._id}
                                                            onClick={() => handleApprove(student._id)} 
                                                            className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                                                        >
                                                            {actionLoading === student._id ? "..." : "Approve"}
                                                        </button>
                                                        <button 
                                                            disabled={actionLoading === student._id}
                                                            onClick={() => handleReject(student._id)} 
                                                            className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                                                        >
                                                            {actionLoading === student._id ? "..." : "Reject"}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Enrolled Students Table */}
                    <div className="bg-[var(--bg-surface)] rounded-[24px] shadow-sm border border-[var(--border-color)] overflow-hidden">
                        <div className="px-6 py-5 border-b border-[var(--border-color)] flex justify-between items-center">
                            <h2 className="text-lg font-bold text-[var(--text-main)]">Active Students</h2>
                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">{enrolledStudents.length}</span>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[var(--bg-main)] text-[var(--text-muted)] text-xs uppercase font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Student Name</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Enroll Date</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {enrolledStudents.length === 0 ? (
                                        <tr><td colSpan="4" className="px-6 py-8 text-center text-[var(--text-muted)] font-medium">No active students in this course yet.</td></tr>
                                    ) : (
                                        enrolledStudents.map(student => (
                                            <tr key={student._id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-main)]/50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-[var(--text-main)] flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-xs uppercase">{student.name.charAt(0)}</div>
                                                    {student.name}
                                                </td>
                                                <td className="px-6 py-4 text-[var(--text-muted)] text-sm">{student.email}</td>
                                                <td className="px-6 py-4 text-[var(--text-muted)] text-sm">{new Date(student.createdAt).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        disabled={actionLoading === student._id}
                                                        onClick={() => handleRemove(student._id)} 
                                                        className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                                                    >
                                                        {actionLoading === student._id ? "..." : "Remove"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            )}
        </div>
    </div>
  );
}

export default Enrollments;
