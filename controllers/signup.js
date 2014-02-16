'use strict';

var SignupModel = require('../models/signup'),
  passport = require('passport'),
  User = require('../models/user'),
  flash = require('connect-flash'),
  db = require('../lib/database');

// Pulling values from the Signup form
var name = $('#username').val();
var email = $('#email').val();
var password = $('#password').val();
var confirm = $('#confirmPassword').val();

module.exports = function (app) {

    var model = new SignupModel();

    app.get('/signup', function (req, res) {
        res.render('signup', model);
    });

    app.post('/signup', function (req, res) {
      if ( password === confirmPassword ) {
        var user = new User({
          name: name,
          email: email,
          password: password,
        });
        console.log(req);
        user.save();
        res.redirect('/todo');
      } else {
        console.log(req);
        model.messages = req.flash('wrong pw');
        res.render('signup', model);
      }
    })

    // app.get('/logout', function (req, res) {
    //   req.logout();
    //   res.redirect('/');
    // });
};


// var u1 = new User({
//         name: "Kraken McSquid",
//         login: "kraken",
//         password: "password",
//         role: "admin"
//     });

// u1.save();
