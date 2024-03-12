var express = require('express');
var router = express.Router();
var axios = require('axios');

const databaseConnect = require("../db/db-connect");

//// Webservice /user/

/**
 * @swagger
 * /user/:
 *   get:
 *     summary: Retrieves all users
 *     description: Returns a JSON object containing all users in the database.
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   UserID:
 *                     type: integer
 *                     description: The user ID
 *                     example: 1
 *                   UserName:
 *                     type: string
 *                     description: The user's name
 *                     example: JohnDoe
 *                   UserEmail:
 *                     type: string
 *                     description: The user's email address
 *                     example: johndoe@example.com
 *                   UserPass:
 *                     type: string
 *                     description: The user's hashed password
 *                     example: $2b$10$N9qo8uLOickgx2ZMRZoMye
 *       400:
 *         description: Error in fetching users
 */
// Get all users, returns a json with all guilds 
router.get("/", function(req, res, next) {
  console.log("User API");

  const sqlQuery = "SELECT * FROM User;"
  databaseConnect.query(sqlQuery, (err, result) => {
      if (err) {
          console.log("Error");
          console.log(err);
          return res.status(400).json(result);
      } 
      return res.status(200).json(result);
  });
});

/**
 * @swagger
 * /user/:
 *   post:
 *     summary: Creates a new user
 *     description: Adds a new user to the database with the provided username, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserName:
 *                 type: string
 *                 description: The user's name
 *                 example: user10
 *               UserEmail:
 *                 type: string
 *                 description: The user's email address
 *                 example: user10@email.com
 *               UserPass:
 *                 type: string
 *                 description: The user's password
 *                 example: password
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 UserID:
 *                   type: integer
 *                   description: The newly created user's ID
 *                   example: 10
 *       400:
 *         description: Error in creating user
 */
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

/**
 * @swagger
 * /user/:
 *   put:
 *     summary: Updates an existing user
 *     description: Updates an existing user's information in the database with the provided user ID, username, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserID:
 *                 type: integer
 *                 description: The user's ID
 *                 example: 9
 *               UserName:
 *                 type: string
 *                 description: The new username
 *                 example: user10
 *               UserEmail:
 *                 type: string
 *                 description: The new email address
 *                 example: user10@email.com
 *               UserPass:
 *                 type: string
 *                 description: The new password
 *                 example: newPassword
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: integer
 *                   description: The number of rows affected
 *                   example: 1
 *       400:
 *         description: Error in updating user
 */
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

/**
 * @swagger
 * /user/:
 *   delete:
 *     summary: Deletes a user
 *     description: Deletes a user and all associated guild memberships from the database based on the provided user ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserID:
 *                 type: integer
 *                 description: The user's ID to be deleted
 *                 example: 5
 *     responses:
 *       200:
 *         description: User and associated guild memberships deleted successfully
 *       400:
 *         description: Error in deleting user
 */
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

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: Retrieves a specific user by ID
 *     description: Returns a JSON object containing the user's information from the database based on the provided user ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 UserID:
 *                   type: integer
 *                   description: The user ID
 *                   example: 1
 *                 UserName:
 *                   type: string
 *                   description: The user's name
 *                   example: JohnDoe
 *                 UserEmail:
 *                   type: string
 *                   description: The user's email address
 *                   example: johndoe@example.com
 *                 UserPass:
 *                   type: string
 *                   description: The user's hashed password
 *                   example: $2b$10$N9qo8uLOickgx2ZMRZoMye
 *       400:
 *         description: Error in fetching the user
 */
router.get("/:userId", function(req, res, next) {
  const userid = req.params.userId;

  const sqlQuery = `SELECT * FROM User WHERE UserID = ${userid};`;

  databaseConnect.query(sqlQuery, (err, result) => {
      if (err) {
          console.log("Error");
          console.log(err);
          return res.status(400).json(result);
      } 
      return res.status(200).json(result);
  });
});

/**
 * @swagger
 * /user/auth/:
 *   get:
 *     summary: Authenticates a user
 *     description: Checks if a user with the given username and password exists in the database and returns their UserID if authentication is successful.
 *     parameters:
 *       - in: header
 *         name: username
 *         required: true
 *         description: The username of the user to authenticate.
 *         schema:
 *           type: string
 *       - in: header
 *         name: userpass
 *         required: true
 *         description: The password of the user to authenticate.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 UserID:
 *                   type: integer
 *                   description: The authenticated user's ID
 *                   example: 1
 *       400:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Exists:
 *                   type: integer
 *                   description: Indicates whether the user exists (0 for no, 1 for yes)
 *                   example: 0
 */
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

/**
 * @swagger
 * /user/guild/:
 *   get:
 *     summary: Retrieves guilds for a specific user
 *     description: Returns a JSON object containing all guilds associated with the specified user ID.
 *     parameters:
 *       - in: header
 *         name: userid
 *         required: true
 *         description: The ID of the user whose guilds are to be retrieved.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of guilds associated with the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   GuildID:
 *                     type: integer
 *                     description: The guild ID
 *                     example: 1
 *                   GuildName:
 *                     type: string
 *                     description: The name of the guild
 *                     example: "Knights of the Round Table"
 *       400:
 *         description: Error in fetching guilds
 */
// Get all users, returns a json with all guilds 
router.get("/guild/", function(req, res, next) {
  console.log("User API");

  let UserID = req.headers.userid;

  const sqlQuery = 
    `SELECT g.GuildID, g.GuildName
    FROM GuildUser gu
    JOIN Guild g ON gu.GuildID = g.GuildID
    WHERE gu.UserID = ${UserID};`;
    
  databaseConnect.query(sqlQuery, (err, result) => {
      if (err) {
          console.log("Error");
          console.log(err);
          res.status(400);
      } 
      return res.status(200).json(result);
  });
});

/**
 * @swagger
 * /user/test/:
 *   get:
 *     summary: Test endpoint to fetch data from another service and return all users
 *     description: Makes an external API call to 'http://localhost:4000/' and then returns all users from the database.
 *     responses:
 *       200:
 *         description: Successfully fetched external data and returned all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   UserID:
 *                     type: integer
 *                     description: The user ID
 *                     example: 1
 *                   UserName:
 *                     type: string
 *                     description: The user's name
 *                     example: JohnDoe
 *                   UserEmail:
 *                     type: string
 *                     description: The user's email address
 *                     example: johndoe@example.com
 *                   UserPass:
 *                     type: string
 *                     description: The user's hashed password
 *                     example: $2b$10$N9qo8uLOickgx2ZMRZoMye
 *       400:
 *         description: Error in fetching data
 */
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
