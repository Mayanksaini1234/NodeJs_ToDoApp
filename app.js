import express from "express";
import dotenv from "dotenv";
import UserRouter from "./routes/user.js";
import TaskRouter from "./routes/task.js";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middlewares/error.js";
import cors from "cors";
import passport from "passport";
import "./config/passport.js";

dotenv.config();


export const app = express();
app.get("/", (req,res)=>{
    res.end("lol")
 });

//  Middlewares 
 app.use(express.urlencoded({extended:true}))
//  access req.body 
 app.use(express.json())
//  Parses incoming JSON and puts it in req.body 
 app.use(cookieParser());
//  access cookie token  req.cookies
 app.use(cors({
    origin:[process.env.FRONTEND_URL],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}))
// To connect to frontend 

app.use(passport.initialize());


 app.use("/api/user",UserRouter)
 app.use("/api/task",TaskRouter)
 app.use(ErrorMiddleware);
 