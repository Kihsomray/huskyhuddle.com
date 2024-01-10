var express = require('express');
var router = express.Router();

const bcrypt = require("bcrypt");
const User = require("./model/dbUserModel")

// Register a new user
router.get('/register', function({ body: { email, password } }, res) {

  // encrypt the password using bcrypt
  password = bcrypt.hashSync(password, 10)

  // create a new user with password
  .then((password) => {

    // create a new user
    const newUser = new User({
      email,
      password,
    });

    // tries to save the new user
    newUser.save()
    .then(() => {
      return res.status(201).json({ success: "User was created successfully!" })
    })
    .catch(() => {
      return res.status(500).json({ error: "User failed to create!" });
    })

  })
  .catch(() => {
    return res.status(500).json({ error: "Password failed to hash! Please try again!" });
  });

  return res.status(401).json({ error: "Unauthorized!" });

});

/* GET users listing. */
router.get('/kakashka', function(req, res, next) {
  res.send('ya shokoladniy zayets');
});

module.exports = router;
