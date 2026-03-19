import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { serverUrl } from '../../App';
import { ClipLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { setLectureData } from '../../redux/lectureSlice';
import Nav from "../../components/Nav";
function CreateLecture() {
    const navigate = useNavigate()
    const {courseId} = useParams()
    const [lectureTitle , setLectureTitle] = useState("")
    const [loading,setLoading] = useState(false)
    const dispatch = useDispatch()
    const {lectureData} = useSelector(state=>state.lecture)
    

    const createLectureHandler = async () => {
      setLoading(true)
      try {
        const result = await axios.post(serverUrl + `/api/course/createlecture/${courseId}` ,{lectureTitle} , {withCredentials:true})
        console.log(result.data)
      dispatch(setLectureData([...lectureData,result.data.lecture]))
        toast.success("Lecture Created")
        setLoading(false)
        setLectureTitle("")
      } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)
        setLoading(false)
      }
    }

    useEffect(()=>{
      const getLecture = async () => {
        try {
          const result = await axios.get(serverUrl + `/api/course/getcourselecture/${courseId}`,{withCredentials:true})
        console.log(result.data)
        dispatch(setLectureData(result.data.lectures))
        

          
        } catch (error) {
           console.log(error)
        toast.error(error.response.data.message)
        
        }
        
      }
      getLecture()
    },[])

   
  
  return (
     <div className="min-h-screen flex flex-col bg-[var(--bg-main)]">
      <Nav />
      <div className="flex-1 flex items-center justify-center p-4 mt-[72px]">
        <div className="bg-[var(--bg-surface)] shadow-xl rounded-[32px] border border-[var(--border-color)] w-full max-w-2xl p-8 md:p-10 relative overflow-hidden">
        
        {/* Header */}
        <div className="mb-8 relative z-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-xs font-bold tracking-wider uppercase mb-3">
              Course Content
          </div>
          <h1 className="text-3xl font-black text-[var(--text-main)] mb-2">Manage <span className="text-blue-600">Lectures</span></h1>
          <p className="text-sm text-[var(--text-muted)]">Add or edit video lectures to enhance your course content.</p>
        </div>

        {/* Input */}
        <div className="space-y-2 mb-6 relative z-10">
            <label className="text-xs font-bold text-blue-600 uppercase tracking-widest ml-1">New Lecture Title</label>
            <input
            type="text"
            placeholder="e.g. Introduction to Mern Stack"
            className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-5 py-3.5 text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
            onChange={(e)=>setLectureTitle(e.target.value)}
            value={lectureTitle}
            />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 pb-10 border-b border-[var(--border-color)] relative z-10">
          <button className="flex-1 btn-primary py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 flex justify-center items-center gap-2" disabled={loading} onClick={createLectureHandler}>
           {loading?<ClipLoader size={20} color='white'/>: "+ Create Lecture"}
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-color)] hover:bg-[var(--bg-surface)] transition-all font-bold" onClick={()=>navigate(`/addcourses/${courseId}`)}>
            <FaArrowLeft /> Course Settings
          </button>
        </div>

        {/* Lecture List */}
         <div className="space-y-3 relative z-10 h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            <h3 className="text-lg font-bold text-[var(--text-main)] mb-4 sticky top-0 bg-[var(--bg-surface)] py-2">Existing Lectures ({lectureData.length})</h3>
          {lectureData.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-[var(--border-color)] rounded-2xl">
                  <p className="text-[var(--text-muted)] font-medium text-sm">No lectures created yet. Add your first one above!</p>
              </div>
          ) : lectureData.map((lecture, index) => (
            <div key={index} className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl flex justify-between items-center p-4 transition-all hover:border-blue-300 group">
              <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)] font-black text-sm group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      {index + 1}
                  </div>
                  <span className="text-sm font-bold text-[var(--text-main)]">{lecture.lectureTitle}</span>
              </div>
              
              <button className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm" onClick={()=>navigate(`/editlecture/${courseId}/${lecture._id}`)}>
                  <FaEdit />
              </button>
            </div>
          ))}
        </div> 
      </div>
      </div>
    </div>
    
  )
}

export default CreateLecture
