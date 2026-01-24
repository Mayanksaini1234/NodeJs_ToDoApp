import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { user } from "../models/user.js"
import dotenv from "dotenv";
dotenv.config();

const isProd = process.env.NODE_ENV === "production"
passport.use(

  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: isProd ? "https://todoapppractice.onrender.com/api/user/google/callback" : "http://localhost:3000/api/user/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {

        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("No email found in Google profile"), false);
        }

        let User = await user.findOne({ email });

        if (User) {
          if (!User.googleId) {
            User.googleId = profile.id;
            await User.save();
          }

          return done(null, User);
        }

        User = await user.create({
          name: profile.displayName,
          email: email,
          googleId: profile.id,
        });

        return done(null, User);

      } catch (err) {
        return done(err, false);
      }
    }
  )
);
//  Both register and Login ! 