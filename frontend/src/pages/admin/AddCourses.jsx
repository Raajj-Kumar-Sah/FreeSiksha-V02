import React, { useEffect, useRef, useState } from 'react'
import img from "../../assets/empty.jpg"
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../../App';
import { MdEdit } from "react-icons/md";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import { setCourseData } from '../../redux/courseSlice';
import Nav from "../../components/Nav";

function AddCourses() {
    const navigate= useNavigate()
    const {courseId} = useParams()
   
    
    const [selectedCourse,setSelectedCourse] = useState(null)
    const [title,setTitle] = useState("")
    const [subTitle,setSubTitle] = useState("")
    const [description,setDescription] = useState("")
    const [category,setCategory] = useState("")
    const [level,setLevel] = useState("")
    const [zoomLink,setZoomLink] = useState("")
    const [isPublished,setIsPublished] = useState(false)
    const [registrationDeadline, setRegistrationDeadline] = useState("")
    const [formSchema, setFormSchema] = useState([])
   const thumb=useRef()
   const [frontendImage,setFrontendImage] = useState(null)
   const [backendImage,setBackendImage] = useState(null)
   let [loading,setLoading] = useState(false)
   const dispatch = useDispatch()
   const {courseData} = useSelector(state=>state.course)



    const getCourseById = async () => {
      try {
        const result = await axios.get(serverUrl + `/api/course/getcourse/${courseId}` , {withCredentials:true})
          setSelectedCourse(result.data)
          console.log(result)
        
      } catch (error) {
        console.log(error)
      }
      
    }
    useEffect(() => {
  if (selectedCourse) {
    setTitle(selectedCourse.title || "")
    setSubTitle(selectedCourse.subTitle || "")
    setDescription(selectedCourse.description || "")
    setCategory(selectedCourse.category || "")
    setLevel(selectedCourse.level || "")
    setZoomLink(selectedCourse.zoomLink || "")
    setFrontendImage(selectedCourse.thumbnail || img)
    setIsPublished(selectedCourse?.isPublished)
    setRegistrationDeadline(selectedCourse.registrationDeadline ? new Date(selectedCourse.registrationDeadline).toISOString().split('T')[0] : "")
    setFormSchema(selectedCourse.formSchema || [])


  }
}, [selectedCourse])

    useEffect(()=>{
      getCourseById()

    },[])
  const handleThumbnail = (e)=>{
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }


const editCourseHandler = async () => {
  setLoading(true);
  const formData = new FormData();
  formData.append("title", title);
  formData.append("subTitle", subTitle);
  formData.append("description", description);
  formData.append("category", category);
  formData.append("level", level);
  formData.append("thumbnail", backendImage);
  formData.append("isPublished", isPublished);
  formData.append("zoomLink", zoomLink);
  formData.append("registrationDeadline", registrationDeadline);
  formData.append("formSchema", JSON.stringify(formSchema));

  try {
    const result = await axios.post(
      `${serverUrl}/api/course/editcourse/${courseId}`,
      formData,
      { withCredentials: true }
    );

    const updatedCourse = result.data;
    if (updatedCourse.isPublished) {
      const updatedCourses = courseData.map(c =>
        c._id === courseId ? updatedCourse : c
      );
      if (!courseData.some(c => c._id === courseId)) {
        updatedCourses.push(updatedCourse);
      }
      dispatch(setCourseData(updatedCourses));
    } else {
      const filteredCourses = courseData.filter(c => c._id !== courseId);
      dispatch(setCourseData(filteredCourses));
    }

    toast.success("Course Updated");
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

const handleReopen = async () => {
  if (!registrationDeadline || new Date(registrationDeadline) <= new Date()) {
    return toast.error("Please pick a future date to reopen registration.");
  }
  setLoading(true);
  try {
    const res = await axios.post(`${serverUrl}/api/course/${courseId}/reopen`, { newDeadline: registrationDeadline }, { withCredentials: true });
    toast.success(res.data.message);
    
    // Update local redux state
    const updatedCourses = courseData.map(c => c._id === courseId ? { ...c, registrationDeadline: res.data.deadline } : c);
    dispatch(setCourseData(updatedCourses));
  } catch (e) {
    toast.error(e.response?.data?.message || "Failed to reopen registration");
  } finally {
    setLoading(false);
  }
};


  const removeCourse = async () => {
    setLoading(true)
    try {
      const result = await axios.delete(serverUrl + `/api/course/removecourse/${courseId}` , {withCredentials:true})
      toast.success("Course Deleted")
       const filteredCourses = courseData.filter(c => c._id !== courseId);
      dispatch(setCourseData(filteredCourses));
      console.log(result)
      navigate("/courses")
      setLoading(false)

    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
      setLoading(false)
    }
  }

    
  return (
    <div className="min-h-screen bg-[var(--bg-main)] pb-12 pt-[72px]">
      <Nav />
      <div className="max-w-5xl mx-auto p-8 mt-10 bg-[var(--bg-surface)] rounded-[32px] shadow-xl border border-[var(--border-color)]">
        
      {/* Top Bar */}
      <div className="flex items-center justify-between flex-col md:flex-row mb-10 pb-6 border-b border-[var(--border-color)] gap-6 text-center md:text-left">
        <div>
          <div className="flex items-center gap-2 mb-2 group cursor-pointer w-fit mx-auto md:mx-0" onClick={()=>navigate("/courses")}>
            <FaArrowLeftLong className='text-[var(--text-main)] group-hover:-translate-x-1 transition-transform'/>
            <span className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider">Back to Courses</span>
          </div>
          <h2 className="text-3xl font-black text-[var(--text-main)]">Edit <span className="text-blue-600">Course</span></h2>
        </div>
        
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3">
           {selectedCourse?.registrationDeadline && new Date() > new Date(selectedCourse.registrationDeadline) && (
              <button disabled={loading} className="px-6 py-2.5 rounded-xl font-bold bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-all shadow-sm" onClick={handleReopen}>
                Reopen Registration
              </button>
           )}
           {!isPublished ? (
              <button disabled={loading} className="px-6 py-2.5 rounded-xl font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all shadow-sm" onClick={()=>setIsPublished(prev=>!prev)}>
                Publish Course
              </button> 
            ) : (
              <button disabled={loading} className="px-6 py-2.5 rounded-xl font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-600 border border-amber-200 dark:border-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all shadow-sm" onClick={()=>setIsPublished(prev=>!prev)}>
                Unpublish Course
              </button>
            )}
          <button className="btn-primary px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20" onClick={()=>navigate(`/createlecture/${courseId}`)}>
            Manage Lectures
          </button>
        </div>
      </div>

      {/* Form Box */}
      <div className="bg-[var(--bg-main)] p-8 rounded-2xl border border-[var(--border-color)] shadow-sm">
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-[var(--text-main)]">Basic Information</h3>
            <button className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-2" disabled={loading} onClick={removeCourse}>
                {loading ? <ClipLoader size={16} color='red'/> : "Delete Course"}
            </button>
        </div>

        <form className="space-y-6" onSubmit={(e)=>e.preventDefault()}>
          {/* Title */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest ml-1">Title</label>
            <input type="text" placeholder="e.g. MERN Stack Mastery 2026" className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-5 py-3.5 text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" onChange={(e)=>setTitle(e.target.value)} value={title}/>
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest ml-1">Subtitle</label>
            <input type="text" placeholder="e.g. Master MongoDB, Express, React, and Node.js from scratch" className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-5 py-3.5 text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" onChange={(e)=>setSubTitle(e.target.value)} value={subTitle} />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest ml-1">Description</label>
            <textarea placeholder="e.g. In this comprehensive course, you will learn how to build and deploy professional-grade applications..." className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-5 py-3.5 text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium h-48 resize-none" onChange={(e)=>setDescription(e.target.value)} value={description}></textarea>
          </div>

          {/* Category, Level, Link - Flex row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest ml-1">Category</label>
              <select className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3.5 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium appearance-none" onChange={(e)=>setCategory(e.target.value)} value={category}>
                <option value="" className="bg-[var(--bg-surface)] text-[var(--text-main)]">Select Category</option>
                 <option value="Networking" className="bg-[var(--bg-surface)] text-[var(--text-main)]">Networking</option>
                             <option value="Soft-Skills" className="bg-[var(--bg-surface)] text-[var(--text-main)]">Soft-Skills</option>
                            <option value="AI Tools" className="bg-[var(--bg-surface)] text-[var(--text-main)]">AI Tools
                            </option>
                             <option value="Data Science" className="bg-[var(--bg-surface)] text-[var(--text-main)]">Data Science</option>
                            <option value="Data Analytics" className="bg-[var(--bg-surface)] text-[var(--text-main)]">Data Analytics</option>
                            <option value="Ethical Hacking" className="bg-[var(--bg-surface)] text-[var(--text-main)]">Ethical Hacking</option>
                            <option value="UI UX Designing" className="bg-[var(--bg-surface)] text-[var(--text-main)]">UI UX Designing</option>
                            <option value="Web Development" className="bg-[var(--bg-surface)] text-[var(--text-main)]">Web Development</option>
                            <option value="Others" className="bg-[var(--bg-surface)] text-[var(--text-main)]">Others</option>
              </select>
            </div>

            {/* Level */}
            <div className="space-y-2">
               <label className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest ml-1">Level</label>
              <select className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3.5 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium appearance-none" onChange={(e)=>setLevel(e.target.value)} value={level} >
                <option value="" className="bg-[var(--bg-surface)] text-[var(--text-main)]">Select Level</option>
                <option value="Beginner" className="bg-[var(--bg-surface)] text-[var(--text-main)]">Beginner</option>
                <option value="Intermediate" className="bg-[var(--bg-surface)] text-[var(--text-main)]">Intermediate</option>
                <option value="Advanced" className="bg-[var(--bg-surface)] text-[var(--text-main)]">Advanced</option>
              </select>
            </div>

            {/* Zoom Link & Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest ml-1">Live Class Link</label>
                <input type="text" placeholder="e.g. https://zoom.us/j/9876543210" className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3.5 text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" onChange={(e)=>setZoomLink(e.target.value)} value={zoomLink} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest ml-1">Registration Deadline</label>
                <input type="date" className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3.5 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" onChange={(e)=>setRegistrationDeadline(e.target.value)} value={registrationDeadline} />
              </div>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
             <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest ml-1">Course Thumbnail</label>
                 <input type="file" ref={thumb} hidden className="hidden" onChange={handleThumbnail} accept='image/*' />
             </div>
           
            <div className='relative w-full max-w-sm aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-[var(--border-color)] hover:border-blue-500 transition-colors group cursor-pointer' onClick={()=>thumb.current.click()}>
                <img src={frontendImage} alt="Thumbnail Preview" className='w-full h-full object-cover' />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <MdEdit className='w-8 h-8 text-white drop-shadow-md' />
                </div>
            </div>
          </div>

          {/* Dynamic Form Builder */}
          <div className="space-y-4 pt-8 border-t border-[var(--border-color)]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-[var(--text-main)]">Enrollment Form</h3>
                <p className="text-sm text-[var(--text-muted)] mt-1">Create custom questions for students to answer when they request to join.</p>
              </div>
              <button type="button" onClick={() => setFormSchema([...formSchema, { label: '', type: 'text', options: [], required: false }])} className="px-4 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg font-bold text-sm hover:bg-blue-100 dark:hover:bg-blue-500/20 flex items-center gap-2 transition-colors border border-blue-100 dark:border-blue-500/20 shadow-sm">
                <FaPlus /> Add Field
              </button>
            </div>
            
            <div className="space-y-4">
              {formSchema.length === 0 ? (
                <div className="p-8 border border-dashed border-[var(--border-color)] rounded-xl text-center text-[var(--text-muted)] text-sm">
                  No custom fields added. A default enrollment without questions will be used.
                </div>
              ) : (
                formSchema.map((field, index) => (
                  <div key={index} className="flex gap-4 p-5 border border-[var(--border-color)] rounded-xl bg-[var(--bg-surface)] relative group shadow-sm">
                    <div className="flex-1 space-y-4 pr-6">
                      <input type="text" placeholder="Question / Label (e.g. 'Why do you want to join?')" value={field.label} onChange={(e) => { const newSchema = [...formSchema]; newSchema[index].label = e.target.value; setFormSchema(newSchema); }} className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-main)] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                      <div className="flex flex-wrap gap-4 items-center bg-[var(--bg-main)] p-2 rounded-lg border border-[var(--border-color)] w-max">
                        <select value={field.type} onChange={(e) => { const newSchema = [...formSchema]; newSchema[index].type = e.target.value; setFormSchema(newSchema); }} className="bg-transparent border-none focus:ring-0 text-sm font-bold text-[var(--text-main)] px-2 cursor-pointer outline-none appearance-none">
                          <option value="text" className="bg-[var(--bg-main)]">Short Text</option>
                          <option value="number" className="bg-[var(--bg-main)]">Number</option>
                          <option value="email" className="bg-[var(--bg-main)]">Email</option>
                          <option value="dropdown" className="bg-[var(--bg-main)]">Dropdown</option>
                          <option value="file" className="bg-[var(--bg-main)]">File Upload</option>
                        </select>
                        <div className="h-4 w-px bg-[var(--border-color)]"></div>
                        <label className="flex items-center gap-2 text-sm text-[var(--text-main)] cursor-pointer px-2">
                          <input type="checkbox" checked={field.required} onChange={(e) => { const newSchema = [...formSchema]; newSchema[index].required = e.target.checked; setFormSchema(newSchema); }} className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 bg-transparent" />
                          <span className="font-medium">Required</span>
                        </label>
                      </div>
                      {field.type === 'dropdown' && (
                        <input type="text" placeholder="Options (comma separated, e.g. 'Morning, Evening, Weekend')" value={(field.options || []).join(', ')} onChange={(e) => { const newSchema = [...formSchema]; newSchema[index].options = e.target.value.split(',').map(s=>s.trim()); setFormSchema(newSchema); }} className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all mt-2 placeholder-[var(--text-muted)]" />
                      )}
                    </div>
                    <button type="button" onClick={() => { const newSchema = formSchema.filter((_, i) => i !== index); setFormSchema(newSchema); }} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-red-200">
                      <FaTrash />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Actions */}
          <div className='flex items-center justify-end gap-4 pt-8 border-t border-[var(--border-color)]'>
            <button className='px-6 py-3 rounded-xl font-bold bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)] hover:bg-[var(--bg-main)] transition-colors' onClick={()=>navigate("/courses")}>Cancel</button>
            <button className='btn-primary px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20' disabled={loading} onClick={editCourseHandler}>{loading ? <ClipLoader size={20} color='white'/>:"Save Changes"}</button>
          </div>
        </form>
      </div>
      </div>
    </div>
  )
}

export default AddCourses
