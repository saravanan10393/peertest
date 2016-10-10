var express = require('express');
var router = express.Router();
var db = require('../db/index');

/* GET home page. */
router.post('/register', function(req, res, next) {
    db.User.register(req.body,function(data){
      res.send(data);
    });
});

router.post('/login',function(req, res, next){
  db.User.login(req.body,function(data){
    res.send(data);
  });
});

module.exports = router;
