var router = require('express').Router();

// api router mounts other routers
router.use('/users', require('./user/userRoutes'));
router.use('/items', require('./item/itemRoutes'));

module.exports = router;