var express = require("express");
var router = express.Router();
var axios = require("axios");
const databaseConnect = require("../db/db-connect");

// /user/ and /user/guild/

// IDEA
// Keep track of ip addresses
// ipify.org
// Local servers?
// Weather information based on ip address
// openweathermap

//// Webservice /user/

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: The user managing API
 */

/**
 * @swagger
 * /user/:
 *      get:
 *          summary: Returns all users
 *          description: Returns a json with all users
 *          tags: [User]
 *          responses:
 *              200:
 *                  description: All users
 */
// Get all users, returns a json with all users and their info
router.get("/", function (req, res, next) {
    console.log("User API");

    const sqlQuery = "SELECT * FROM User;";
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
 *      post:
 *          summary: Create a new user
 *          description: Create a new user entry in the database. UserName, UserEmail, and User password need to be passed through the header.
 *          tags: [User]
 *          parameters:
 *              -   in: header
 *                  name: username
 *                  required: true
 *                  schema:
 *                      type: string
 *              -   in: header
 *                  name: useremail
 *                  required: true
 *                  schema:
 *                      type: string
 *              -   in: header
 *                  name: userpass
 *                  required: true
 *                  schema:
 *                      type: string
 *          responses:
 *              200:
 *                  description: User created
 *              400:
 *                  description: Error creating new user
 */
// Create a new user with the name provided
// Pass the data(username, useremail, and userpass) in the header
// This is a second degree endpoint that calls another endpoint to get the person added to the default server
// The default server is the first server that was created.
router.post("/", function (req, res, next) {
    console.log("User POST API");

    let UserName = req.headers.username;
    let UserEmail = req.headers.useremail;
    let UserPass = req.headers.userpass;

    const sqlQuery = `INSERT INTO User (UserName, UserEmail, UserPass)
      VALUES ('${UserName}', '${UserEmail}', '${UserPass}');`;
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            return res.status(400).json({ Error: err.sqlMessage });
        }
        const userID = result.insertId;

        const registerHeaders = {
            guildid: "1",
            userid: userID,
            role: "Member",
        };

        const fetchData = async (response) => {
            try {
                response = await axios.post(
                    "http://localhost:4000/guild/user/",
                    null,
                    { headers: registerHeaders }
                );
                return response;
            } catch (error) {
                console.error(error);
            }
        };

        fetchData().then((e) => {
            console.log(e.data);

            // const sqlQuery = "SELECT * FROM User;"
            // databaseConnect.query(sqlQuery, (err, result) => {
            //     if (err) {
            //         console.log("Error");
            //         console.log(err);
            //         res.status(400);
            //     }

            //     return res.status(200).json(result);
            // });
        });
        return res.status(200).json({ UserID: userID });
        //return res.status(200).json({"UserID" : result.insertId});
    });
});

/**
 * @swagger
 * /user/:
 *      put:
 *          summary: Update an existing user
 *          description: Update existing user in the database. UserName, UserEmail, and User password, and UserID need to be passed through the header.
 *          tags: [User]
 *          parameters:
 *              -   in: header
 *                  name: userid
 *                  required: true
 *                  schema:
 *                      type: integer
 *              -   in: header
 *                  name: username
 *                  required: true
 *                  schema:
 *                      type: string
 *              -   in: header
 *                  name: useremail
 *                  required: true
 *                  schema:
 *                      type: string
 *              -   in: header
 *                  name: userpass
 *                  required: true
 *                  schema:
 *                      type: string
 *          responses:
 *              200:
 *                  description: User updated
 *              400:
 *                  description: Error updating existing user
 */ // Update a user with a new name, email and password, this requires all three pieces of data even if you only want one.
