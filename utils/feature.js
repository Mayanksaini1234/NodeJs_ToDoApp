import jwt from "jsonwebtoken";

export const cookieCode = async (User, res, statusCode = 200, message) => {
  const token = jwt.sign({ _id: User._id }, process.env.SECRET, {
    expiresIn: "7d",
  });

  return res
    .status(statusCode)
    .cookie("token", token, {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  secure: process.env.NODE_ENV === "production",
})
    .json({
      success: true,
      message: message,
    });
};