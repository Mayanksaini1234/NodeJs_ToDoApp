import express from "express";
import dotenv from "dotenv";
import UserRouter from "./routes/user.js"
import TaskRouter from "./routes/task.js"
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middlewares/error.js";
import cors from "cors"
dotenv.config({
    path:"./data/.env"
});

// middlewares

export const app = express();
 app.get("/", (req,res)=>{
    res.end("lol")
 });

 
//  Middlewares 
 app.use(express.urlencoded({extended:true}))
 app.use(express.json())
 app.use(cookieParser());
 app.use(cors({
    origin:[process.env.FRONTEND_URL],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}))

 app.use("/api/user",UserRouter)
 app.use("/api/task",TaskRouter)
 app.use(ErrorMiddleware);