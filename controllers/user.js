import { user } from "../models/user.js";
import bcrypt from "bcrypt";
import { cookieCode } from "../utils/feature.js";
import errorHandler from "../middlewares/error.js";

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

export const loginUser = async (req, res , next) => {
  try {
    const { email, name, password } = req.body;
    const User = await user.findOne({ email });

    if (!User)
      return next(new errorHandler("User don't exist , Register first", 400));

    const matchedPassword = await bcrypt.compare(password, User.password);

    if (!matchedPassword)
      return next(new errorHandler("Incorrect password", 400));
    cookieCode(User, res, 200, "User LoggedIn Successfully");
  } catch (error) {
    next(error)
  }
};

export const registerUser = async (req, res , next) => {
  try {
    const { name, email, password } = req.body;
    const UserExist = await user.findOne({ email });

    if (UserExist) return next(new errorHandler("User already exist, Try logging In",400))

    const hashedPassword = await bcrypt.hash(password, 10);

    const User = await user.create({
      name,
      email,
      password: hashedPassword,
    });

    cookieCode(User, res, 200, "User Registered Successfully");
  } catch (error) {
   next(error)
  }
};

export const logoutUser = async (req, res , next) => {
  try {
    res.cookie("token", null, {
      hhttpOnly: true,
      maxAge:15 * 60 * 1000,
      sameSite: process.env.NODE_ENV==="development"? "lax" :"none",
      secure: process.env.NODE_ENV==="development"? false :true
    });
    res.status(200).json({
      success: true,
      message: "User successfully Logout",
    });
  } catch (error) {
   next(error)
  }
};

export const getMyProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};
