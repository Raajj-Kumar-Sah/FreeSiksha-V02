import express from "express";
import { createBlog, getAllBlogs, getBlogById, incrementView, toggleHeart, deleteBlog, getMyOrAdminBlogs } from "../controllers/blogController.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js"; // For thumbnail parsing

const blogRouter = express.Router();

// Public / Student Accessible Routes
blogRouter.get("/public", getAllBlogs);
blogRouter.get("/:id", getBlogById);
blogRouter.post("/:id/view", incrementView); 

// Authenticated Student Interactions
blogRouter.post("/:id/heart", isAuth, toggleHeart);

// Educator & Admin Routes
blogRouter.post("/create", isAuth, upload.single("thumbnail"), createBlog); // Ensure only authorized roles in frontend submit, or add middleware
blogRouter.get("/manager/all", isAuth, getMyOrAdminBlogs);
blogRouter.delete("/manager/:id", isAuth, deleteBlog);

export default blogRouter;
