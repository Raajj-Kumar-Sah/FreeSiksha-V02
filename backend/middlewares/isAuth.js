
import jwt from "jsonwebtoken"
export const isAuth = async (req,res,next)=>{
    try {
 
      let {token} = req.cookies
     
      if(!token){
        return res.status(400).json({message:"user doesn't have token"})
      }
      let verifyToken = jwt.verify(token,process.env.JWT_SECRET)
      
      if(!verifyToken){
        return res.status(400).json({message:"user doesn't have valid token"})
      }
  
      req.userId = verifyToken.userId
      req.userRole = verifyToken.role
      next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:`is auth error ${error}`})
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        let { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ message: "Access Denied: No token provided" });
        }
        
        let verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!verifyToken || verifyToken.role !== 'admin') {
            return res.status(403).json({ message: "Access Denied: Admin privileges required" });
        }
        
        req.userId = verifyToken.userId;
        req.userRole = verifyToken.role;
        next();
    } catch (error) {
        console.error("Admin Auth Error:", error);
        return res.status(500).json({ message: "Internal server error during admin authentication" });
    }
}

export default isAuth;