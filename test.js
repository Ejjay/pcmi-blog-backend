import mongoose from "mongoose";
import User from "./models/user.model.js";
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: `${__dirname}/.env` });

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB");
    
    // Create a new user
    const newUser = new User({
      clerkUserId: "user_2vffy3iryN81C4SYjwdj4Jpu4SM", // Replace with your Clerk user ID
      username: "ejjays",
      email: "christsonalloso021@gmail.com",
      img: "",
      savedPosts: []
    });
    
    // Save the user to the database
    await newUser.save();
    console.log("Test user created successfully:", newUser);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error creating test user:", error);
  }
}

createTestUser();
