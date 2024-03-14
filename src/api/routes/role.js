var express = require('express');
var router = express.Router();

const databaseConnect = require("../db/db-connect");

/**
* @swagger
* /role:   
*   get:
*     summary: Returns string response "Role API is working properly"
*     description: Returns response that role API is working
*     responses:
*       200:
*         description: All roles
*/
router.get("/", function(req, res, next) {
    console.log("Stats API");

    const sqlQuery = 
        `SELECT DISTINCT Role
        FROM GuildUser;`;
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            return res
                .status(400)
                .json({ error: "Couldn't connect to database" });
        }
        return res.status(200).json(result);
    });
});


/**
* @swagger
* /role:   
*   get:
*     summary: Returns string response "Role API is working properly"
*     description: Returns response that role API is working
*     responses:
*       200:
*         description: All roles
*/
router.get("/count/", function(req, res, next) {
    console.log("Guild API");

    const sqlQuery = 
        `SELECT Role, COUNT(UserID) AS NumberOfUsers
        FROM GuildUser
        GROUP BY Role;`;
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            return res
                .status(400)
                .json({ error: "Couldn't connect to database" });
        }
        return res.status(200).json(result);
    });
});


/**
* @swagger
* /role:   
*   get:
*     summary: Returns string response "Role API is working properly"
*     description: Returns response that role API is working
*     responses:
*       200:
*         description: All roles
*/
router.get("/inguild/", function(req, res, next) {
    console.log("Guild API");

    const sqlQuery = 
        `SELECT Guild.GuildName, Role, COUNT(UserID) AS UserCount
        FROM GuildUser
        JOIN Guild ON GuildUser.GuildID = Guild.GuildID
        GROUP BY Guild.GuildName, Role;`
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            return res
                .status(400)
                .json({ error: err });
        }
        return res.status(200).json(result);
    });
});


module.exports = router;
