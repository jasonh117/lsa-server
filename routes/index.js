var express = require('express');
var router = express.Router();
var User = require('../models/user');

function requireLogin (req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
};

/* GET home page. */
router.get('/', requireLogin, function(req, res, next) {
    res.render('index', { title: 'Lazy Student App', user: req.user.name });
});

module.exports = router;
