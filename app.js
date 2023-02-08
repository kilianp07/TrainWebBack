var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var rateLimit = require ('express-rate-limit')
var cors = require('cors')

var whitelist = [
  'http://0.0.0.0:4200',
];
var corsOptions = {
  origin: function(origin, callback){
      var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
      callback(null, originIsWhitelisted);
  },
  credentials: true
};

const limiter = rateLimit({
	windowMs: process.env.REQUEST_TIME_WINDOW_MS, // 15 minutes
	max: process.env.MAX_REQUESTS_PER_WINDOW, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var formationsRouter = require('./routes/formations');
var chapitreRouter = require('./routes/chapitres');
var exerciceRouter = require('./routes/exercices');
var answerRouter = require('./routes/answer');
var logsRouter = require('./routes/logs');
var roleRouter = require('./routes/roles');
var formUserProgressRouter = require('./routes/formuserprogress');
var tokenRouter = require('./routes/token');

var app = express();

//CORS middleware
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'example.com');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter, limiter, allowCrossDomain);
app.use('/users', usersRouter, limiter, allowCrossDomain);
app.use("/formations", formationsRouter, limiter, allowCrossDomain);
app.use("/chapitres", chapitreRouter, limiter, allowCrossDomain);
app.use("/exercices", exerciceRouter, limiter, allowCrossDomain);
app.use("/answers", answerRouter, limiter, allowCrossDomain);
app.use("/logs", logsRouter, limiter, allowCrossDomain);
app.use("/roles", roleRouter, limiter, allowCrossDomain);
app.use("/formuserprogress", formUserProgressRouter, limiter, allowCrossDomain);
app.use("/tokens", tokenRouter, limiter, allowCrossDomain);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
