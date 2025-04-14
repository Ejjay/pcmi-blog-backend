import User from "../models/user.model.js";

export const createUser = async (req, res) => {
  try {
    // Get user data from Clerk
    const { userId } = req.auth;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ clerkUserId: userId });
    if (existingUser) {
      return res.status(200).json(existingUser);
    }

    // Get user data from request body or Clerk
    const { username, email, img } = req.body;

    // Create new user
    const newUser = new User({
      clerkUserId: userId,
      username: username || `user_${Date.now()}`, // Generate a username if not provided
      email: email || "user@example.com", // Default email if not provided
      img: img || "",
      savedPosts: []
    });

    await newUser.save();
    return res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getUserSavedPosts = async (req, res) => {
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = await User.findOne({ clerkUserId });

  res.status(200).json(user.savedPosts);
};

export const savePost = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const postId = req.body.postId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = await User.findOne({ clerkUserId });

  const isSaved = user.savedPosts.some((p) => p === postId);

  if (!isSaved) {
    await User.findByIdAndUpdate(user._id, {
      $push: { savedPosts: postId },
    });
  } else {
    await User.findByIdAndUpdate(user._id, {
      $pull: { savedPosts: postId },
    });
  }

  res.status(200).json(isSaved ? "Post unsaved" : "Post saved");
};