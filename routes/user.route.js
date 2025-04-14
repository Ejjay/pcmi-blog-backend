import express from "express";
import { createUser, getUserSavedPosts, savePost } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/", createUser);
router.get("/saved", getUserSavedPosts);
router.patch("/save", savePost);

export default router;