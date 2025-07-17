import express from "express";
import { getAllusers, loginUser, logoutUser, registerUser, getMyProfile , forgotPassword , resetPassword } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";
import passport from "passport";
import jwt from "jsonwebtoken";
const router = express.Router();

// Redirect user to Google for authentication
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google callback route [It is responsible for the whole authentication]
router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login" }),
    (req, res) => {
        const token = jwt.sign(
            { _id: req.user._id, email: req.user.email },
            process.env.SECRET,
            { expiresIn: "7d" }
        );

        // ✅ Set cookie instead of redirecting with token in URL
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Redirect to frontend without token in query
        res.redirect(`${process.env.FRONTEND_URL}/x1?token=${token}`);
    }
);

router.get("/users", getAllusers)
router.get("/my", isAuthenticated, getMyProfile)
router.post("/login", loginUser)
router.post("/register", registerUser)
router.post("/logout", logoutUser)
router.post("/forgotPassword",forgotPassword)
router.put('/reset-password/:token',resetPassword )
export default router;