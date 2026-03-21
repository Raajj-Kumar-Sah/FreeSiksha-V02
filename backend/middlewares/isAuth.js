import jwt from "jsonwebtoken"

export const isAuth = async (req,res,next)=>{
    try {
        let token = req.cookies.token;

        // Fallback to Authorization header if cookie is missing
        if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Unauthenticated: No token provided" })
        }

      const decoded = jwt.verify(token,process.env.JWT_SECRET)
  
      req.userId = decoded.userId
      req.userRole = decoded.role
      next()
    } catch (error) {
        console.error("isAuth verification error:", error.message, "Token present:", !!req.cookies.token);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Session expired. Please login again." });
        }
        return res.status(500).json({ message: `Internal authentication error: ${error.message}` });
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        let token = req.cookies.token;

        // Fallback to Authorization header if cookie is missing
        if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            console.error("Admin Auth Error: No token cookie or header found in request.");
            return res.status(401).json({ message: "Access Denied: No token provided" });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            console.warn(`Admin Auth Blocked: User ID ${decoded.userId} attempted admin access with role ${decoded.role}`);
            return res.status(403).json({ message: "Access Denied: Admin privileges required" });
        }
        
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        console.error("Admin Auth Error:", error.message, "Token present:", !!req.cookies.token);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Admin session expired. Please login again." });
        }
        return res.status(500).json({ message: `Internal admin auth error: ${error.message}` });
    }
}

export default isAuth;