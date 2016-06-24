var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Lazy Student App', failed: false });
});

router.post('/', function(req, res) {
  User.findOne({ email: req.body.email, password: req.body.password }, function (err, user) {
    if (user) {
      // Successfully login
      req.session.user = user;
      res.redirect('/');
    } else {
      // Failed to login
      res.render('login', { title: 'Lazy Student App', failed: true });
    }
  });
});

module.exports = router;
