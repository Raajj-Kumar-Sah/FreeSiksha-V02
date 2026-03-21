import { useEffect } from "react"
import { serverUrl } from "../config"
import axios from "axios"
import { useDispatch } from "react-redux"
import { setUserData, setLoading } from "../redux/userSlice"

const useGetCurrentUser = () => {
    const dispatch = useDispatch()
   
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await axios.get(serverUrl + "/api/user/currentuser", { withCredentials: true })
                dispatch(setUserData(result.data))
                dispatch(setLoading(false))

            } catch (error) {
                console.log(error)
                dispatch(setUserData(null))
                dispatch(setLoading(false))
            }
        }
        fetchUser()
    }, [dispatch])
}

export default useGetCurrentUser
