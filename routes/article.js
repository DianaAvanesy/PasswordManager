const { Router } = require('express');
var express = require('express');
var router = express.Router();
const Article = require('../models/article');

/* GET home page. */
router.get('/', (req, res, next) => {

    Article.find((err, news) => {
        if(err){
        }
        else{
          res.render('news', {title: 'Latest News',
           dataset: news, user:req.user });
        }
    });   
});

module.exports = router;


