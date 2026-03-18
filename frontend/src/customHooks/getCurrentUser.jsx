import { useEffect } from "react"
import { serverUrl } from "../App"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { setUserData, setLoading } from "../redux/userSlice"
const getCurrentUser = ()=>{
    let dispatch = useDispatch()
   
    useEffect(()=>{
        const fetchUser = async () => {
            try {
                let result = await axios.get(serverUrl + "/api/user/currentuser", { withCredentials: true })
                dispatch(setUserData(result.data))
                setTimeout(() => {
                    dispatch(setLoading(false))
                }, 2000)

            } catch (error) {
                console.log(error)
                dispatch(setUserData(null))
                setTimeout(() => {
                    dispatch(setLoading(false))
                }, 2000)
            }
        }
        fetchUser()
    },[])
}

export default getCurrentUser