import { useEffect } from 'react'
import { serverUrl } from "../config"
import axios from 'axios'
import { setCreatorCourseData } from '../redux/courseSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const useGetCreatorCourseData = () => {
    const dispatch = useDispatch()
    const {userData} = useSelector(state => state.user)

    useEffect(() => {
        const getCreatorData = async () => {
            if (!userData) return;
            try {
                const result = await axios.get(serverUrl + "/api/course/getcreatorcourses" , {withCredentials:true})
                dispatch(setCreatorCourseData(result.data))
            } catch (error) {
                console.log(error)
                toast.error(error.response?.data?.message || "Failed to fetch creator data")
            }
        }
        getCreatorData()
    }, [userData, dispatch])
}

export default useGetCreatorCourseData
