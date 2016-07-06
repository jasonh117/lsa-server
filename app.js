var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var session = require('client-sessions');
var fileUpload = require('express-fileupload');

var User = require('./models/user');

var routes = require('./routes/index');
var api = require('./routes/api');
var register = require('./routes/register');
var login = require('./routes/login');
var about = require('./routes/about');
var chat = require('./routes/chat');

var mongoose = require('mongoose');
var mongoURL = 'mongodb://localhost/lazyapp';
mongoose.connect(mongoURL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("succesfully connected to mongo at: " + mongoURL);
});

var app = express();
app.use(cors());
// app.use(fileUpload());
//
// app.post('/upload', function(req, res) {
// 	var sampleFile;
//
// 	if (!req.files) {
// 		res.send('No files were uploaded.');
// 		return;
// 	}
//
// 	sampleFile = req.files.sampleFile;
// 	sampleFile.mv('./public/images/temp.png', function(err) {
// 		if (err) {
// 			res.status(500).send(err);
// 		}
// 		else {
// 			res.send('File uploaded!');
// 		}
// 	});
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  cookieName: 'session',
  secret: 'gerbnagujkrealghrieogeasrgaerhjklgaerhqnqlhk',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    User.findOne({ email: req.session.user.email }, function(err, user) {
      if (user) {
        req.user = user;
        delete req.user.password; // delete the password from the session
        req.session.user = user;  //refresh the session value
        // res.locals.user = user;
      }
      // finishing processing the middleware and run the route
      next();
    });
  } else {
    next();
  }
});

app.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect('/');
});

app.use('/', routes);
app.use('/api', api);
app.use('/register', register);
app.use('/login', login);
app.use('/about', about);
app.use('/chat', chat);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
