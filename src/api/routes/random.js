var express = require("express");
var router = express.Router();
var axios = require("axios");

const databaseConnect = require("../db/db-connect");

router.get("/", function (req, res, next) {
    console.log("Random is working");

    const sqlQuery = "SELECT * FROM Message;";
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            return res.status(400).json({
                "Error executing SQL statement to get all messages in database":
                    err,
            });
        }
        return res.status(200).json(result);
    });
});

//Get a random username within a guild, provided with the GuildID
router.get("/user/", function (req, res, next) {
    console.log("Getting a random username within the guild...");

    let GuildID = req.body.GuildID;

    if (!GuildID) {
        return res
            .status(400)
            .json({ error: "GuildID is required in the body request" });
    }

    let sqlQuery = `SELECT UserName
                    FROM User
                    JOIN GuildUser on User.UserID = GuildUser.UserID
                    WHERE GuildUser.GuildID = ${GuildID};`;

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            return res.status(400).json({
                "Error executing SQL statement to get a random user in the database":
                    err,
            });
        }

        let randomIndex = Math.floor(Math.random() * result.length);
        let randomUserName = result[randomIndex].UserName;

        return res.status(200).json({ UserName: randomUserName });
    });
});

//Creates a random user from an external API
router.post("/user/", async function (req, res, next) {
    console.log("Creating a random user to be added into the database...");

    try {
        //Fetch random user data from the randomuser.me api
        let response = await axios.get("https://randomuser.me/api/");
        let userData = response.data.results[0];

        //Extract the randm user information
        let userName = `${userData.login.username}`;
        let userEmail = userData.email;
        //let userPassword = userData.login.password;

        let sqlQuery = `INSERT INTO User (UserName, UserEmail, UserPass)
            VALUES ("${userName}","${userEmail}","password");`;
        databaseConnect.query(sqlQuery, (err, result) => {
            if (err) {
                return res.status(400).json({
                    "Error executing SQL statement to create a random user in the database":
                        err,
                });
            }
            return res.status(200).json(result);
        });
    } catch (err) {
        res.status(500).json({ "Error gathering data from external api": err });
    }
});

//Creates a random user from an external API and puts them into a guild
//{ "GuildID" = X, "GuildRole" = X} is the reqeust body format
router.post("/user/guild/", async function (req, res, next) {
    console.log(
        "Creating a random user to be added into the database and into a guild..."
    );
    let GuildId = req.body.GuildID;
    let GuildRole = req.body.GuildRole;

    try {
        //Fetch random user data from the randomuser.me api
        let response = await axios.get("https://randomuser.me/api/");
        let userData = response.data.results[0];

        //Extract the randm user information
        let userName = `${userData.login.username}`;
        let userEmail = userData.email;
        //let userPassword = userData.login.password;

        let sqlQuery = `INSERT INTO User (UserName, UserEmail, UserPass)
            VALUES ("${userName}","${userEmail}","password");`;
        databaseConnect.query(sqlQuery, (err, result) => {
            if (err) {
                return res.status(400).json({
                    "Error executing SQL statement to create a random user in the database":
                        err,
                });
            }
            const userID = result.insertId;

            const nextQuery = `INSERT INTO GuildUser (GuildID, UserID, Role)
                                VALUES (${GuildId},${userID},"${GuildRole}");`;

            databaseConnect.query(nextQuery, (err, result) => {
                if (err) {
                    return res.status(400).json({
                        "Error executing SQL statement to put newly created user in GuildUser database":
                            err,
                    });
                }
                return res.status(200).json(result);
            });
        });
    } catch (err) {
        res.status(500).json({ "Error gathering data from external api": err });
    }
});
module.exports = router;
