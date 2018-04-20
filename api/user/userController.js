// Load User model
const User = require("./userModel");

// GET
exports.get = (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) {
      next(err);
    } else {
      res.json(users);
    }
  });
};

// GET ONE
exports.getOne = (req, res, next) => {
  User.findById({ _id: req.params.id }, (err, user) => {
    if (!user) {
      res.json({ message: "No user with that id" });
    } else {
      res.json(user);
    }
  });
};

// PUT
exports.put = (req, res, next) => {
  User.findByIdAndUpdate({ _id: req.params.id }, req.body, (err, user) => {
    if (err) {
      next(err);
    } else {
      res.json({
        success: true,
        message: "User updated"
      });
    }
  });
};

// DELETE
exports.delete = (req, res, next) => {
  User.findByIdAndRemove({ _id: req.params.id }, (err, user) => {
    if (err) {
      next(err);
    } else {
      res.json({
        success: true,
        message: "User deleted"
      });
    }
  });
};
