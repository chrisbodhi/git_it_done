'use strict';

var User = require('../models/user'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

exports.config = function (settings) {
  // Page intentionally left blank
};

exports.localStrategy = function () {

  return new LocalStrategy(function (username, password, done) {

    User.findOne({login: username}, function (err, user) {

      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, { message: 'Login not found' });
      }

      if (!user.passwordMatches(password)) {
        return done(null, false, { message: 'Wrong password' });
      }

      done(null, user);

    });
  });
};

exports.isAuthenticated = function (role) {

  return function (req, res, next) {

    if (!req.isAuthenticated()) {

      req.session.goingTo = req.url;
      res.redirect('/login');
      return;
    }

    if (role && req.user.role !== role) {
      res.status(401);
      res.render('errors/401');
      return;
    }

    next();
  };
};

exports.injectUser = function (req, res, next) {

  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};

// Via scotch.io tutorial

exports.signup = function() {
  // Signup users locally
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    process.nextTick(function() {
      User.findOne({ 'local.email' : email }, function(err, user) {
        if (err)
          return done(err);

        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {
          var newUser = new User();

          newUser.local.email = email;
          newUser.local.password = password;

          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  })
)};
