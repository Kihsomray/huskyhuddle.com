var express = require('express');
var router = express.Router();
var axios = require('axios');

const databaseConnect = require("../db/db-connect");

//// Webservice /user/


// Get all users, returns a json with all guilds 
router.get("/", function(req, res, next) {
  console.log("User API");

  const sqlQuery = "SELECT * FROM User;"
  databaseConnect.query(sqlQuery, (err, result) => {
      if (err) {
          console.log("Error");
          console.log(err);
          res.status(400);
      } 
      return res.status(200).json(result);
  });
});

// Create a new user with the name provided in the body of the request with GuildName : "Some guild name goes here" in the json
// {"UserName" : "user10", "UserEmail" : "user10@email.com", "UserPass" : "password"} as an example as of what to put in the body
router.post("/", function(req, res, next) {
  console.log("User POST API");

  let UserName = req.headers.username;
  let UserEmail = req.headers.useremail;
  let UserPass = req.headers.userpass;

  console.log(req.headers)

  console.log(UserName);
  console.log(UserEmail);
  console.log(UserPass);

  //let UserName = req.body.UserName;
  //let UserEmail = req.body.UserEmail;
  //let UserPass = req.body.UserPass;

  const sqlQuery = 
      `INSERT INTO User (UserName, UserEmail, UserPass)
      VALUES ('${UserName}', '${UserEmail}', '${UserPass}');`;
  databaseConnect.query(sqlQuery, (err, result) => {
      if (err) {
          console.log("Error");
          console.log(err);
          return res.status(400).json({"Error" : err.sqlMessage});
      } 

      console.log(result.insertId);
      return res.status(200).json({"UserID" : result.insertId});
  });
});

// Update a user with a new name, email and password, this requires all three pieces of data even if you only want one. 
// Just input the previous data if you want it to stay the same
// {"UserID" : "9", "UserName" : "user10", "UserEmail" : "user10@email.com", "UserPass" : "password"} as an example as of what to put in the body
router.put("/", function(req, res, next) {
  console.log("User update");

  let UserID = req.body.UserID;
  let UserName = req.body.UserName;
  let UserEmail = req.body.UserEmail;
  let UserPass = req.body.UserPass;

  const sqlQuery = 
      `UPDATE User
      SET UserName = '${UserName}', UserEmail = '${UserEmail}', UserPass = '${UserPass}'
      WHERE UserID = ${UserID};`;
  databaseConnect.query(sqlQuery, (err, result) => {
      if (err) {
          console.log("Error");
          console.log(err);
          return res.status(400).json(result);
      } 
      return res.status(200).json(result);
  });
});

// Delete a user and also remove all guildUser that are from that user
// {"UserID" : "5"} as an example as of what to put in the body
router.delete("/", function(req, res, next) {
  console.log("User Delete");

  let UserID = req.body.UserID;

  // Delete the members of a guild, this is safe because the users are still guildusers
  // of any other guild they are a part of but they are removed from this specific guild  
  const sqlQuery = 
      `DELETE FROM GuildUser
      WHERE UserID = ${UserID};`
  const sqlQuery2 =     
      `DELETE FROM User
      WHERE UserID = ${UserID};`
  databaseConnect.query(sqlQuery, (err, result) => {
      if (err) {
          console.log("Error");
          console.log(err);
          res.status(400);
      } 
      //return res.status(200).json(result);
  });
  databaseConnect.query(sqlQuery2, (err, result) => {
      if (err) {
          console.log("Error");
          console.log(err);
          res.status(400);
      } 
      return res.status(200).json(result);
  });
});

