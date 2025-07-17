import { user } from "../models/user.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import { cookieCode } from "../utils/feature.js";
import errorHandler from "../middlewares/error.js";
import validator from "validator";
export const getAllusers = async (req, res, next) => {
  try {
    const data = await user.find({});
    res.json({
      success: true,
      users: data,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    // we are able to access users data by req.body with the help of express.josn
    const User = await user.findOne({ email });

    if (!User) {
      return next(new errorHandler("User don't exist , Register first", 400));
    }

    if (!User.password) {
      return next(
        new errorHandler(
          "This account is registered via Google. Please login with Google",
          400
        )
      );
    }
    const matchedPassword = await bcrypt.compare(password, User.password);

    if (!matchedPassword) {
      console.log("Password incorrect");
      return next(new errorHandler("Incorrect password", 400));
    }

    cookieCode(User, res, 200, "User LoggedIn Successfully");
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const UserExist = await user.findOne({ email });

    console.log(req.body);
    if (UserExist)
      return next(new errorHandler("User already exist, Try logging In", 400));

    const hashedPassword = await bcrypt.hash(password, 10);

    const User = await user.create({
      name,
      email,
      password: hashedPassword,
    });

    cookieCode(User, res, 200, "User Registered Successfully");
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    res.cookie("token", null, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "development" ? false : true,
    });
    res.status(200).json({
      success: true,
      message: "User successfully Logout",
    });
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
    // req.user hai ye isAuthenticated middleware se access ho rha hai
  });
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !validator.isEmail(email)) {
      return next(new errorHandler("Please provide a valid email", 400));
    }
    const User = await user.findOne({ email });
    if (!User) return next(new errorHandler("User not exist", 404));
    if (!User.password) return next(new errorHandler("This account is registered via Google. Please login with Google", 400))
    const resetToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    User.resetPasswordToken = hashedToken;
    User.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;
    await User.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `Click the link to reset your password: ${resetUrl}`;
    try {
      await sendEmail(User.email, "Reset To Do App password", message);
      res.status(200).json({
        success: true,
        message: "Email is sent successfully , check your inbox",
      });
    } catch (error) {
      User.resetPasswordExpiry = undefined;
      User.resetPasswordToken = undefined;
      await User.save();
      return next(new errorHandler("Email is not sent", 500));
    }
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const User = await user.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!User) return next(new errorHandler("Resetting password time is out , try again", 404));

    const hashedPassword = await bcrypt.hash(password, 10);

    User.password = hashedPassword;
    User.resetPasswordExpiry = undefined;
    User.resetPasswordToken = undefined;

    await User.save();

    res.status(200).json({
      success: true,
      message: "User's Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};
