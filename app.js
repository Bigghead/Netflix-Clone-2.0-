const express = require('express'), 
      path    = require('path'), 
      favicon = require('serve-favicon'), 
      logger  = require('morgan'), 
      cookieParser = require('cookie-parser'), 
      bodyParser = require('body-parser'), 
      passport = require('passport'), 
      passportConfig = require('./server/passportConfig.js')


const index = require('./routes/index'),
      users = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../client/dist')));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
  next();
});

app.use(passportConfig);


app.get('/login',
  passport.authenticate('auth0'), function (req, res) {
    console.log('Testing Auth, 1');
  });

app.get('/callback',
  passport.authenticate('auth0'), function (req, res) {
    res.redirect('http://localhost:4200/movies?loggedIn=true');
  });

  app.get('/checkAuth', (req, res, next) => {
    if(req.isAuthenticated()){
      next();
    } else {
      res.send('not authorized')
    }
  }, (req, res) => {
    res.send(req.user);
  })

// app.use('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/dist/index.html'));
// })
// app.get('/', function(req, res) {
//   res.sendFile(path.join(__dirname, '../client/src/index.html'));
// });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, () => console.log('listening on 3000'));

module.exports = app;
