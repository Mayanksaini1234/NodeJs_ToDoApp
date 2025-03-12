import jwt from "jsonwebtoken";
import { user } from "../models/user.js";

export const isAuthenticated = async(req, res, next) => {

  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Login First",
    });
  }

    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = await user.findById(decoded._id)
 next();
  
};
