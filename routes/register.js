var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.post('/', function(req, res) {
  User.find({ email: req.body.email }, function (err, object) {
    if (object[0] == undefined) {
        var user = new User(
          {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          }
        );

        user.save(function (err, card) {
          if (err)
            console.log(err);
          res.redirect('/');
        });
    } else {
        // account with email already exists
        res.redirect('/');
    }
  });
});

module.exports = router;
