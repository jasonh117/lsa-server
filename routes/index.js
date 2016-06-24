var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session && req.session.user) {
        User.findOne({ email: req.session.user.email }, function (err, user) {
            if (user) {
                // Found session
                res.locals.user = user;
                res.render('index', { title: 'Lazy Student App', user: user.name });
            } else {
                // Failed to find session
                req.session.reset();
                res.render('index', { title: 'Lazy Student App', user: 'Login' });
            }
        });
    } else {
        res.render('index', { title: 'Lazy Student App', user: 'Login' });
    }
});

module.exports = router;
