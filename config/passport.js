const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongodb = require('../db/connect');


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await mongodb.getDb().db('test').collection('Users').findOne({ 'googleId': profile.id });
        
        if (!user) {
          user = await mongodb.getDb().db('test').collection('Users').insertOne({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
          });
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);