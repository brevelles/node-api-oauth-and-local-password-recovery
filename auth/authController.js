// Load dependencies
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const async = require("async");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const mailUser = config.mailUser;
const mailPass = config.mailPass;
const mailHost = config.mailHost;
const mailPort = config.mailPort;
const mailTo = config.mailTo;

// Load User model
var User = require("../api/user/userModel");

// Sign in
exports.signin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.getUserByEmail(email, (err, user) => {
    if (err) {
      res.send(err);
    }
    if (!user) {
      res.json({ success: false, message: "User not found" });
    } else {
      // Check user password
      User.comparePassword(password, user.local.password, (err, isMatch) => {
        if (err) {
          console.log(err);
        }
        if (isMatch) {
          // Create token
          const signToken = jwt.sign(user.toJSON(), config.secret, {
            expiresIn: config.expireTime
          });

          res.json({
            success: true,
            message: "User authenticated",
            token: signToken,
            user: {
              id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              username: user.username,
              email: user.email
            }
          });
        } else {
          res.json({ success: false, message: "Wrong password" });
        }
      });
    }
  });
};

// Sign up
exports.signup = (req, res, next) => {
  const newUser = User({
    method: "local",
    local: {
      email: req.body.email,
      password: req.body.password
    }
  });
  console.log(newUser.local.email);
  // validation
  if (newUser.local.email === "" || newUser.local.password === "") {
    res.json({
      success: false,
      message: "There are some errors"
    });
  } else {
    newUser.save(newUser, (err, user) => {
      if (err) {
        next(err);
      } else {
        res.json({
          success: true,
          message: "User saved",
          emaile: user.local.email
        });
      }
    });
  }
};

// Google OAuth
exports.googleOAuth = (req, res, next) => {
  const signToken = jwt.sign(req.user.toJSON(), config.secret, {
    expiresIn: config.expireTime
  });
  res.json({
    success: true,
    message: "User authenticated",
    token: signToken
  });
};

// Facebook OAuth
exports.facebookOAuth = (req, res, next) => {
  const signToken = jwt.sign(req.user.toJSON(), config.secret, {
    expiresIn: config.expireTime
  });
  res.json({
    success: true,
    message: "User authenticated",
    token: signToken
  });
};

// Password recovery
exports.passwordRecovery = (req, res, next) => {
  // async watterfall to prevent too many callbacks
  async.waterfall(
    [
      // Create random token
      done => {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString("hex");
          done(err, token);
          console.log("generated token", token);
        });
      },
      // Search user email in database
      (token, done) => {
        User.findOne({ "local.email": req.body.email }, function(err, user) {
          // if user is not found send error message
          if (!user) {
            res.json({ message: "User with that email doesnt' exist" });
          }
          // if user is found asign token properties to user
          user.local.resetPasswordToken = token;
          // set token expiration time to 1 hour
          user.local.resetPasswordExpires = Date.now() + 3600000;
          // save user
          user.save(err => {
            done(err, token, user);
          });
        });
      },

      // send email with url+token to user
      function(token, user, done) {
        let transporter = nodemailer.createTransport({
          host: mailHost,
          port: mailPort,
          secure: false, // true for 465, false for other ports
          auth: {
            user: mailUser,
            pass: mailPass
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        var mailOptions = {
          to: user.local.email,
          from: "Password Reset",
          subject: "Reset Password",
          text:
            "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
            "http://" +
            req.headers.host +
            "/auth/reset/" +
            token +
            "\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n"
        };
        transporter.sendMail(mailOptions, function(err) {
          console.log(
            "info",
            "An e-mail has been sent to " +
              user.local.email +
              " with further instructions."
          );
          done(err, "done");
        });
      }
    ],
    err => {
      // if error return the error
      if (err) {
        return next(err);
      }
    }
  );
};

// GET Password reset
exports.getPasswordReset = (req, res) => {
  console.log(req.params.token);
  // search resetPasswordToken in the DB
  User.findOne(
    {
      "local.resetPasswordToken": req.params.token,
      "local.resetPasswordExpires": { $gt: Date.now() }
    },
    (err, user) => {
      // if token isn't found - send error
      if (!user) {
        res.json({
          success: false,
          message: "The token isn't valid, please try again"
        });
      } else {
        // if token is found send response
        res.json({
          success: true,
          message: "Token found"
        });
      }
    }
  );
};

// POST Password reset
exports.postPasswordReset = (req, res) => {
  async.waterfall([
    done => {
      // search resetPasswordToken in the DB
      User.findOne(
        {
          "local.resetPasswordToken": req.params.token,
          "local.resetPasswordExpires": { $gt: Date.now() }
        },
        (err, user) => {
          // if token isn't found - error
          if (!user) {
            res.json({
              success: false,
              message: "The token isn't valid, please try again"
            });
          } else {
            // validate password
            if (req.body.password === "" || req.body.password === undefined) {
              res.json({
                success: false,
                message: "password can't be empty"
              });
            } else {
              // assign new properties
              user.local.password = req.body.password;
              user.local.resetPasswordToken = undefined;
              user.local.resetPasswordExpires = undefined;

              // save user
              user.save(err => {
                done(err, user);
                res.json({
                  success: true,
                  message: "The password has been updated"
                });
              });
            }
          }
        }
      );
    }
  ]);
};
