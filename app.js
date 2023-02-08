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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter, limiter, cors(corsOptions));
app.use('/users', usersRouter, limiter, cors(corsOptions));
app.use("/formations", formationsRouter, limiter, cors(corsOptions));
app.use("/chapitres", chapitreRouter, limiter, cors(corsOptions));
app.use("/exercices", exerciceRouter, limiter, cors(corsOptions));
app.use("/answers", answerRouter, limiter, cors(corsOptions));
app.use("/logs", logsRouter, limiter, cors(corsOptions));
app.use("/roles", roleRouter, limiter, cors(corsOptions));
app.use("/formuserprogress", formUserProgressRouter, limiter, cors(corsOptions));
app.use("/tokens", tokenRouter, limiter, cors(corsOptions));


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
