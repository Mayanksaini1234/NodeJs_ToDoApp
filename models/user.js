import mongoose from "mongoose";

const user_schema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true
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
        // ye db mai show nii krega 
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
});

export const user = mongoose.model("users", user_schema);
