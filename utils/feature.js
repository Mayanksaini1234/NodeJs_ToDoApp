import jwt from "jsonwebtoken";

export const cookieCode = async(User,res,stausCode=200,message)=>{
          const token = jwt.sign({ _id: User._id }, process.env.SECRET, {
            expiresIn: "7d",
          });
    
          return res
            .status(stausCode)
            .cookie("token", token, {
              httpOnly: true,
              maxAge:15 * 60 * 1000,
              sameSite: "lax",
              secure: false
            })
            .json({
              success: true,
              message: message,
            });
    
}