var express = require('express');
var router = express.Router();

const bcrypt = require("bcrypt");
const User = require("./model/user");

const token = require("./token/tokenManager");

// Register a new user
router.get('/register', function({ body: { username, email, password } }, res) {

  // encrypt the password using bcrypt
  bcrypt.hashSync(password, 10)

  // create a new user with password
  .then((hash) => {

    // create a new user
    const user = new User({
      username,
      email,
      hash
    });

    // tries to save the new user
    user.save()
    .then(() => {
      return res.status(201).json({ success: "Account created successfully!" })
    })
    .catch((error) => {
      return res.status(500).json({
        error: "Account creation failed!",
        message: error.message
      });
    });

  })
  .catch(() => {
    return res.status(500).json({ error: "Password failed to hash! Please try again!" });
  });

  return res.status(500).json({ error: "Something went wrong!" });

});

// Login a user
router.get('/login', function({ body: { handle, password } }, res) {

  // find the user by email
  (User.findOne({ $or: [{ email: handle }, { username: handle }] }))

  // create a new user with password
  .then((user) => {

    // compare the password with the user's hash
    bcrypt.compare(password, user.hash)

    .then((result) => {

      // if the password is correct
      if (!result) {

        // if the password is incorrect
        return res.status(400).json({ error: "Incorrect password!" });

      }

      // create a new token
      generateToken(
        { 
          id: _id,
          username: user.email 
        },
        "5d"
      );

      // return the token
      return res.status(200).json({
        success: "User was logged in successfully!",
        token
      });

    })
    .catch(() => {
      return res.status(400).json({ error: "Password failed to compare! Please try again!" });
    });


  })
  .catch(() => {
    return res.status(404).json({ error: "No account is found with the given email!" });
  });

  return res.status(500).json({ error: "Something went wrong!" });

});


module.exports = router;