// Get all users, returns a json with all guilds 
router.get("/auth/", function(req, res, next) {
  //console.log("User auth");

  //console.log(req.headers);

  const UserName = req.headers.username;
  const UserPass = req.headers.userpass;

  console.log(req.headers);
  console.log(UserName);
  console.log(UserPass);

  const sqlQuery = 
    `SELECT UserID 
    FROM User
    WHERE UserName = '${UserName}' AND UserPass = '${UserPass}';`

  //console.log(sqlQuery);


  let exists;
  databaseConnect.query(sqlQuery, (err, result) => {
      if (err) {
          console.log("Error");
          console.log(err);
          return res.status(400).json({ "Exists" : "False"});
      } 
      // console.log(result[0]);
      
      if (result[0] == undefined) {
        console.log(1);
        return res.status(400).json({ "Exists" : 0})
      }
      console.log(result[0].UserID);
      exists = 1; // {"Exists" : "True"}

      console.log(result);

      return exists ? res.status(200).json({"UserID" : result[0].UserID}) : res.status(400).json({ "Exists" : "False"});
  });
});


// Get all users, returns a json with all guilds 
router.get("/guild/", function(req, res, next) {
  console.log("User API");

  let UserID = req.headers.userid;

  const sqlQuery = 
    `SELECT * FROM Channel
    WHERE GuildID = ${UserID}`;
    
  databaseConnect.query(sqlQuery, (err, result) => {
      if (err) {
          console.log("Error");
          console.log(err);
          res.status(400);
      } 
      return res.status(200).json(result);
  });
});




// Test out axios to get some data from another webservice
router.get("/test/", function(req, res, next) {
  console.log("User API");

  const fetchData = async (response) => {
    try {
        response = await axios.get('http://localhost:4000/');
        return response;
    } catch (error) {
        console.error(error);
    }
  };

  fetchData().then(e => {
    console.log(e.data);

    const sqlQuery = "SELECT * FROM User;"
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            res.status(400);
        } 
        
        return res.status(200).json(result);
    });
  });
  
});



// const fetchData = async () => {
//   try {
//       const response = await axios.get('http://localhost:4000/');
//       setVersion(response.data);
//   } catch (error) {
//       console.error(error);
//   }
// };

// fetchData();










// Trying out some hashing and tokens

// const bcrypt = require("bcrypt");
// const User = require("../model/user");

// const token = require("../token/token-manager");


// // Register a new user
// router.get('/register', function({ body: { username, email, password } }, res) {

//   // encrypt the password using bcrypt
//   bcrypt.hashSync(password, 10)

//   // create a new user with password
//   .then((hash) => {

//     // create a new user
//     const user = new User({
//       username,
//       email,
//       hash
//     });

//     // tries to save the new user
//     user.save()
//     .then(() => {
//       return res.status(201).json({ success: "Account created successfully!" })
//     })
//     .catch((error) => {
//       return res.status(500).json({
//         error: "Account creation failed!",
//         message: error.message
//       });
//     });

//   })
//   .catch(() => {
//     return res.status(500).json({ error: "Password failed to hash! Please try again!" });
//   });

//   return res.status(500).json({ error: "Something went wrong!" });

// });

// // Login a user
// router.get('/login', function({ body: { handle, password } }, res) {

//   // find the user by email
//   (User.findOne({ $or: [{ email: handle }, { username: handle }] }))

//   // create a new user with password
//   .then((user) => {

//     // compare the password with the user's hash
//     bcrypt.compare(password, user.hash)

//     .then((result) => {

//       // if the password is correct
//       if (!result) {

//         // if the password is incorrect
//         return res.status(400).json({ error: "Incorrect password!" });

//       }

//       // create a new token
//       generateToken(
//         { 
//           id: _id,
//           username: user.email 
//         },
//         "5d"
//       );

//       // return the token
//       return res.status(200).json({
//         success: "User was logged in successfully!",
//         token
//       });

//     })
//     .catch(() => {
//       return res.status(400).json({ error: "Password failed to compare! Please try again!" });
//     });


//   })
//   .catch(() => {
//     return res.status(404).json({ error: "No account is found with the given email!" });
//   });

//   return res.status(500).json({ error: "Something went wrong!" });

// });


module.exports = router;
