
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
        console.error("isAuth verification error:", error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Session expired. Please login again." });
        }
        return res.status(500).json({ message: `Internal auth error: ${error.message}` });
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
        console.error("Admin Auth Error:", error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Admin session expired. Please login again." });
        }
        return res.status(500).json({ message: `Internal admin auth error: ${error.message}` });
    }
}

export default isAuth;