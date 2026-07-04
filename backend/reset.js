import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";

dotenv.config(); // 🔥 THIS IS MISSING

await mongoose.connect(process.env.MONGODB_URL);

await User.deleteMany({});

console.log("All users deleted");

await mongoose.disconnect();
process.exit();