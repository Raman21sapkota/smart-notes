import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import * as userRepository from "../repositories/userRepository.js";


// configure passport to use google oauth 
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    async (accessToken, refreshToken, profile, done) => {
        try {

            const email = profile.emails[0].value;

            if (!email) {
                return done(null, false, { message: "No email found in Google profile" });
            }
            // check if user already exists in our database
            let user = await userRepository.findByEmail(email);

            // if (user ){
            // if (user && user.provider !== "google") {
            //   return done(null, false, { message: "Email already registered with a different provider." });   
            // }
            //}

            
            //console.log("User found:", user);


            //linking the google account to existing user if email matches but provider is different

            if (user) {

                if (!user.googleId) {
                    user = await userRepository.linkGoogleAccount(user.id, profile.id);
                }
                return done(null, user);
            }

            if (!user) {
                // create new user if not exists
                user = await userRepository.createUser({
                    email,
                    name: profile.displayName,
                    googleId: profile.id,
                    password: null,
                });
            }
            return done(null, user);

        } catch (error) {
            return done(error);
        }

    }
));

export default passport;




