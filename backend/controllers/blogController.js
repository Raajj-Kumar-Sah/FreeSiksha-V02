import mongoose from "mongoose";
import Blog from "../models/blogModel.js";
import uploadOnCloudinary from "../configs/cloudinary.js";

// Create Blog
export const createBlog = async (req, res) => {
    try {
        const { title, content, authorRole, category } = req.body;
        
        let thumbnailUrl = "";
        if (req.file) {
            const uploadResult = await uploadOnCloudinary(req.file.path);
            thumbnailUrl = uploadResult || "";
        }

        const blog = await Blog.create({
            title,
            content,
            thumbnail: thumbnailUrl,
            authorId: req.userId,
            authorRole,
            category
        });

        res.status(201).json(blog);
    } catch (error) {
        console.log("Create Blog Error: ", error);
        res.status(500).json({ message: "Failed to create blog post." });
    }
};

// Get All Blogs (Public/Student)
export const getAllBlogs = async (req, res) => {
    try {
        const { filter = "newest" } = req.query; // newest, trending
        
        let sortConfig = { createdAt: -1 };
        if (filter === "trending") {
            sortConfig = { heartsCount: -1, views: -1, createdAt: -1 };
        }

        const blogs = await Blog.aggregate([
            {
                $addFields: {
                    heartsCount: { $size: "$hearts" }
                }
            },
            { $sort: sortConfig },
            {
                $lookup: {
                    from: "users",
                    localField: "authorId",
                    foreignField: "_id",
                    as: "authorDetails"
                }
            },
            { $unwind: "$authorDetails" },
            {
                $project: {
                    title: 1,
                    content: { $substrCP: ["$content", 0, 150] }, // Short preview
                    thumbnail: 1,
                    authorRole: 1,
                    category: 1,
                    heartsCount: 1,
                    hearts: 1,
                    views: 1,
                    createdAt: 1,
                    "authorDetails.name": 1,
                    "authorDetails._id": 1
                }
            }
        ]);

        res.status(200).json(blogs);
    } catch (error) {
        console.log("Get Blogs Error: ", error);
        res.status(500).json({ message: "Failed to fetch blogs." });
    }
};

// Get Blog By Id
export const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate("authorId", "name email");
            
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        res.status(200).json(blog);
    } catch (error) {
        console.log("Get Blog Error: ", error);
        res.status(500).json({ message: "Failed to fetch blog details." });
    }
};

// Increment View
export const incrementView = async (req, res) => {
    try {
        await Blog.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
        res.status(200).json({ message: "View incremented" });
    } catch (error) {
        res.status(500).json({ message: "Failed to track view" });
    }
};

// Toggle Heart
export const toggleHeart = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        const userId = req.userId; // from isAuth middleware
        const index = blog.hearts.indexOf(userId);

        if (index === -1) {
            blog.hearts.push(userId); // Like
        } else {
            blog.hearts.splice(index, 1); // Unlike
        }

        await blog.save();
        res.status(200).json({ message: "Heart updated", heartsLength: blog.hearts.length, isLiked: index === -1 });
    } catch (error) {
        console.log("Toggle Heart Error: ", error);
        res.status(500).json({ message: "Failed to update like status." });
    }
};

// Admin / Teacher specific GET routing
export const getMyOrAdminBlogs = async (req, res) => {
     try {
         // If super admin, fetch all full documents
         // If teacher, fetch only theirs
         let filter = {};
         if (req.userRole !== 'admin') {
             filter.authorId = req.userId;
         }

         const blogs = await Blog.find(filter).populate("authorId", "name").sort({ createdAt: -1 });
         res.status(200).json(blogs);
     } catch (error) {
         res.status(500).json({ message: "Failed to fetch admin blogs." });
     }
}

// Delete Blog
export const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        // Ensure user is author or superadmin
        if (req.userRole !== 'admin' && blog.authorId.toString() !== req.userId.toString()) {
            return res.status(403).json({ message: "Unauthorized to delete this blog." });
        }

        await Blog.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Blog permanently deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete blog." });
    }
};
