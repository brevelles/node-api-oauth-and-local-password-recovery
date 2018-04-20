// Load dependencies
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const passport = require("passport");

// Import configuration
const config = require("./config/config");
const port = config.port;
const database = config.db;
const databaseUri = config.uri;
const logging = config.logging;
const api = require("./api/api");
const auth = require("./auth/auth");
const configurePassport = require("./config/passport");

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to database
mongoose.Promise = global.Promise;
mongoose.connect(
  databaseUri,
  {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE
  },
  err => {
    if (err) {
      console.log("Failed to connect to database " + config.db + ": " + err);
    }
    if (logging) {
      console.log("Connected to database " + config.db);
    }
  }
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport strategies
require("./config/passport.js")(passport);
require("./config/strategies/facebook.js")();
require("./config/strategies/google.js")();

// Routes
app.use("/api", api);
app.use("/auth", auth);

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

// Use logger in development
if (logging) {
  app.use(morgan("dev"));
}

app.listen(port, () => {
  if (logging) {
    console.log(
      "App running on port " +
        config.port +
        ". Environment: " +
        process.env.NODE_ENV +
        ". Database: " +
        config.uri
    );
  }
});
