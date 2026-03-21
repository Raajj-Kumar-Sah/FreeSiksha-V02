import jwt from "jsonwebtoken"
export const genToken = async (userId, role = 'student') => {
    try {
        let token = jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: "7d" })
        return token
    } catch (error) {
        console.log("token error:", error.message)
    }
}