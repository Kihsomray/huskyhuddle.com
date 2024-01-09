var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/login/', function(req, res, next) {
  return response.status(200).json({success: "success"});
  const username = req.body.username;
  const hashedPassword = req.body.hashedPassword;
  res.render('index', { title: `user: ${username}, hashed: ${hashedPassword}` });
  
  return response.status(200).json({success: "success"});
});

/* GET users listing. */
router.get('/kakashka/', function(req, res, next) {
  res.send('ya shokoladniy zayets');
});

module.exports = router;
