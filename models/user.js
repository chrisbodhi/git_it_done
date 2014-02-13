'use strict';
var mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  nconf = require('nconf'),

var userModel = function () {

  var userSchema = mongoose.Schema({
    name: String,
    login: { type: String, unique: true}, 
    password: String,
    role: String
  });

  userSchema.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password')) {
      next();
      return;
    }

    var DIFFICULTY = (nconf.get('bcrypt') && nconf.get('bcrypt').difficulty) || 8;
    
    var hashedPwd = bcrypt.hashSync(user.password, DIFFICULTY);

    user.password = hashedPwd;

    next();
  });

  userSchema.methods.passwordMatches = function (plainText) {
    var user = this;
    return bcrypt.compareSync(plainText, user.password);
  }

  return mongoose.model('User', userSchema);
};

module.exports = new userModel();