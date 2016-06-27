var express = require('express');
var router = express.Router();
var Chat = require('../models/chat');
var io = require('../socketio');

router.get('/', function(req, res) {
    Chat.find(function(err, chats) {
        res.json({data: chats});
    });
});

router.post('/', function(req, res) {
    var data = {
        body: req.body.msg,
        author: {id: req.user._id, name: req.user.name}
    };
    var chat = new Chat(data);
    chat.save(function(err, chat) {
        if(err) {
            console.error(err);
        } else {
            io.emit('chat message', chat);
        }
    });
});

module.exports = router;
