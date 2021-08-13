const { Router } = require('express');
var express = require('express');
var router = express.Router();
var encryptionHelper = require('../helpers/encryption.js');
const Password=require('../models/password');


const contextService = require('request-context');
router.use(contextService.middleware('request'));

function IsLoggedIn(req,res,next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/login');
}
// save a model in put requests
router.put(function (req, res, next) {
  new Password(req.body).save((err, doc) => res.json(doc));
});




/* GET home page. */
router.get('/', (req, res, next) => {
 // res.render('index', { title: 'Express' });
 /* 
 Password.find((err, passwords) => {
    if(err){

    }
    else{
      res.render('index', {title: 'Forget it',
       dataset: passwords, user:req.user });
    }
  });*/
  res.render('index', {title: 'Forget it'});

});


/* GET home page. */
router.get('/list',IsLoggedIn, (req, res, next) => {
  
  //console.log(req);
  //console.log(req.user);
  //console.log(contextService.get('password'));
  //console.log(contextService.get('request:password'))


   Password.find({userId: req.user._id },function(err, passwords) {
     if(err){
      console.log(err);
     }
     else{
      //const pasword = contextService.get('request:password');

      //console.log(pasword);
      //contextService.set('request:password', req.body.password);

        var count = Password.countDocuments({userId: req.user._id}).then((mycount) => {
          res.render('list', {title: 'List of passwords',
          dataset: passwords, count: mycount, user:req.user });

        });


     }
   } 
   );
 
 });




/** 
router.get('/news', function(req, res, next) {
  res.render('news', { title: 'Add new password here' });
});

*/









router.get('/add', IsLoggedIn, function(req, res, next) {
  res.render('add', { title: 'Add new password here' });
});

//POST:
router.post('/add', IsLoggedIn, function(req, res, next) {

  console.log("userId: ", req.user._id);
  Password.create({
    //data
    userId:req.user._id,
    userName:req.body.username,
    userPassword: req.body.password,
    website: req.body.website

  }, (err, newDoc) => {
      if(err){
        console.log(err);
      }
      else{
        res.redirect('/list');
      }
  });
});


//DELETE
router.get('/delete/:_id',IsLoggedIn, function(req, res, next){
    Password.remove({_id: req.params._id }, (err) => {
      if(err){

      }
      else {
        res.redirect('/list');
      }
    });

});


//EDIT

router.get('/edit/:_id',IsLoggedIn, (req, res, next) => {

  //console.log("EK in Edit (GET)", encryptionKey);

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
      userId: req.user._id,
      userName:req.body.username,
      userPassword: req.body.password,
      website: req.body.website
  }, (err, updatedPassword) =>{    
    if(err){

    }
    else {
      res.redirect('/list');
    }
  });
});

//-------------------



//Add the middleware 
router.all(function(req, res, next) {
  if(IsLoggedIn){

  var password = "123";

    contextService.set('request:password', password);
    
  }
  next();
})


const User = require('../models/user');
const passport = require('passport');




router.get('/login', function(req, res, next) {
  res.render('AuthN/login', { title: 'Login' });
});

router.post('/login',
passport.authenticate('local', {
  failureRedirect: '/login',
  failueMessage: 'Invalid Credentials'
}), function(req, res) {
  //save text value of the password to the context so we can use it later as a key to hash user's passwords
  contextService.set('request:password', req.body.password);

  encryptionHelper.setEncKey(req.body.password);
  //console.log("Stored EK: ", encryptionKey);
  
  res.redirect('/list');
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});


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
            contextService.set('request:password', req.body.password);
            res.redirect('/');
          })
        }
    }
  );
   
});











module.exports = router;
