import axios from "axios";
import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import Nav from "../../components/Nav";

const CreateCourse = () => {
    let navigate = useNavigate()
    let [loading,setLoading]=useState(false)
    const [title,setTitle] = useState("")
    const [category,setCategory] = useState("")

    const CreateCourseHandler = async () => {
        setLoading(true)
        try {
            const result = await axios.post(serverUrl + "/api/course/create" , {title , category} , {withCredentials:true})
            console.log(result.data)
            toast.success("Course Created")
            navigate("/courses")
            setTitle("")
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
            toast.error(error.response.data.message)
        }
        
    }

    return (
        
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] px-4 py-10 pt-[72px]">
            <Nav />
            <div className="max-w-xl w-[600px] mx-auto p-8 bg-[var(--bg-surface)] shadow-xl rounded-[32px] border border-[var(--border-color)] relative">
                <div className="flex items-center gap-2 mb-6 group cursor-pointer w-fit" onClick={()=>navigate("/courses")}>
                    <FaArrowLeftLong  className='text-[var(--text-main)] group-hover:-translate-x-1 transition-transform'/>
                    <span className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider">Back to Courses</span>
                </div>
                <h2 className="text-3xl font-black mb-10 text-center text-[var(--text-main)]">Create <span className="text-blue-600">Course</span></h2>

                <form className="space-y-6" onSubmit={(e)=>e.preventDefault()}>
                    {/* Course Title */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest ml-1">
                            Course Title
                        </label>
                        <input
                            type="text"
                            placeholder="Enter course title"
                            className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-5 py-3.5 text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                            onChange={(e)=>setTitle(e.target.value)} value={title}
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest ml-1">
                            Category
                        </label>
                        <select
                            className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-5 py-3.5 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium appearance-none"
                            onChange={(e)=>setCategory(e.target.value)}
                        >
                            <option value="" className="bg-[var(--bg-main)] text-[var(--text-main)]">Select category</option>
                            <option value="Networking" className="bg-[var(--bg-main)] text-[var(--text-main)]">Networking</option>
                             <option value="Soft-Skills" className="bg-[var(--bg-main)] text-[var(--text-main)]">Soft-Skills</option>
                            <option value="AI Tools" className="bg-[var(--bg-main)] text-[var(--text-main)]">AI Tools</option>
                             <option value="Data Science" className="bg-[var(--bg-main)] text-[var(--text-main)]">Data Science</option>
                            <option value="Data Analytics" className="bg-[var(--bg-main)] text-[var(--text-main)]">Data Analytics</option>
                            <option value="Ethical Hacking" className="bg-[var(--bg-main)] text-[var(--text-main)]">Ethical Hacking</option>
                            <option value="UI UX Designing" className="bg-[var(--bg-main)] text-[var(--text-main)]">UI UX Designing</option>
                            <option value="Web Development" className="bg-[var(--bg-main)] text-[var(--text-main)]">Web Development</option>
                            <option value="Others" className="bg-[var(--bg-main)] text-[var(--text-main)]">Others</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full btn-primary py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center mt-8" disabled={loading} onClick={CreateCourseHandler}
                    >
                        {loading?<ClipLoader size={24} color='white' /> : "Create Course"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateCourse;
