import axios from 'axios'
import React, { useState } from 'react'
import { FaArrowLeft } from "react-icons/fa"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../../App'
import { setLectureData } from '../../redux/lectureSlice'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'
import Nav from "../../components/Nav";

function EditLecture() {
    const [loading,setLoading]= useState(false)
    const [loading1,setLoading1]= useState(false)
    const {courseId , lectureId} = useParams()
    const {lectureData} = useSelector(state=>state.lecture)
    const dispatch = useDispatch()
    const selectedLecture = lectureData.find(lecture => lecture._id === lectureId)
    const [videoUrl,setVideoUrl] = useState(null)
    const [lectureTitle,setLectureTitle] = useState(selectedLecture.lectureTitle)
    const [isPreviewFree,setIsPreviewFree] = useState(false)

    const formData = new FormData()
    formData.append("lectureTitle",lectureTitle)
    formData.append("videoUrl",videoUrl)
    formData.append("isPreviewFree",isPreviewFree)
    

    const editLecture = async () => {
      setLoading(true)
      try {
        const result = await axios.post(serverUrl + `/api/course/editlecture/${lectureId}` , formData , {withCredentials:true})
        console.log(result.data)
        dispatch(setLectureData([...lectureData,result.data]))
        toast.success("Lecture Updated")
        navigate("/courses")
        setLoading(false)
      } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)
        setLoading(false)
      }
    }

    const removeLecture = async () => {
      setLoading1(true)
      try {
        const result = await axios.delete(serverUrl + `/api/course/removelecture/${lectureId}` , {withCredentials:true})
        console.log(result.data)
        toast.success("Lecture Removed")
       navigate(`/createlecture/${courseId}`)
        setLoading1(false)
      } catch (error) {
        console.log(error)
        toast.error("Lecture remove error")
        setLoading1(false)
      }
      
    }






   

    

    const navigate = useNavigate()
  return (
     <div className="min-h-screen flex flex-col bg-[var(--bg-main)]">
      <Nav />
      <div className="flex-1 flex items-center justify-center p-4 mt-[72px]">
        <div className="bg-[var(--bg-surface)] shadow-xl rounded-[32px] border border-[var(--border-color)] w-full max-w-xl p-8 md:p-10 relative overflow-hidden">

        {/* Header section with back button */}
        <div className="mb-8 border-b border-[var(--border-color)] pb-6 flex items-center justify-between">
           <div>
            <div className="flex items-center gap-2 mb-2 group cursor-pointer w-fit" onClick={()=>navigate(`/createlecture/${courseId}`)}>
              <FaArrowLeft className="text-[var(--text-main)] group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider">Back to Lectures</span>
            </div>
            <h2 className="text-3xl font-black text-[var(--text-main)]">Edit <span className="text-blue-600">Lecture</span></h2>
           </div>
           
           <button className="flex items-center justify-center w-10 h-10 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-all border border-red-200 dark:border-red-500/20 shadow-sm" disabled={loading1} onClick={removeLecture} title="Delete Lecture">
            {loading1 ? <ClipLoader size={16} color='red'/> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>}
          </button>
        </div>

        {/* Input Fields */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-blue-600 uppercase tracking-widest ml-1">Title</label>
            <input
              type="text"
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-5 py-3.5 text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              placeholder={selectedLecture.lectureTitle}
              onChange={(e)=>setLectureTitle(e.target.value)}
              value={lectureTitle}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-blue-600 uppercase tracking-widest ml-1">Video File *</label>
            <div className="relative border-2 border-dashed border-[var(--border-color)] rounded-2xl p-6 hover:border-blue-500 transition-colors bg-[var(--bg-main)]">
                <input
                  type="file"
                  required
                  accept='video/*'
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e)=>setVideoUrl(e.target.files[0])}
                />
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <svg className="w-8 h-8 text-[var(--text-muted)] group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="font-bold text-[var(--text-main)] text-sm">{videoUrl ? videoUrl.name : "Click or drag video here to upload"}</p>
                    <p className="text-xs text-[var(--text-muted)] font-medium">MP4, WebM, or OGG up to 500MB</p>
                </div>
            </div>
          </div>

          {/* Toggle */}
          <div className="flex items-center gap-3 p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl">
             <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer mt-0.5 ml-0.5 transition-transform duration-200 checked:translate-x-4 checked:border-blue-600" checked={isPreviewFree} onChange={() => setIsPreviewFree(prev=>!prev)}/>
                <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer transition-colors duration-200 peer-checked:bg-blue-600"></label>
            </div>
            <label htmlFor="toggle" className="text-sm font-bold text-[var(--text-main)] cursor-pointer">Make this video available for free preview</label>
          </div>
        </div>
        
         {loading && (
             <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center gap-3 font-bold text-sm border border-blue-100 dark:border-blue-900/50">
                 <ClipLoader size={16} color="currentColor" />
                 Uploading video... Please wait. This may take a few moments.
             </div>
         )}
         
        {/* Submit Button */}
        <div className="pt-8">
          <button className="w-full btn-primary py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed" disabled={loading} onClick={editLecture}>
            {loading ? <ClipLoader size={24} color='white'/> :"Save Changes"}
          </button>
        </div>
      </div>
    </div>
    </div>
  )
}

export default EditLecture
