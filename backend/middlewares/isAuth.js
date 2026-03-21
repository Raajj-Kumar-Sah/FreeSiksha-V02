import jwt from "jsonwebtoken"

export const isAuth = async (req,res,next)=>{
    try {
      const {token} = req.cookies
     
      if(!token){
        return res.status(401).json({message:"Unauthenticated: No token provided"})
      }

      const decoded = jwt.verify(token,process.env.JWT_SECRET)
  
      req.userId = decoded.userId
      req.userRole = decoded.role
      next()
    } catch (error) {
        console.error("isAuth verification error:", error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Session expired. Please login again." });
        }
        return res.status(500).json({ message: "Internal authentication error" });
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ message: "Access Denied: No token provided" });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: "Access Denied: Admin privileges required" });
        }
        
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        console.error("Admin Auth Error:", error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Admin session expired. Please login again." });
        }
        return res.status(500).json({ message: "Internal admin auth error" });
    }
}

export default isAuth;