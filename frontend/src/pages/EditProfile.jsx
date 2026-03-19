import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6";

function EditProfile() {
     let {userData} = useSelector(state=>state.user)
     let [name,setName] = useState(userData.name || "")
     let [description,setDescription] = useState(userData.description || "")
     let [photoUrl,setPhotoUrl] = useState(null)
     let dispatch = useDispatch()
     let [loading,setLoading] = useState(false)
     let navigate = useNavigate()

      const formData = new FormData()
      formData.append("name",name)
      formData.append("description",description)
      formData.append("photoUrl",photoUrl)



     const updateProfile = async () => {
      setLoading(true)
      try {
        const result = await axios.post(serverUrl + "/api/user/updateprofile" ,formData , {withCredentials:true} )
        console.log(result.data)
        dispatch(setUserData(result.data))
        navigate("/")
        setLoading(false)
      
        toast.success("Profile Update Successfully")
        

        
      } catch (error) {
        console.log(error)
        toast.error("Profile Update Error")
        setLoading(false)
      }
      
     }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] px-4 py-10">
      <div className="bg-[var(--bg-surface)] rounded-3xl shadow-xl border border-[var(--border-color)] p-10 max-w-xl w-full relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16"></div>
        
        <div className="flex items-center gap-2 mb-8 group cursor-pointer w-fit" onClick={()=>navigate("/profile")}>
          <FaArrowLeftLong className='text-[var(--text-main)] group-hover:-translate-x-1 transition-transform' />
          <span className="text-sm font-medium text-[var(--text-main)]">Back to Profile</span>
        </div>

        <h2 className="text-3xl font-black text-center text-[var(--text-main)] mb-8">Edit Profile</h2>

        <form  className="space-y-6" onSubmit={(e)=>e.preventDefault()}>
          {/* Profile Photo Preview */}
          <div className="flex flex-col items-center text-center">
            <div className="relative group">
              {userData.photoUrl ? (
                <img src={userData.photoUrl} alt="Preview" className="w-24 h-24 rounded-3xl object-cover border-4 border-blue-600 shadow-lg" />
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-blue-600 text-white flex items-center justify-center text-3xl font-black border-4 border-[var(--bg-surface)] shadow-lg">
                  {userData?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="text-white text-[10px] font-bold uppercase">Update</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-blue-600 uppercase tracking-widest ml-1">Profile Picture</label>
            <input
              type="file"
              name="photoUrl"
              className="w-full px-5 py-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl text-xs text-[var(--text-main)] file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
              onChange={(e)=>setPhotoUrl(e.target.files[0])}
            />
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-blue-600 uppercase tracking-widest ml-1">Full Name</label>
            <input
              type="text"
              name="name"
              className="w-full px-5 py-3.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              placeholder={userData.name}
              onChange={(e)=>setName(e.target.value)}
              value={name}
            />
          </div>

          {/* Email (read-only) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-blue-600 uppercase tracking-widest ml-1">Email <span className="normal-case opacity-60 font-medium">(Read-only)</span></label>
            <input
              type="email"
              readOnly
              disabled
              className="w-full px-5 py-3.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl text-[var(--text-muted)] cursor-not-allowed font-medium"
              placeholder={userData.email}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-blue-600 uppercase tracking-widest ml-1">About You</label>
            <textarea
              name="description"
              className="w-full px-5 py-3.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none font-medium"
              rows={4}
              placeholder="Tell us about yourself..."
              onChange={(e)=>setDescription(e.target.value)}
              value={description}
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading}
            onClick={updateProfile}
            className="w-full btn-primary py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center mt-4"
          >
            {loading ? <ClipLoader size={24} color='white'/> : "Save Profile Changes"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditProfile
