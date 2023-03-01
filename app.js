var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var rateLimit = require ('express-rate-limit')
var cors = require('cors')
const Sentry = require('@sentry/node');
const Tracing = require("@sentry/tracing");


Sentry.init({
  dsn: "https://8560fc1300d7448d8db839e3d340fe04@o4504762869809152.ingest.sentry.io/4504762909720576",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});



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


// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter, limiter, cors());
app.use('/users', usersRouter, limiter, cors());
app.use("/formations", formationsRouter, limiter, cors());
app.use("/chapitres", chapitreRouter, limiter, cors());
app.use("/exercices", exerciceRouter, limiter, cors());
app.use("/answers", answerRouter, limiter, cors());
app.use("/logs", logsRouter, limiter, cors());
app.use("/roles", roleRouter, limiter, cors());
app.use("/formuserprogress", formUserProgressRouter, limiter, cors());
app.use("/tokens", tokenRouter, limiter, cors());


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
