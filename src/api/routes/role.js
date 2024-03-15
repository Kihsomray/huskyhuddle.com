var express = require("express");
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
router.get("/", function (req, res, next) {
    console.log("Role API");

    const sqlQuery = `SELECT DISTINCT Role
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
 *     summary: Counts the number of UserIDs and sort by role
 *     description: Returns the Number of Users based on the role
 *     responses:
 *       200:
 *         description: Returned correct number of users based on the role
 */
router.get("/count/", function (req, res, next) {
    console.log("Counting number of Users based on role");

    const sqlQuery = `SELECT Role, COUNT(UserID) AS NumberOfUsers
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
 *     summary: Counts the number of users in a guild based on a role
 *     description: Counts the number of users in a guild based on a role
 *     responses:
 *       200:
 *         description: Counted all guild users based on role
 */
router.get("/inguild/", function (req, res, next) {
    console.log("Counting number of users in a guild based on role");

    const sqlQuery = `SELECT Guild.GuildName, Role, COUNT(UserID) AS UserCount
        FROM GuildUser
        JOIN Guild ON GuildUser.GuildID = Guild.GuildID
        GROUP BY Guild.GuildName, Role;`;
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            return res.status(400).json({ error: err });
        }
        return res.status(200).json(result);
    });
});

module.exports = router;
