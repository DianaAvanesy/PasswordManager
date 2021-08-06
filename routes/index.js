const { Router } = require('express');
var express = require('express');
var router = express.Router();

function IsLoggedIn(req,res,next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/login');
}



/* GET home page. */
router.get('/', IsLoggedIn, (req, res, next) => {
 // res.render('index', { title: 'Express' });
  Password.find((err, passwords) => {
    if(err){

    }
    else{
      res.render('index', {title: 'List of passwords',
       dataset: passwords, user:req.user });
    }
  });

});


router.get('/add', IsLoggedIn, function(req, res, next) {
  res.render('add', { title: 'Add new password here' });
});

//POST:
const Password=require('../models/password');
router.post('/add', IsLoggedIn, function(req, res, next) {
  Password.create({
    //data
    userId:req.body.user,
    userName:req.body.username,
    userPassword: req.body.password
  }, (err, newDoc) => {
      if(err){
        console.log(err);
      }
      else{
        res.redirect('/add')
      }
  });
});


//DELETE
router.get('/delete/:_id',IsLoggedIn, function(req, res, next){
    Password.remove({_id: req.params._id }, (err) => {
      if(err){

      }
      else {
        res.redirect('/');
      }
    });

});


//EDIT

router.get('/edit/:_id',IsLoggedIn, (req, res, next) => {
  Password.findById(req.params._id, (err, password) =>{    
    if(err){

    }
    else {
      res.render('edit', {project: password});
    }

  })

})


router.post('/edit/:_id',IsLoggedIn, (req, res, next) => {
  Password.findOneAndUpdate({

    _id: req.params._id

  },
  {
      userId:req.body.user,
      userName:req.body.username,
      userPassword: req.body.password
  }, (err, updatedProject) =>{    
    if(err){

    }
    else {
      res.redirect('/');
    }

  });

});

//-------------------
const User = require('../models/user');
const passport = require('passport');

router.get('/login', function(req, res, next) {
  res.render('AuthN/login', { title: 'Login' });
});
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failueMessage: 'Invalid Credentials'
}));



router.get('/register', function(req, res, next) {
  res.render('AuthN/register', { title: 'register' });
});
router.post('/register', function(req, res, next) {
 //User
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
            res.redirect('/');
          })
        }
    }
  );
});











module.exports = router;
