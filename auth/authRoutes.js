const router = require("express").Router();
const controller = require("./authController");
const auth = require("./auth");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const configurePassport = require("../config/passport");

// Authentication sign in route
router.route("/signin").post(controller.signin);

// Sign up
router.route("/signup").post(controller.signup);

// OAuth Facebook
router
  .route("/facebook")
  .post(
    passport.authenticate("facebook-token", { session: false }),
    controller.facebookOAuth
  );

// OAuth Google
router
  .route("/google")
  .post(
    passport.authenticate("google-plus-token", { session: false }),
    controller.googleOAuth
  );

// Password recovery
router.route("/forgot").post(controller.passwordRecovery);

// Passwrod reset
router
  .route("/reset/:token")
  .get(controller.getPasswordReset)
  .post(controller.postPasswordReset);

module.exports = router;
