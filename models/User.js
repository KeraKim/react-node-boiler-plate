const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxLength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastName: {
    type: String,
    maxLength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
  },
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, callback) {
  bcrypt.compare(plainPassword, this.password, function (error, isMatch) {
    if (error) return callback(error);
    callback(null, isMatch);
  });
};

userSchema.methods.generateToken = function (callback) {
  const user = this;
  const token = jwt.sign(user._id.toHexString(), 'secretToken');
  user.token = token
  user.save(function (error, user) {
    if(error) return callback(error)
    callback(null, user)
  })
}

userSchema.statics.findByToken = function (token, callback) {
  const user = this;

  jwt.verify(token, 'secretToken', function(error, userId) {

    user.findOne({
      _id : userId,
      token : token
    }, function (error, user) {
      if(error) return callback(error)
      callback(null, user)
    })
  });
}

const User = mongoose.model("User", userSchema);

module.exports = { User };
