import express from "express";
import { getAllusers,loginUser,logoutUser,registerUser,getMyProfile  } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.get("/users",getAllusers)
router.get("/my", isAuthenticated ,getMyProfile)
router.post("/login",loginUser)
router.post("/register",registerUser)
router.post("/logout",logoutUser)

export default router;