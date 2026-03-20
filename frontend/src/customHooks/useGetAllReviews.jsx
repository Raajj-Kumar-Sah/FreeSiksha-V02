import { useEffect } from "react"
import { serverUrl } from "../config"
import axios from "axios"
import { useDispatch } from "react-redux"
import { setAllReview } from "../redux/reviewSlice"

const useGetAllReviews = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchReview = async () => {
            try {
                const result = await axios.get(serverUrl + "/api/review/allReview")
                dispatch(setAllReview(result.data))
            } catch (error) {
                console.log(error)
            }
        }
        fetchReview()
    }, [dispatch])
}

export default useGetAllReviews