// Just input the previous data if you want it to stay the same
// Pass userid, username, useremail, and userpass in the header
router.put("/", function (req, res, next) {
    console.log("User update");

    let UserID = req.headers.userid;
    let UserName = req.headers.username;
    let UserEmail = req.headers.useremail;
    let UserPass = req.headers.userpass;

    const sqlQuery = `UPDATE User
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
 *      delete:
 *          summary: Delete an existing user
 *          description: Deletes user entry in the database. User ID need to be passed through the header.
 *          tags: [User]
 *          parameters:
 *              -   in: header
 *                  name: userid
 *                  required: true
 *                  schema:
 *                      type: integer
 *          responses:
 *              200:
 *                  description: User deleted
 *              400:
 *                  description: Error deleting new user
 */
// Delete a user and also remove all guildUser that are from that user
// Pass userid in the header
router.delete("/", function (req, res, next) {
    console.log("User Delete");

    let UserID = req.headers.userid;

    // Delete the members of a guild, this is safe because the users are still guildusers
    // of any other guild they are a part of but they are removed from this specific guild
    const sqlQuery = `DELETE FROM GuildUser
      WHERE UserID = ${UserID};`;
    const sqlQuery2 = `DELETE FROM User
      WHERE UserID = ${UserID};`;
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            return res.status(400).json({ Error: err });
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
 * /user/auth/:
 *      get:
 *          summary: Get matching user with matching username and password
 *          description: Finds user entry in the database with the inputted username and password. Username and userpass need to be passed through the header.
 *          tags: [User]
 *          parameters:
 *              -   in: header
 *                  name: username
 *                  required: true
 *                  schema:
 *                      type: string
 *              -   in: header
 *                  name: userpass
 *                  required: true
 *                  schema:
 *                      type: string
 *          responses:
 *              200:
 *                  description: Found user with matching username and password
 *              400:
 *                  description: Error finding user to match username and password
 */

// Get all users, returns a json with all guilds     localhost4000/user/auth
router.get("/auth/", function (req, res, next) {
    const UserName = req.headers.username;
    const UserPass = req.headers.userpass;

    const sqlQuery = `SELECT UserID 
    FROM User
    WHERE UserName = '${UserName}' AND UserPass = '${UserPass}';`;

    let exists;
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            return res.status(400).json({ Exists: "False" });
        }

        if (result[0] == undefined) {
            console.log(1);
            return res.status(400).json({ Exists: 0 });
        }
        console.log(result[0].UserID);
        exists = 1; // {"Exists" : "True"}

        console.log(result);

        return exists
            ? res.status(200).json({ UserID: result[0].UserID })
            : res.status(400).json({ Exists: "False" });
    });
});

/**
 * @swagger
 * /user/guild/:
 *      get:
 *          summary: Finds the guild given user is a part of
 *          description: Finds the guilds a user is a part of. Takes the userid as input
 *          tags: [User]
 *          parameters:
 *              -   in: header
 *                  name: userid
 *                  required: true
 *                  schema:
 *                      type: integer
 *          responses:
 *              200:
 *                  description: Found all the guild(s) given user is a part of
 *              400:
 *                  description: Error finding guild(s) user is in
 */

// Get all guilds this user is part of
router.get("/guild/", function (req, res, next) {
    const UserID = req.headers.userid;

    const sqlQuery = `SELECT g.GuildID, g.GuildName
    FROM GuildUser gu
    JOIN Guild g ON gu.GuildID = g.GuildID
    WHERE gu.UserID = ${UserID};`;

    console.log(UserID);
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
 * /user/createguild/:
 *      post:
 *          summary: Create guild with inputed user as admin
 *          description: Creates a guild with given userid and guildname
 *          tags: [User]
 *          parameters:
 *              -   in: header
 *                  name: userid
 *                  required: true
 *                  schema:
 *                      type: integer
 *              -   in: header
 *                  name: guildname
 *                  required: true
 *                  schema:
 *                      type: string
 *          responses:
 *              200:
 *                  description: Created a new guild with given user as admin
 *              400:
 *                  description: Error creating a new guild with given user as admin
 */

// create a guild with this user as an admin
router.post("/createguild/", function (req, res, next) {
    const UserID = req.headers.userid;
    const GuildName = req.headers.guildname;
    const Role = "Admin";

    const sqlQuery = `INSERT INTO Guild (GuildName)
    VALUES ('${GuildName}');`;

    console.log(UserID);
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            return res.status(400).json(result);
        }
        const GuildID = result.insertId;

        const sqlQuery2 = `INSERT INTO GuildUser (GuildID, UserID, Role)
        VALUES (${GuildID}, ${UserID}, '${Role}');`;

        databaseConnect.query(sqlQuery2, (err, result) => {
            if (err) {
                console.log("Error");
                console.log(err);
                return res.status(400).json(result);
            }
            console.log("Everything worked");
        });

        return res.status(200).json({ GuildID: GuildID });
    });
});

// Test out axios to get some data from another webservice
router.get("/test/", function (req, res, next) {
    console.log("User API");

    const fetchData = async (response) => {
        try {
            response = await axios.get("http://localhost:4000/");
            return response;
        } catch (error) {
            console.error(error);
        }
    };

    fetchData().then((e) => {
        console.log(e.data);

        const sqlQuery = "SELECT * FROM User;";
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

// /**
//
// /user/{userId}:
//    get:
//      summary: Get user by ID
//      description: Returns a single user by their ID
//      responses:
//        200:
//          description: A single user
//        404:
//          description: User not found
// /
// router.get("/:userId", function(req, res, next) {
//   const userid = req.params.userId;

//   const sqlQuery = `SELECT * FROM User WHERE UserID = ${userid};`;

//   databaseConnect.query(sqlQuery, (err, result) => {
//       if (err) {
//           console.log("Error");
//           console.log(err);
//           return res.status(400).json(result);
//       }
//       return res.status(200).json(result);
//   });
// });

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
