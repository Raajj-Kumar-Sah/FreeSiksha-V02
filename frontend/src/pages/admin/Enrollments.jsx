import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Nav from '../../components/Nav';
import { serverUrl } from '../../App';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { ClipLoader } from 'react-spinners';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { FaSearch, FaPlus, FaTimes } from 'react-icons/fa';

function Enrollments() {
  const { userData } = useSelector(state => state.user);
  
  const [educatorCourses, setEducatorCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualForm, setManualForm] = useState({
      name: '', email: '', phone: '', age: '', city: '', qualification: '', gender: ''
  });
  const [manualLoading, setManualLoading] = useState(false);

  const filteredEnrolledStudents = enrolledStudents.filter(student => 
      (student.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.phone?.includes(searchTerm)) ||
      (student.studentId?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Fetch ALL educator courses (including unpublished) directly from API
  useEffect(() => {
    const fetchEducatorCourses = async () => {
      setCoursesLoading(true);
      try {
        const { data } = await axios.get(`${serverUrl}/api/course/getcreatorcourses`, { withCredentials: true });
        setEducatorCourses(data);
        if (data.length > 0 && !selectedCourse) {
          setSelectedCourse(data[0]._id);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load your courses");
      } finally {
        setCoursesLoading(false);
      }
    };
    if (userData?._id) fetchEducatorCourses();
  }, [userData]);

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

  const fetchAnalytics = async () => {
    if (!selectedCourse) return;
    try {
      const { data } = await axios.get(`${serverUrl}/api/course/${selectedCourse}/analytics`, { withCredentials: true });
      setAnalytics(data);
    } catch (error) {
       console.error("Failed to load analytics", error);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchAnalytics();
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

  const handleManualEnroll = async (e) => {
      e.preventDefault();
      setManualLoading(true);
      try {
          await axios.post(`${serverUrl}/api/course/${selectedCourse}/manual-enroll`, manualForm, { withCredentials: true });
          toast.success("Student successfully added and enrolled!");
          setShowManualModal(false);
          setManualForm({ name: '', email: '', phone: '', age: '', city: '', qualification: '', gender: '' });
          fetchStudents(); // Refresh tables and charts
          fetchAnalytics();
      } catch (error) {
          toast.error(error.response?.data?.message || "Failed to manually enroll student");
      } finally {
          setManualLoading(false);
      }
  };

// ... inside the table rendering logic for Active Students...
// But wait, it's easier to inject inside the component instead of replacing 150 lines. Let me just replace the whole Active Students table structure.
// Note to self: The tool replaces precisely what I input. I will replace the block from the Active students table header down to its closing tag.


  const exportToCSV = () => {
      const courseObj = educatorCourses.find(c => c._id === selectedCourse);
      const uniqueId = courseObj?.courseUniqueId || 'N/A';
      const deadline = courseObj?.registrationDeadline ? new Date(courseObj.registrationDeadline).toLocaleDateString() : 'None';
      
      const csvData = [
          [`Course: ${courseObj?.title || 'Unknown'}`, `ID: ${uniqueId}`, `Deadline: ${deadline}`],
          [],
          ["FS-ID", "Name", "Email", "Phone", "Age", "City", "Qualification", "Gender", "Status", "Date"],
          ...pendingStudents.map(s => [s.studentId || '-', s.name, s.email, s.phone || '-', s.age || '-', s.city || '-', s.qualification || '-', s.gender || '-', "Pending", new Date(s.createdAt).toLocaleDateString()]),
          ...enrolledStudents.map(s => [s.studentId || '-', s.name, s.email, s.phone || '-', s.age || '-', s.city || '-', s.qualification || '-', s.gender || '-', "Enrolled", new Date(s.createdAt).toLocaleDateString()])
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
      const uniqueId = courseObj?.courseUniqueId || 'N/A';
      const deadline = courseObj?.registrationDeadline ? new Date(courseObj.registrationDeadline).toLocaleDateString() : 'None';
      
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(`Student Enrollments: ${courseObj?.title || 'Course'}`, 14, 15);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Course ID: ${uniqueId} | Registration Deadline: ${deadline}`, 14, 22);
      
      const tableData = [
          ...pendingStudents.map(s => [s.studentId || '-', s.name, s.email, s.phone || '-', s.age || '-', s.city || '-', s.qualification || '-', "Pending", new Date(s.createdAt).toLocaleDateString()]),
          ...enrolledStudents.map(s => [s.studentId || '-', s.name, s.email, s.phone || '-', s.age || '-', s.city || '-', s.qualification || '-', "Enrolled", new Date(s.createdAt).toLocaleDateString()])
      ];
      doc.autoTable({
          startY: 28,
          head: [['FS-ID', 'Name', 'Email', 'Phone', 'Age', 'City', 'Qualification', 'Status', 'Date']],
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
                    {/* Analytics Section */}
                    {analytics && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Daily Growth Line Chart */}
                        <div className="bg-[var(--bg-surface)] p-6 rounded-[24px] border border-[var(--border-color)] shadow-sm">
                          <h3 className="text-lg font-black text-[var(--text-main)] mb-6">Enrollment Trend</h3>
                          <div className="h-64">
                            {analytics.enrollmentTrends?.length > 0 ? (
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={analytics.enrollmentTrends}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
                                  <YAxis stroke="var(--text-muted)" fontSize={12} axisLine={false} tickLine={false} allowDecimals={false} />
                                  <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', fontWeight: 'bold' }} />
                                  <Line type="monotone" dataKey="students" name="Students" stroke="#2563eb" strokeWidth={4} dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: 'var(--bg-surface)' }} activeDot={{ r: 6 }} />
                                </LineChart>
                              </ResponsiveContainer>
                            ) : (
                              <div className="h-full flex items-center justify-center text-[var(--text-muted)] text-sm font-medium border-2 border-dashed border-[var(--border-color)] rounded-xl">No trend data available</div>
                            )}
                          </div>
                        </div>

                        {/* Gender/Demographics Bar Chart */}
                        <div className="bg-[var(--bg-surface)] p-6 rounded-[24px] border border-[var(--border-color)] shadow-sm">
                          <h3 className="text-lg font-black text-[var(--text-main)] mb-6">Demographics (Gender)</h3>
                          <div className="h-64">
                            {analytics.genderStats?.length > 0 ? (
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analytics.genderStats}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
                                  <YAxis stroke="var(--text-muted)" fontSize={12} axisLine={false} tickLine={false} allowDecimals={false} />
                                  <Tooltip cursor={{ fill: 'var(--bg-main)' }} contentStyle={{ borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', fontWeight: 'bold' }} />
                                  <Bar dataKey="value" name="Students" fill="#10b981" radius={[8, 8, 0, 0]} barSize={48} />
                                </BarChart>
                              </ResponsiveContainer>
                            ) : (
                              <div className="h-full flex items-center justify-center text-[var(--text-muted)] text-sm font-medium border-2 border-dashed border-[var(--border-color)] rounded-xl">No demographic data available</div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

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
                                        <th className="px-6 py-4">FS-ID</th>
                                        <th className="px-6 py-4">Student Name</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Phone</th>
                                        <th className="px-6 py-4">Age</th>
                                        <th className="px-6 py-4">City</th>
                                        <th className="px-6 py-4">Qualification</th>
                                        <th className="px-6 py-4">Gender</th>
                                        <th className="px-6 py-4">Request Date</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingStudents.length === 0 ? (
                                        <tr><td colSpan="9" className="px-6 py-8 text-center text-[var(--text-muted)] font-medium">No pending requests at the moment.</td></tr>
                                    ) : (
                                        pendingStudents.map(student => (
                                            <tr key={student._id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-main)]/50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">{student.studentId || <span className="opacity-40">—</span>}</td>
                                                <td className="px-6 py-4 font-bold text-[var(--text-main)]">{student.name}</td>
                                                <td className="px-6 py-4 text-[var(--text-muted)] text-sm">{student.email}</td>
                                                <td className="px-6 py-4 text-[var(--text-muted)] text-sm">{student.phone || <span className="opacity-40">—</span>}</td>
                                                <td className="px-6 py-4 text-[var(--text-muted)] text-sm">{student.age || <span className="opacity-40">—</span>}</td>
                                                <td className="px-6 py-4 text-[var(--text-muted)] text-sm">{student.city || <span className="opacity-40">—</span>}</td>
                                                <td className="px-6 py-4 text-[var(--text-muted)] text-sm">{student.qualification || <span className="opacity-40">—</span>}</td>
                                                <td className="px-6 py-4 text-[var(--text-muted)] text-sm">{student.gender || <span className="opacity-40">—</span>}</td>
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
                        <div className="px-6 py-5 border-b border-[var(--border-color)] flex flex-wrap justify-between items-center gap-4">
                            <div className="flex items-center gap-3">
                                <h2 className="text-lg font-bold text-[var(--text-main)]">Active Students</h2>
                                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">{filteredEnrolledStudents.length}</span>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <div className="relative flex-1 sm:w-64">
                                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--border-color)]" />
                                    <input 
                                        type="text" 
                                        placeholder="Search name, phone, email..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                                    />
                                </div>
                                <button 
                                    onClick={() => setShowManualModal(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-colors shadow-md flex-shrink-0"
                                    title="Manually Add Student"
                                >
                                    <FaPlus />
                                </button>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[var(--bg-main)] text-[var(--text-muted)] text-xs uppercase font-bold">
                                    <tr>
                                        <th className="px-6 py-4">FS-ID</th>
                                        <th className="px-6 py-4">Student Name</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Phone</th>
                                        <th className="px-6 py-4">Age</th>
                                        <th className="px-6 py-4">City</th>
                                        <th className="px-6 py-4">Qualification</th>
                                        <th className="px-6 py-4">Gender</th>
                                        <th className="px-6 py-4">Enroll Date</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEnrolledStudents.length === 0 ? (
                                        <tr><td colSpan="9" className="px-6 py-8 text-center text-[var(--text-muted)] font-medium">No active students found.</td></tr>
                                    ) : (
                                        filteredEnrolledStudents.map(student => (
                                            <tr key={student._id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-main)]/50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">{student.studentId || <span className="opacity-40">—</span>}</td>
                                                <td className="px-6 py-4 font-bold text-[var(--text-main)]">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xs uppercase flex-shrink-0">{student.name?.charAt(0)}</div>
                                                        {student.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-[var(--text-muted)] text-sm">{student.email}</td>
                                                <td className="px-6 py-4 text-[var(--text-muted)] text-sm">{student.phone || <span className="opacity-40">—</span>}</td>
                                                <td className="px-6 py-4 text-[var(--text-muted)] text-sm">{student.age || <span className="opacity-40">—</span>}</td>
                                                <td className="px-6 py-4 text-[var(--text-muted)] text-sm">{student.city || <span className="opacity-40">—</span>}</td>
                                                <td className="px-6 py-4 text-[var(--text-muted)] text-sm">{student.qualification || <span className="opacity-40">—</span>}</td>
                                                <td className="px-6 py-4 text-[var(--text-muted)] text-sm">{student.gender || <span className="opacity-40">—</span>}</td>
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

      {/* Manual Enroll Modal */}
      {showManualModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] w-full max-w-lg rounded-3xl shadow-2xl border border-[var(--border-color)] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between bg-blue-50/50 dark:bg-blue-900/10">
              <div>
                <h3 className="text-xl font-black text-[var(--text-main)]">Manual Enrollment</h3>
                <p className="text-sm text-[var(--text-muted)] mt-1">Add a student directly to this course.</p>
              </div>
              <button 
                onClick={() => setShowManualModal(false)} 
                className="w-8 h-8 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:border-red-200 transition-colors"
               >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleManualEnroll} className="p-6 overflow-y-auto flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input required type="text" placeholder="Full Name" value={manualForm.name} onChange={e=>setManualForm({...manualForm, name: e.target.value})} className="col-span-2 w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-main)] focus:ring-2 focus:ring-blue-100 transition-all font-medium" />
                    <input required type="email" placeholder="Email Address" value={manualForm.email} onChange={e=>setManualForm({...manualForm, email: e.target.value})} className="col-span-2 w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-main)] focus:ring-2 focus:ring-blue-100 transition-all font-medium" />
                    <input required type="text" placeholder="Phone Number" value={manualForm.phone} onChange={e=>setManualForm({...manualForm, phone: e.target.value})} className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-main)] focus:ring-2 focus:ring-blue-100 transition-all font-medium" />
                    <input required type="number" placeholder="Age" value={manualForm.age} onChange={e=>setManualForm({...manualForm, age: e.target.value})} className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-main)] focus:ring-2 focus:ring-blue-100 transition-all font-medium" />
                    <input required type="text" placeholder="City" value={manualForm.city} onChange={e=>setManualForm({...manualForm, city: e.target.value})} className="col-span-2 md:col-span-1 w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-main)] focus:ring-2 focus:ring-blue-100 transition-all font-medium" />
                    <input required type="text" placeholder="Qualification" value={manualForm.qualification} onChange={e=>setManualForm({...manualForm, qualification: e.target.value})} className="col-span-2 md:col-span-1 w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-main)] focus:ring-2 focus:ring-blue-100 transition-all font-medium" />
                    <select required value={manualForm.gender} onChange={e=>setManualForm({...manualForm, gender: e.target.value})} className="col-span-2 w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-main)] focus:ring-2 focus:ring-blue-100 transition-all font-medium appearance-none">
                        <option value="">Select Gender...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="pt-6 flex justify-end gap-4 mt-2">
                   <button type="button" onClick={() => setShowManualModal(false)} className="px-6 py-3 rounded-xl font-bold bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-color)] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancel</button>
                   <button type="submit" disabled={manualLoading} className="btn-primary px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50">{manualLoading ? "Saving..." : "Enroll Student"}</button>
                </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Enrollments;
