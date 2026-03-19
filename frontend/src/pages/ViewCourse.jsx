import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../App';
import { FaArrowLeftLong } from "react-icons/fa6";
import img from "../assets/empty.jpg"
import Card from "../components/Card.jsx"
import { setSelectedCourseData } from '../redux/courseSlice';
import { FaLock, FaPlayCircle } from "react-icons/fa";
import { toast } from 'react-toastify';
import { FaStar } from "react-icons/fa6";
import Nav from '../components/Nav';
import { setUserData } from '../redux/userSlice';


function ViewCourse() {

      const { courseId } = useParams();
      const navigate = useNavigate()
    const {courseData} = useSelector(state=>state.course)
    const {userData} = useSelector(state=>state.user)
    const [creatorData , setCreatorData] = useState(null)
    const dispatch = useDispatch()
    const [selectedLecture, setSelectedLecture] = useState(null);
    const {lectureData} = useSelector(state=>state.lecture)
    const {selectedCourseData} = useSelector(state=>state.course)
  const [selectedCreatorCourse,setSelectedCreatorCourse] = useState([])
   const [isEnrolled, setIsEnrolled] = useState(false);
   const [rating, setRating] = useState(0);
   const [comment, setComment] = useState("");
   
   
  


  const handleReview = async () => {
    try {
      const result = await axios.post(serverUrl + "/api/review/givereview" , {rating , comment , courseId} , {withCredentials:true})
      toast.success("Review Added")
      console.log(result.data)
      setRating(0)
      setComment("")

    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }
  

  const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return (total / reviews.length).toFixed(1); // rounded to 1 decimal
};

// Usage:
const avgRating = calculateAverageRating(selectedCourseData?.reviews);
console.log("Average Rating:", avgRating);

  

  const fetchCourseData = async () => {
    courseData.map((item) => {
      if (item._id === courseId) {
      dispatch(setSelectedCourseData(item))
        console.log(selectedCourseData)
      

        return null;
      }

    })

  }
    const checkEnrollment = () => {
  const verify = userData?.enrolledCourses?.some(c => {
    const enrolledId = typeof c === 'string' ? c : c._id;
    return enrolledId?.toString() === courseId?.toString();
  });

  console.log("Enrollment verified:", verify);
  if (verify) {
    setIsEnrolled(true);
  }
};
  useEffect(() => {
    fetchCourseData()
    checkEnrollment()
  }, [courseId,courseData,lectureData])


    // Fetch creator info once course data is available
  useEffect(() => {
    const getCreator = async () => {
      if (selectedCourseData?.creator) {
        try {
          const result = await axios.post(
            `${serverUrl}/api/course/getcreator`,
            { userId: selectedCourseData.creator },
            { withCredentials: true }
          );
          setCreatorData(result.data);
          console.log(result.data)
        } catch (error) {
          console.error("Error fetching creator:", error);
        }
      }
    };

    getCreator();

    
  }, [selectedCourseData]);


   


  useEffect(() => {
  if (creatorData?._id && courseData.length > 0) {
    const creatorCourses = courseData.filter(
      (course) =>
        course.creator === creatorData._id && course._id !== courseId // Exclude current course
    );
    setSelectedCreatorCourse(creatorCourses);
  
  }
}, [creatorData, courseData]);

 
const handleEnroll = async (courseId, userId) => {
  try {
    const response = await axios.post(`${serverUrl}/api/course/enroll/${courseId}`, {}, { withCredentials: true });
    
    // Update local redux state to reflect the new pending request immediately
    const updatedUser = {
      ...userData,
      pendingCourses: [...(userData.pendingCourses || []), courseId]
    };
    dispatch(setUserData(updatedUser));
    
    toast.success(response.data.message || "Enrollment requested successfully!");

  } catch (err) {
    toast.error(err.response?.data?.message || "Something went wrong while enrolling.");
    console.error("Enroll Error:", err);
  }
};

const [cancelLoading, setCancelLoading] = useState(false);

const handleCancelRequest = async () => {
  if (!window.confirm("Cancel your enrollment request? You can re-apply at any time.")) return;
  setCancelLoading(true);
  try {
    await axios.post(`${serverUrl}/api/course/${courseId}/unenroll`, {}, { withCredentials: true });
    // Remove courseId from pending list in Redux
    const updatedUser = {
      ...userData,
      pendingCourses: (userData.pendingCourses || []).filter(id => {
        const pendingId = typeof id === 'string' ? id : id._id;
        return pendingId?.toString() !== courseId?.toString();
      })
    };
    dispatch(setUserData(updatedUser));
    toast.success("Enrollment request cancelled. You can re-apply anytime!");
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to cancel request.");
    console.error("Cancel Error:", err);
  } finally {
    setCancelLoading(false);
  }
};

  return (
     <div className="min-h-screen bg-[var(--bg-main)] p-6">
      <Nav />
      <div className="max-w-6xl mx-auto bg-[var(--bg-surface)] shadow-md border border-[var(--border-color)] rounded-xl p-6 mt-[72px] space-y-6 relative">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row gap-8">
             
          {/* Thumbnail */}
          <div className="w-full md:w-1/2">
             <div className="flex items-center gap-2 mb-4 group cursor-pointer w-fit" onClick={()=>navigate(-1)}>
               <FaArrowLeftLong className='text-[var(--text-main)] group-hover:-translate-x-1 transition-transform' />
               <span className="text-sm font-medium text-[var(--text-main)]">Back</span>
             </div>
            {selectedCourseData?.thumbnail ? <img
              src={selectedCourseData?.thumbnail}
              alt="Course Thumbnail"
              className="rounded-xl w-full aspect-video object-cover shadow-sm"
            /> :  <img
              src={img}
              alt="Course Thumbnail"
              className="rounded-xl w-full aspect-video object-cover shadow-sm"
            /> }
          </div>

          {/* Course Info */}
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-xs font-bold tracking-wider uppercase">
              {selectedCourseData?.category}
            </div>
            <h1 className="text-3xl font-extrabold text-[var(--text-main)] leading-tight">{selectedCourseData?.title}</h1>
            <p className="text-[var(--text-muted)] text-lg leading-relaxed">{selectedCourseData?.subTitle}</p>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="text-yellow-500 font-bold text-lg">★ {avgRating}</span>
                <span className="text-[var(--text-muted)] text-sm">(1.2k+ reviews)</span>
              </div>
              <div className="h-4 w-px bg-[var(--border-color)]"></div>
              <span className="text-[var(--text-muted)] text-sm">Enrolled by 5k+ students</span>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-[var(--border-color)]">
              <div className="flex items-center gap-2 text-sm text-[var(--text-main)]">
                <span className="text-blue-600 font-bold">✓</span> 10+ hours de video
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--text-main)]">
                <span className="text-blue-600 font-bold">✓</span> Lifetime access
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--text-main)]">
                <span className="text-blue-600 font-bold">✓</span> Certificate included
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--text-main)]">
                <span className="text-blue-600 font-bold">✓</span> Project-based learning
              </div>
            </div>

            {/* Enroll / Watch / Join Buttons */}
            <div className="flex flex-wrap gap-4 mt-6">
              {!isEnrolled && !userData?.pendingCourses?.includes(courseId) ? (
                <button 
                  className="btn-primary flex-1 min-w-[200px] py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20" 
                  onClick={() => handleEnroll(courseId, userData._id)}
                >
                  Request to Join
                </button>
               ) : !isEnrolled && userData?.pendingCourses?.some(id => (typeof id === 'string' ? id : id._id)?.toString() === courseId?.toString()) ? (
                 <button 
                  className="flex-1 min-w-[200px] py-4 rounded-xl font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-all flex items-center justify-center gap-2" 
                  onClick={handleCancelRequest}
                  disabled={cancelLoading}
                >
                  {cancelLoading ? (
                    <>⏳ Cancelling...</>
                  ) : (
                    <>⏳ Pending Approval &mdash; <span className="underline text-sm">Click to Cancel</span></>
                  )}
                </button>
              ) : (
                <>
                  <button 
                    className="flex-1 min-w-[140px] bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all" 
                    onClick={() => navigate(`/viewlecture/${courseId}`)}
                  >
                    Watch Now
                  </button>
                  
                  {selectedCourseData?.zoomLink && (
                    <button 
                      className="flex-1 min-w-[140px] bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                      onClick={() => window.open(selectedCourseData.zoomLink, "_blank")}
                    >
                      <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                      Join Live Class
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* tabs / details grid */}
        <div className="grid lg:grid-cols-3 gap-8 mt-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-main)] mb-4">What You’ll Learn</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {['Industry standards', 'Best practices', 'Advanced patterns', 'Real-world projects'].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)]">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span className="text-[var(--text-main)] font-medium">Learn {selectedCourseData?.category} {item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-[var(--text-main)]">Course Description</h2>
              <p className="text-[var(--text-muted)] leading-relaxed">
                This comprehensive course in {selectedCourseData?.category} is designed to take you from a complete beginner to an industry-ready professional. 
                With project-based assignments and expert-led tutorials, you will gain hands-on experience and deep theoretical knowledge.
              </p>
            </section>

            <section className="pt-8 border-t border-[var(--border-color)]">
              <h2 className="text-2xl font-bold text-[var(--text-main)] mb-6">Write a Review</h2>
              <div className="bg-[var(--bg-main)] p-8 rounded-[32px] border border-[var(--border-color)]">
                <div className="flex gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar  
                      key={star}
                      onClick={() => setRating(star)} 
                      className={`text-2xl cursor-pointer transition-all hover:scale-110 ${star <= rating ? "fill-yellow-500" : "fill-[var(--border-color)]"}`} 
                    />
                  ))}
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about your experience..."
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-5 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none mb-6"
                  rows="4"
                />
                <button
                  className="btn-primary px-8 py-3.5 rounded-xl font-bold shadow-md" 
                  onClick={handleReview}
                >
                  Submit Review
                </button>
              </div>
            </section>
          </div>

          {/* Sidebar / Curriculum */}
          <aside className="space-y-8">
            <div className="bg-[var(--bg-main)] p-6 rounded-[32px] border border-[var(--border-color)] shadow-sm">
              <h2 className="text-xl font-bold text-[var(--text-main)] mb-1">Curriculum</h2>
              <p className="text-sm text-[var(--text-muted)] mb-6">{selectedCourseData?.lectures?.length || 0} Lectures</p>

              <div className="space-y-3">
                {selectedCourseData?.lectures?.map((lecture, index) => (
                  <div
                    key={index}
                    onClick={() => lecture.isPreviewFree && setSelectedLecture(lecture)}
                    className={`flex items-center gap-4 px-4 py-4 rounded-2xl border transition-all ${
                      lecture.isPreviewFree
                        ? "hover:bg-[var(--bg-surface)] cursor-pointer border-[var(--border-color)] hover:border-blue-400"
                        : "cursor-not-allowed opacity-60 border-[var(--border-color)]"
                    } ${
                      selectedLecture?.lectureTitle === lecture.lectureTitle
                        ? "bg-[var(--bg-surface)] border-blue-600 ring-1 ring-blue-600/20"
                        : ""
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${lecture.isPreviewFree ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "bg-[var(--bg-surface)] text-[var(--text-muted)]"}`}>
                      {lecture.isPreviewFree ? <FaPlayCircle /> : <FaLock />}
                    </div>
                    <span className="text-sm font-bold text-[var(--text-main)] line-clamp-1">
                      {lecture.lectureTitle}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Preview */}
            <div className="bg-[var(--bg-main)] p-4 rounded-[32px] border border-[var(--border-color)] overflow-hidden">
               <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center relative group">
                {selectedLecture?.videoUrl ? (
                  <video
                    src={selectedLecture.videoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6">
                    <p className="text-white/60 text-xs font-medium uppercase tracking-widest mb-2">Lecture Preview</p>
                    <p className="text-white text-sm font-bold">Select a free lecture to watch</p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* Instructor & Related */}
        <div className="pt-12 border-t border-[var(--border-color)] space-y-12">
          <div className="flex flex-col md:flex-row items-center gap-8 bg-[var(--bg-main)] p-8 rounded-[40px] border border-[var(--border-color)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
            
            <div className="relative">
              {creatorData?.photoUrl ? (
                <img src={creatorData?.photoUrl} alt="Instructor" className="w-24 h-24 rounded-3xl object-cover shadow-xl border-4 border-[var(--bg-surface)]" />
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-blue-600 text-white flex items-center justify-center text-3xl font-black border-4 border-[var(--bg-surface)] shadow-xl">
                  {creatorData?.name?.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1 block">Course Instructor</span>
              <h3 className="text-2xl font-black text-[var(--text-main)] mb-2">{creatorData?.name}</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-2xl">{creatorData?.description || "Expert educator with years of industry experience in professional development."}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                <span className="text-xs font-bold px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-full">{creatorData?.email}</span>
                <span className="text-xs font-bold px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-full">12 Courses</span>
              </div>
            </div>
          </div>

          {selectedCreatorCourse?.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-[var(--text-main)]">More from this instructor</h2>
                <span className="h-0.5 flex-1 mx-8 bg-[var(--border-color)] rounded-full hidden md:block"></span>
              </div>
              <div className="flex overflow-x-auto pb-6 gap-6 scrollbar-hide">
                {selectedCreatorCourse.map((item, index) => (
                  <div key={index} className="flex-shrink-0">
                    <Card thumbnail={item.thumbnail} title={item.title} id={item._id} price={item.price} category={item.category} reviews={item.reviews} creatorName={creatorData?.name}/>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ViewCourse
