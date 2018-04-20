const router = require('express').Router();
const controller = require('./itemController');
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.route('/')
  .get(controller.get)
  .post(controller.post)

router.route('/:id')
  .get(controller.getOne)
  .put(controller.put)
  .delete(controller.delete)

module.exports = router;