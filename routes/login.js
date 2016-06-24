var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/', function(req, res) {
  User.findOne({ email: req.body.email, password: req.body.password }, function (err, user) {
    if (user) {
      // Successfully login
      req.session.user = user;
      res.redirect('/');
    } else {
      // Failed to login
      res.redirect('/');
    }
  });
});

module.exports = router;
