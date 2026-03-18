import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dropSlugIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/test");
    console.log("Connected to MongoDB");
    
    const collection = mongoose.connection.db.collection("courses");
    const indexes = await collection.indexes();
    console.log("Current indexes:", indexes);

    if (indexes.some(idx => idx.name === "slug_1")) {
      await collection.dropIndex("slug_1");
      console.log("Successfully dropped slug_1 index");
    } else {
      console.log("slug_1 index not found");
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error dropping index:", error);
  }
};

dropSlugIndex();
