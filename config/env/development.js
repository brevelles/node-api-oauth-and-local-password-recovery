// Load .env variables
require("dotenv").config();
const host = process.env.DB_HOST,
  username = process.env.DB_USER,
  password = process.env.DB_PASS,
  database = process.env.DB_NAME,
  secret = process.env.DB_JWT_SECRET,
  googleID = process.env.DB_Google_ID,
  googleSecret = process.env.DB_Google_SECRET,
  googleCallback = process.env.DB_Google_CALLBACK,
  facebookID = process.env.DB_Facebook_ID,
  facebookSecret = process.env.DB_Facebook_SECRET,
  facebookCallback = process.env.DB_Facebook_CALLBACK,
  twitterID = process.env.DB_Twitter_ID,
  twitterSecret = process.env.DB_Twitter_SECRET,
  twitterCallback = process.env.DB_Twitter_CALLBACK,
  mailUser = process.env.DB_MAIL_USER,
  mailPass = process.env.DB_MAIL_PASS,
  mailHost = process.env.DB_MAIL_HOST,
  mailPort = process.env.DB_MAIL_PORT,
  mailTo = process.env.DB_MAIL_TO;

module.exports = {
  port: 3000,
  db: database,
  secret: secret,
  uri: `mongodb://${username}:${password}@${host}:27017/${database}`,
  logging: true,
  expireTime: 86400, // 1 day in seconds
  facebook: {
    clientID: facebookID,
    clientSecret: facebookSecret,
    callbackURL: facebookCallback
  },
  google: {
    clientID: googleID,
    clientSecret: googleSecret,
    callbackURL: googleCallback
  },
  twitter: {
    clientID: twitterID,
    clientSecret: twitterSecret,
    callbackURL: twitterCallback
  },
  mailUser: mailUser,
  mailPass: mailPass,
  mailHost: mailHost,
  mailPort: mailPort,
  mailTo: mailTo
};
