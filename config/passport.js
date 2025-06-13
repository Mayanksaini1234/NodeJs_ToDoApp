import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { user } from "../models/user.js"
import dotenv from "dotenv";
dotenv.config();


passport.use(

  new GoogleStrategy(

    {

      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/user/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let User = await user.findOne({ googleId: profile.id });

        if (!User) {
          User = await user.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
          });
        }

        return done(null, User);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);
