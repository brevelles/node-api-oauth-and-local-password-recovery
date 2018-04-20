var router = require("express").Router();

// api router mounts other routers
router.use("/", require("./authRoutes"));

module.exports = router;
