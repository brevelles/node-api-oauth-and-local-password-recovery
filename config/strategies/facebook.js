// Load the module dependencies
const passport = require("passport");
const url = require("url");
//const FacebookStrategy = require("passport-facebook").Strategy;
const FacebookTokenStrategy = require("passport-facebook-token");
const config = require("../config");
const User = require("../../api/user/userModel");
const users = require("../../api/user/userController");

// Create the Facebook strategy configuration method
module.exports = function() {
  passport.use(
    new FacebookTokenStrategy(
      {
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        passReqToCallback: true
      },
      (req, accessToken, refreshToken, profile, done) => {
        // Try finding a user document that was registered using the current OAuth provider
        User.findOne({ "facebook.id": profile.id }, (err, user) => {
          if (err) {
            return done(err);
          } else {
            if (!user) {
              // If a user could not be found, create a new user
              const newUser = new User({
                method: "facebook",
                facebook: {
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
