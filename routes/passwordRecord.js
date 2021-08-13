const {
  Router
} = require('express');
var express = require('express');
var router = express.Router();
var encryptionHelper = require('../helpers/encryption.js');
const Password = require('../models/password');

function IsLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}


/* GET add page. */
router.get('/add', IsLoggedIn, function (req, res, next) {
  res.render('add', {
    title: 'Add new password here'
  });
});

/* POST add  */
router.post('/add', IsLoggedIn, function (req, res, next) {
  Password.create({
    userId: req.user._id,
    userName: req.body.username,
    userPassword: req.body.password,
    website: req.body.website

  }, (err, newDoc) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/list');
    }
  });
});


/* GET delete page. */
router.get('/delete/:_id', IsLoggedIn, function (req, res, next) {
  Password.remove({
    _id: req.params._id
  }, (err) => {
    if (err) {} else {
      res.redirect('/list');
    }
  });

});

/* GET edit page. */
router.get('/edit/:_id', IsLoggedIn, (req, res, next) => {
  Password.findById(req.params._id, (err, password) => {
    if (err) {} else {
      res.render('edit', {
        record: password
      });
    }
  })
});

/* POST edit page. */
router.post('/edit/:_id', IsLoggedIn, (req, res, next) => {
  Password.findOneAndUpdate({
    _id: req.params._id
  }, {
    userId: req.user._id,
    userName: req.body.username,
    userPassword: req.body.password,
    website: req.body.website
  }, (err, updatedPassword) => {
    if (err) {

    } else {
      res.redirect('/list');
    }
  });
});



module.exports = router;