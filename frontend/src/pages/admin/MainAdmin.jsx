import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../../config';
import { toast } from 'react-toastify';
import { FaFileCsv } from 'react-icons/fa';
import AdminUsers from './AdminUsers';
import AdminCourses from './AdminCourses';
import AdminEnrollments from './AdminEnrollments';
import AdminReviews from './AdminReviews';
import AdminBlogs from './AdminBlogs';
import AdminVolunteerApplications from './AdminVolunteerApplications';
import VolunteerFormBuilder from './VolunteerFormBuilder';
import AboutManager from './AboutManager';
import AdminSettings from './AdminSettings';
import AdminContacts from './AdminContacts';
import HomeManager from './HomeManager';
import TrainerFormBuilder from './TrainerFormBuilder';
import AdminTrainerApplications from './AdminTrainerApplications';
import ManageTrainers from './ManageTrainers';
import { FaUsers, FaUserEdit, FaWrench, FaInbox, FaHandsHelping, FaColumns, FaShieldAlt, FaEnvelopeOpenText, FaHome, FaChalkboardTeacher } from 'react-icons/fa';

export default function MainAdmin() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    // Verify token and fetch initial stats
    useEffect(() => {
        const verifyAdminAndFetchStats = async () => {
            try {
                await axios.get(`${serverUrl}/api/admin/verify`, { withCredentials: true });
                const statsRes = await axios.get(`${serverUrl}/api/admin/stats`, { withCredentials: true });
                setStats(statsRes.data);
            } catch (err) {
                toast.error("Unauthorized Access. Redirecting to Admin Core.");
                navigate("/admin-login");
            }
        };
        verifyAdminAndFetchStats();
    }, [navigate]);

    const handleExportCSV = () => {
        if (!stats) return toast.error("Stats not loaded yet");
        
        const csvContent = `data:text/csv;charset=utf-8,Metric,Value\nTotal Students,${stats.students}\nTotal Trainers,${stats.trainers}\nTotal Courses,${stats.courses}\nTotal Enrollments,${stats.enrollments}\nPlatform Status,${stats.status}`;
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `freesiksha_admin_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("CSV Report Downloaded");
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'students': return <AdminUsers role="student" />;
            case 'trainers': return <ManageTrainers />;
            case 'volunteers': return <AdminUsers role="volunteer" />;
            case 'volunteer-applications': return <AdminVolunteerApplications />;
            case 'volunteer-form': return <VolunteerFormBuilder />;
            case 'trainer-applications': return <AdminTrainerApplications />;
            case 'trainer-form': return <TrainerFormBuilder />;
            case 'courses': return <AdminCourses />;
            case 'enrollments': return <AdminEnrollments />;
            case 'moderation': return <AdminReviews />;
            case 'blogs': return <AdminBlogs userRole="admin" />;
            case 'about': return <AboutManager />;
            case 'settings': return <AdminSettings />;
            case 'contacts': return <AdminContacts />;
            case 'home': return <HomeManager />;
            case 'overview':
            default: return (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                            <h3 className="text-gray-500 font-bold uppercase tracking-wider mb-2 text-xs">Total Students</h3>
                            <p className="text-4xl font-black text-gray-900">{stats?.students || '--'}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                            <h3 className="text-gray-500 font-bold uppercase tracking-wider mb-2 text-xs">Total Trainers</h3>
                            <p className="text-4xl font-black text-gray-900">{stats?.trainers || '--'}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                            <h3 className="text-gray-500 font-bold uppercase tracking-wider mb-2 text-xs">Total Courses</h3>
                            <p className="text-4xl font-black text-gray-900">{stats?.courses || '--'}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                            <h3 className="text-gray-500 font-bold uppercase tracking-wider mb-2 text-xs">Platform Status</h3>
                            <p className="text-4xl font-black text-green-500">{stats?.status || '...'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center lg:col-span-2">
                            <h2 className="text-2xl font-black text-gray-900 mb-4">Welcome to the God Console</h2>
                            <p className="text-gray-500 max-w-sm">
                                All **13 Phases** of the Super Admin architecture are now fully active. You have granular control over Enrollments, Courses, Content, and comprehensive User logs across the entire FreeSiksha Network.
                            </p>
                        </div>
                        <div className="bg-gray-900 rounded-3xl shadow-sm border border-gray-800 p-8 flex flex-col justify-between min-h-[300px]">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-2">Total Enrollments</h2>
                                <p className="text-gray-400 text-sm">Active records across all global courses.</p>
                            </div>
                            <div>
                                <p className="text-6xl font-black text-blue-500 mb-6">{stats?.enrollments || '--'}</p>
                                <button onClick={handleExportCSV} className="w-full flex items-center justify-center gap-2 bg-blue-600 shadow-md hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors">
                                    <FaFileCsv size={20} /> Export System Report
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            );
        }
    };

    const handleLogout = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
            localStorage.removeItem('token');
            localStorage.setItem('auth_event', Date.now());
            toast.success("Admin Session Terminated");
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
            localStorage.removeItem('token');
            navigate("/");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="bg-gray-900 text-white py-4 px-8 flex justify-between items-center shadow-lg">
                <h1 className="text-2xl font-black tracking-widest">FreeSiksha <span className="text-blue-500">SUPER ADMIN</span></h1>
                <div className="flex gap-4">
                    <button 
                        onClick={handleLogout}
                        className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg font-bold transition-all border border-gray-700"
                    >
                        Exit Portal
                    </button>
                </div>
            </header>
            
            <div className="flex flex-1">
                {/* Sidebar Navigation */}
                <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-2">
                    <button 
                        onClick={() => setActiveTab('overview')} 
                        className={`text-left px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'overview' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Dashboard Overview
                    </button>
                    <button 
                        onClick={() => setActiveTab('students')} 
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'students' ? 'bg-blue-50 text-blue-600 shadow-sm border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FaUsers /> Manage Students
                    </button>
                    <button 
                        onClick={() => setActiveTab('trainers')} 
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'trainers' ? 'bg-blue-50 text-blue-600 shadow-sm border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FaUserEdit /> Manage Trainers
                    </button>
                    <button 
                        onClick={() => setActiveTab('volunteers')} 
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'volunteers' ? 'bg-blue-50 text-blue-600 shadow-sm border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FaHandsHelping /> Manage Volunteers
                    </button>
                    <button 
                        onClick={() => setActiveTab('volunteer-applications')} 
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'volunteer-applications' ? 'bg-blue-50 text-blue-600 shadow-sm border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FaInbox /> Volunteer Inbox
                    </button>
                    <button 
                        onClick={() => setActiveTab('volunteer-form')} 
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'volunteer-form' ? 'bg-blue-50 text-blue-600 shadow-sm border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FaWrench /> Volunteer Form
                    </button>
                    <div className="h-px bg-gray-100 my-2"></div>
                    <button 
                        onClick={() => setActiveTab('trainer-applications')} 
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'trainer-applications' ? 'bg-blue-50 text-blue-600 shadow-sm border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FaInbox /> Trainer Applications
                    </button>
                    <button 
                        onClick={() => setActiveTab('trainer-form')} 
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'trainer-form' ? 'bg-blue-50 text-blue-600 shadow-sm border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FaChalkboardTeacher /> Trainer Form Builder
                    </button>
                    <div className="h-px bg-gray-100 my-2"></div>
                    <button 
                        onClick={() => setActiveTab('courses')} 
                        className={`text-left px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'courses' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Manage Courses
                    </button>
                    <button 
                        onClick={() => setActiveTab('blogs')}
                        className={`w-full flex items-center gap-3 px-6 py-4 font-bold transition-all ${activeTab === 'blogs' ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Manage Blogs
                    </button>
                    <button 
                        onClick={() => setActiveTab('enrollments')} 
                        className={`text-left px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'enrollments' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Global Enrollments
                    </button>
                    <button 
                        onClick={() => setActiveTab('moderation')} 
                        className={`text-left px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'moderation' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Content Moderation
                    </button>
                    <div className="h-px bg-gray-100 my-2"></div>
                    <button 
                        onClick={() => setActiveTab('home')} 
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'home' ? 'bg-blue-50 text-blue-600 shadow-sm border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FaHome /> Home Page
                    </button>
                    <button 
                        onClick={() => setActiveTab('about')} 
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'about' ? 'bg-blue-50 text-blue-600 shadow-sm border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FaColumns /> About Sections
                    </button>
                    <button 
                        onClick={() => setActiveTab('contacts')} 
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'contacts' ? 'bg-blue-50 text-blue-600 shadow-sm border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FaEnvelopeOpenText /> Inquiries Inbox
                    </button>
                    <button 
                        onClick={() => setActiveTab('settings')} 
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'settings' ? 'bg-blue-50 text-blue-600 shadow-sm border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <FaShieldAlt /> System Settings
                    </button>
                </aside>

                <main className="flex-1 p-8 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}
