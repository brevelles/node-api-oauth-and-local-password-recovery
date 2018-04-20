// Load dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

// Define User Schema Model
var UserSchema = new Schema({
  // Authentication methods
  method: {
    type: String,
    enum: ["local", "google", "facebook"],
    required: true
  },
  local: {
    email: {
      type: String,
      lowercase: true,
      unique: true
    },
    password: {
      type: String
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpires: {
      type: Date
    }
  },
  google: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  },
  facebook: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  }
});

// User pre-save middleware (password hashing)
UserSchema.pre("save", function(next) {
  // Reference the newUser
  let newUser = this;
  // If the method isn't local don't do anything
  if (newUser.method !== "local") {
    return next();
  } else {
    // Hash password
    if (!newUser.local.isModified("password") || newUser.local.password.isNew) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.local.password, salt, (err, hash) => {
          // Assign hash to user password
          newUser.local.password = hash;
          next();
        });
      });
    } else {
      // if password isn't modified go to next
      return next();
    }
  }
});

// Custom UserSchema methods
// Get user by id
UserSchema.statics.getUserById = function(id, callback) {
  this.findById(id, callback);
};
// Get user by username
UserSchema.statics.getUserByUsername = function(username, callback) {
  const query = { username: username };
  this.findOne(query, callback);
};
// Get user by username
UserSchema.statics.getUserByEmail = function(email, callback) {
  const query = { "local.email": email };
  this.findOne(query, callback);
};
// Compare passwords
UserSchema.statics.comparePassword = function(
  candidatePassword,
  hash,
  callback
) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err) {
      return err;
    }
    callback(null, isMatch);
  });
};

// Export the model
module.exports = mongoose.model("User", UserSchema);
