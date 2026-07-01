import express from "express";
import { getAllusers, loginUser, logoutUser, registerUser, getMyProfile , forgotPassword , resetPassword, updateUserName } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { registerValidation ,loginValidation , validateForgotPassword , validateResetPassword } from "../validators/userValidator.js";
import { validate } from "../middlewares/validationMiddleware.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { authLimiter , emailLimiter } from "../middlewares/authRateLimiter.js";
const router = express.Router();

// Redirect user to Google for authentication , we will use this end point 
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
            httpOnly: true,   /// js cant access cookie 
            secure: process.env.NODE_ENV !== "development", // true -> HTTPS pr cookie bhege ja skte hai 
            sameSite: process.env.NODE_ENV === "development" ? "lax" : "none", // diff domains commuinication 
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Redirect to frontend without token in query
        res.redirect(`${process.env.FRONTEND_URL}`);
    }
);

router.get("/users", getAllusers) // Developer API 
router.get("/my", isAuthenticated, getMyProfile)
router.post("/login", authLimiter, loginValidation , validate,loginUser)
router.post("/register", authLimiter, registerValidation , validate , registerUser)
router.post("/logout", logoutUser)
router.post("/forgotPassword",emailLimiter, validateForgotPassword , validate, forgotPassword)
router.put('/reset-password/:token', validateResetPassword, validate, resetPassword)
router.put("/updateUser",isAuthenticated,updateUserName);

export default router;