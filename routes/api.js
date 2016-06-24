var express = require('express');
var router = express.Router();
var Card = require('../models/card');

router.get('/', function(req, res, next) {
  Card.find(function(err, object) {
    if (err) {
      console.log(err);
    } else {
      res.json({
        data: object
      });
    }
  });
});

router.post('/', function(req, res) {
  var card = new Card(
    {
      title: req.body.title,
      body: req.body.body,
      tags: req.body.tags
    }
  );
  card.save(function (err, card) {
    if (err) {
      console.log(err);
    } else {
      res.json({
        data: card
      });
    }
  });
});

router.patch('/:id', function(req, res) {
  Card.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, object) {
    if (err) {
      console.log(err);
    } else {
      res.json({
        data: object
      });
    }
  });
});

router.delete('/:id', function(req, res) {
  Card.remove({ _id: req.params.id }, function(err) {
    if (err) {
      console.log(err);
    } else {
      res.end();
    }
  });
});

module.exports = router;
