const router = require("express").Router();
const controller = require("./userController");
const passport = require("passport");
const jwt = require("jsonwebtoken");

// Users route
router
  .route("/")
  .get(controller.get);

// Single user routes
router
  .route("/:id")
  .get(controller.getOne)
  .put(controller.put)
  .delete(controller.delete);

module.exports = router;
