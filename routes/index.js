const { Router } = require('express');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
 // res.render('index', { title: 'Express' });
  Password.find((err, passwords) => {
    if(err){

    }
    else{
      res.render('index', {title: 'List of passwords', dataset: passwords });
    }
  });

});


router.get('/add', function(req, res, next) {
  res.render('add', { title: 'Add new password here' });
});

//POST:
const Password=require('../models/password');
router.post('/add', function(req, res, next) {
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
router.get('/delete/:_id', function(req, res, next){
    Password.remove({_id: req.params._id }, (err) => {
      if(err){

      }
      else {
        res.redirect('/');
      }
    });

});


//EDIT

router.get('/edit/:_id', (req, res, next) => {
  Password.findById(req.params._id, (err, password) =>{    
    if(err){

    }
    else {
      res.render('edit', {project: password});
    }

  })

})


router.post('/edit/:_id', (req, res, next) => {
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

module.exports = router;
