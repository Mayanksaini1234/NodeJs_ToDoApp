import mongoose from "mongoose";

const user_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false,
        select: true
        // ye db mai show nii krega / ya krega  
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
        // ✅ unique + sparse means:
        // - unique for Google users
        // - normal users can have googleId empty/null without error
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpiry: {
        type: Date
    }
});

export const user = mongoose.model("users", user_schema);
