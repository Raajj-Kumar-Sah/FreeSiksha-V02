import React, { Suspense, lazy, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux'

// Lazy Load Pages for performance
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Profile = lazy(() => import('./pages/Profile'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Courses = lazy(() => import('./pages/admin/Courses'));
import JoinModal from './components/JoinModal';
import { setUserData, toggleJoinModal } from './redux/userSlice';
import { useDispatch } from 'react-redux';
const AllCourses = lazy(() => import('./pages/AllCourses'));
const AddCourses = lazy(() => import('./pages/admin/AddCourses'));
const CreateCourse = lazy(() => import('./pages/admin/CreateCourse'));
const CreateLecture = lazy(() => import('./pages/admin/CreateLecture'));
const EditLecture = lazy(() => import('./pages/admin/EditLecture'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const Blogs = lazy(() => import('./pages/Blogs'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const AdminBlogs = lazy(() => import('./pages/admin/AdminBlogs'));
const ViewCourse = lazy(() => import('./pages/ViewCourse'));
const EnrolledCourse = lazy(() => import('./pages/EnrolledCourse'));
const ViewLecture = lazy(() => import('./pages/ViewLecture'));
const SearchWithAi = lazy(() => import('./pages/SearchWithAi'));
const Enrollments = lazy(() => import('./pages/admin/Enrollments'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const MainAdmin = lazy(() => import('./pages/admin/MainAdmin'));
const TrainerRegistration = lazy(() => import('./pages/TrainerRegistration'));
const SetPassword = lazy(() => import('./pages/SetPassword'));

import useGetCurrentUser from './customHooks/useGetCurrentUser'
import useGetCourseData from './customHooks/useGetCourseData'
import useGetCreatorCourseData from './customHooks/useGetCreatorCourseData'
import useGetAllReviews from './customHooks/useGetAllReviews'
import ScrollToTop from './components/ScrollToTop'
import Loader from './components/Loader'

import { HelmetProvider } from 'react-helmet-async';

import { serverUrl } from './config'
export { serverUrl }

// Global Axios Interceptor for Hybrid Auth (Cookie + Header fallback)
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function App() {
  
  let {userData, isLoading} = useSelector(state=>state.user)

  useGetCurrentUser()
  useGetCourseData()
  useGetCreatorCourseData()
  useGetAllReviews()
  
  const dispatch = useDispatch()
  const { isJoinModalOpen } = useSelector(state => state.user)

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'auth_event') {
        dispatch(setUserData(null));
        // Force refresh to clear any cached states if needed, or rely on Redux
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [dispatch]);

  return (
    <HelmetProvider>
      {isLoading && <Loader />}
      <ToastContainer />
      <ScrollToTop/>
      <JoinModal isOpen={isJoinModalOpen} onClose={() => dispatch(toggleJoinModal(false))} />
      <Suspense fallback={<Loader />}>
        {!isLoading && (
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/about' element={<AboutPage/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={!userData?<SignUp/>:<Navigate to={"/"}/>}/>
          <Route path='/register-trainer' element={<TrainerRegistration/>}/>
          <Route path='/set-password/:token' element={<SetPassword/>}/>
          <Route path='/profile' element={userData?<Profile/>:<Navigate to={"/signup"}/>}/>
          <Route path='/allcourses' element={userData?<AllCourses/>:<Navigate to={"/signup"}/>}/>
          <Route path='/viewcourse/:courseId' element={userData?<ViewCourse/>:<Navigate to={"/signup"}/>}/>
          <Route path='/editprofile' element={userData?<EditProfile/>:<Navigate to={"/signup"}/>}/>
          <Route path='/enrolledcourses' element={userData?<EnrolledCourse/>:<Navigate to={"/signup"}/>}/>
          <Route path='/viewlecture/:courseId' element={userData?<ViewLecture/>:<Navigate to={"/signup"}/>}/>
          <Route path='/searchwithai' element={userData?<SearchWithAi/>:<Navigate to={"/signup"}/>}/>
          
          {/* Trainer & Admin Shared Routes */}
          <Route path='/enrollments' element={(userData?.role === "trainer" || userData?.role === "admin")?<Enrollments/>:<Navigate to={"/signup"}/>}/>
          <Route path='/manage-blogs' element={(userData?.role === "trainer" || userData?.role === "admin") ? <AdminBlogs userRole={userData?.role} /> : <Navigate to={"/signup"} />} />
          
          <Route path='/dashboard' element={(userData?.role === "trainer" || userData?.role === "admin")?<Dashboard/>:<Navigate to={"/signup"}/>}/>
          <Route path='/courses' element={(userData?.role === "trainer" || userData?.role === "admin")?<Courses/>:<Navigate to={"/signup"}/>}/>
          <Route path='/addcourses/:courseId' element={(userData?.role === "trainer" || userData?.role === "admin")?<AddCourses/>:<Navigate to={"/signup"}/>}/>
          <Route path='/createcourses' element={(userData?.role === "trainer" || userData?.role === "admin")?<CreateCourse/>:<Navigate to={"/signup"}/>}/>
          <Route path='/createlecture/:courseId' element={(userData?.role === "trainer" || userData?.role === "admin")?<CreateLecture/>:<Navigate to={"/signup"}/>}/>
          <Route path='/editlecture/:courseId/:lectureId' element={(userData?.role === "trainer" || userData?.role === "admin")?<EditLecture/>:<Navigate to={"/signup"}/>}/>
          <Route path='/forgotpassword' element={<ForgotPassword/>}/>
          
          {/* Blog System Routes */}
          <Route path='/blogs' element={<Blogs />} />
          <Route path='/blog/:id' element={<BlogDetail />} />
          
          {/* Main Admin Dedicated Routes */}
          <Route path='/admin-login' element={<AdminLogin />} />
          <Route path='/admin' element={userData?.role === "admin" ? <MainAdmin /> : <Navigate to="/admin-login" />} />
          </Routes>
        )}
      </Suspense>
    </HelmetProvider>
  )
}

export default App
