var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');
const favicon = require('express-favicon');
hbs.registerPartials(__dirname + '/views/partials');

const mongoose = require('mongoose');
//set up config file
const config = require('./config/config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articleRouter = require('./routes/article');
var passwordRouter = require('./routes/passwordRecord');

const sesssion = require('express-session');
const passport = require('passport');
const githubStrategy = require('passport-github2').Strategy;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'public/images')));

app.use(favicon(__dirname + '/public/images/favicon.png'));

//passswords
app.use(sesssion({
  secret: 'passwordManager',
  resave: false,
  saveUninitialized: true
}));
//init passport
app.use(passport.initialize());
//passport uses the config session: express-session
app.use(passport.session());

app.use(function(req, res, next){
  res.locals.isAuthenticated = req.isAuthenticated();
  next()
});


//Link passport to the user model
const User = require('./models/user');
//use default local strategy > username/password
passport.use(User.createStrategy())

passport.use(new githubStrategy({
  clientID: config.github.clientId,
  clientSecret: config.github.clientSecret,
  callbackURL: config.github.callbackUrl

},
async (accessToken, refreshToken, profile, done) => {
  // determine if we already have a user in our DB
  const user = await User.findOne({ oauthID: profile.id });
  // Handle new or returning user
  if (user) {
    // returning user, already in my db
    return done(null, user);
  }
  else {
    // user doesn't exist in my db
    const newUser = new User(
      {
        username: profile.username,
        oauthID: profile.id,
        oauthProvider: 'Github'
      }        
    );
    const savedUser = await newUser.save();

    return done(null, savedUser);
  }
}
 ));

// set password to write/read data to/from session object
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/news', articleRouter);
app.use('/', passwordRouter);


let connectionString = config.db;
mongoose.connect(connectionString, { useNewUrlParser: true, useFindAndModify:true, useUnifiedTopology: true  })
.then((message) => {

})
.catch((err) => {
  console.log(err);
});

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
