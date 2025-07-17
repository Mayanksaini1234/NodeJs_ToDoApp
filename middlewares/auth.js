import jwt from "jsonwebtoken";
import { user } from "../models/user.js";
import errorHandler from "./error.js";
export const isAuthenticated = async(req, res, next) => {

  try {
      const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Login First!",
    });
  }

    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = await user.findById(decoded._id)
    // VVimp step 
 next();

  } catch (error) {
next(new errorHandler("Login first!",500))  }
  
};
