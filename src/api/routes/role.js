var express = require("express");
var router = express.Router();

const databaseConnect = require("../db/db-connect");

/**
 * @swagger
 * tags:
 *   - name: Role
 *     description: Role managing API
 */


/**
 * @swagger
 * /role/:
 *   get:
 *     summary: All the existing roles in the Web Application
 *     description: Selects distinct role in GuildUser table in database
 *     tags: [Role]
 *     responses:
 *       200:
 *         description: All roles listed
 *       400:
 *         description: Error listing all roles
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
 * /role/count/:
 *   get:
 *     summary: Count the number of Users based on role
 *     description: Group all users based on their role and count how many there are
 *     tags: [Role]
 *     responses:
 *       200:
 *         description: Users with the same role counted
 *       400:
 *         description: Error counting users with the same role
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
 * /role/inguild/:
 *   get:
 *     summary: Counting the number of users in a guild based on the role
 *     description: Selects Guildname, and counts the number of total users and counts the number of users with the same roles in the guild
 *     tags: [Role]
 *     responses:
 *       200:
 *         description: All users in guild counted
 *       400:
 *         description: Error counting all users in the guild
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
