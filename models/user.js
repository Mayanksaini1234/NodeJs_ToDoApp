import mongoose from "mongoose";

const user_schema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        select: true
        // ye db mai show nii krega / ya krega  
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
     googleId: {
        type: String,
    },
});

export const user = mongoose.model("users", user_schema);
