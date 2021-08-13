const { Router } = require('express');
var express = require('express');
var router = express.Router();
var encryptionHelper = require('../helpers/encryption.js');
const Password=require('../models/password');
const User = require('../models/user');
const passport = require('passport');


function IsLoggedIn(req,res,next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/login');
}


/* GET home page  */
router.get('/', (req, res, next) => {
  res.render('index', {title: 'Forget it'});

});


/* GET list page. */
router.get('/list',IsLoggedIn, (req, res, next) => {
   Password.find({userId: req.user._id },function(err, passwords) {
     if(err){
      console.log(err);
     }
     else{
        var count = Password.countDocuments({userId: req.user._id}).then((mycount) => {
          res.render('list', {title: 'List of passwords',
          dataset: passwords, count: mycount, user:req.user });
        });
      }
  });
 });


/** Local authentication 
* GET list page. 
*/
router.get('/login', function(req, res, next) {
  res.render('AuthN/login', { title: 'Login' });
});


/* POST login page. */
router.post('/login',
passport.authenticate('local', {
  failureRedirect: '/login',
  failueMessage: 'Invalid Credentials'
}), function(req, res) {
  //If user sign in successfuly save the EncrKey (password) to the encHelper
  encryptionHelper.setEncKey(req.body.password);
  res.redirect('/list');
});

/* GET logout page. */
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
  //clean the encKey
  encryptionHelper.cleanEncKey();
});


/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('AuthN/register', { title: 'register' });
});

/* POST register page. */
router.post('/register', function(req, res, next) {
  User.register(
    new User({username: req.body.username}),
    req.body.password,
    (err, newUser) =>{
        if(err){
          console.log(err);
          return res.redirect('/register');
        }
        else{
          //log the user in and send them to their passwords
          req.login(newUser, (err) =>{
            //If user sign in successfuly save the EncrKey (password) to the encHelper
            encryptionHelper.setEncKey(req.body.password);
            res.redirect('/');
          })
        }
    }
  );
});


/** GITHUB authentication */

/* GET logout  */
router.get('/logout', (req, res, next) => {
  // log the user out using the request object
  req.logout();
  // send them back to login
  res.redirect('/login');
});


// GET github
router.get('/github', passport.authenticate('github', { scope: ["user.email"] }));


// GET github/callback
router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login'}),
  (req, res, next) => {
    res.redirect('/');
  }
);


module.exports = router;
