// Load the module dependencies
const passport = require("passport");
const url = require("url");
//const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const GooglePlusTokenStrategy = require("passport-google-plus-token");
const config = require("../config");
const User = require("../../api/user/userModel");
const users = require("../../api/user/userController");

// Create the Google strategy configuration method
module.exports = function() {
  passport.use(
    new GooglePlusTokenStrategy(
      {
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        passReqToCallback: true
      },
      (req, accessToken, refreshToken, profile, done) => {
        // Try finding a user document that was registered using the current OAuth provider
        User.findOne({ "google.id": profile.id }, (err, user) => {
          // If an error occurs continue
          if (err) {
            return done(err);
          } else {
            // If a user could not be found, create a new user
            if (!user) {
              const newUser = new User({
                method: "google",
                google: {
                  id: profile.id,
                  email: profile.emails[0].value
                }
              });
              newUser.save();
            } else {
              // If the user is found, continue
              return done(err, user);
            }
          }
        });
      }
    )
  );
};
