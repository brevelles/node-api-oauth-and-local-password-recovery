// Load .env variables
require("dotenv").config();
const host = process.env.DB_HOST,
  username = process.env.DB_USER,
  password = process.env.DB_PASS,
  database = process.env.DB_NAME;

module.exports = {
  port: 3000,
  db: database,
  uri: `mongodb://${username}:${password}@${host}:27017/${database}`,
  logging: true
};
