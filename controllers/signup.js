'use strict';

var SignupModel = require('../models/signup'),
  passport = require('passport'),
  User = require('../models/user'),
  flash = require('connect-flash'),
  bcrypt = require('bcrypt'),
  auth = require('../lib/auth'),
  db = require('../lib/database');

// Pulling values from the Signup form
// ...this is actually accomplished in auth.js in the signup module. Nice try, past self.
// var name = $('#username').val();
// var email = $('#email').val();
// var password = $('#password').val();
// var confirm = $('#confirmPassword').val();

module.exports = function (app) {

    var model = new SignupModel();

    app.get('/signup', function (req, res) {
        res.render('signup', model);
    });

    // via scotch.io tutorial

    // app.post('/signup', passport.authenticate('local-signup', {
    //   success.redirect('/profile'),
    //   failure.redirect('/signup'),
    //   failureFlash: true
    // }));

    app.post('/signup', auth.signup(), function (req, res) {
      passport.authenticate('local-signup', {
        successRedirect: req.session.goingTo || '/profile',
        failureRedirect: '/signup',
        failureFlash: true
      })(req, res);
    });

    // First attempt - logic needs to go elsewhere
    // app.post('/signup', function (req, res) {
    //   if ( password === confirmPassword ) {
    //     var user = new User({
    //       name: name,
    //       email: email,
    //       password: password,
    //     });
    //     console.log(req);
    //     user.save();
    //     res.redirect('/todo');
    //   } else {
    //     console.log(req);
    //     model.messages = req.flash('wrong pw');
    //     res.render('signup', model);
    //   }
    // })
};


