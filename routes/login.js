var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/', function(req, res) {
  User.find({ email: req.body.email, password: req.body.password }, function (err, object) {
    if (object[0] != undefined) {
      // Successfully login
      res.redirect('/');
    } else {
      // Failed to login
      res.redirect('/');
    }
  });
});

module.exports = router;
