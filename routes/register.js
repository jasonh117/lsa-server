var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET register page. */
router.get('/', function(req, res, next) {
  res.render('register', { title: 'Lazy Student App', failed: false });
});

router.post('/', function(req, res) {
  User.findOne({ email: req.body.email }, function (err, object) {
    if (!object) {
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
          req.session.user = user;
          res.redirect('/');
        });
    } else {
        // account with email already exists
        res.render('register', { title: 'Lazy Student App', failed: true });
    }
  });
});

module.exports = router;
