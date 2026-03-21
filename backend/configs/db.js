import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("✅ MongoDB Connected Successfully")
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        console.error("Check your MONGODB_URI and ensuring 0.0.0.0/0 is whitelisted in Atlas.");
    }
}
export default connectDb