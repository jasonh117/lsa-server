var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res) {
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
});

module.exports = router;
