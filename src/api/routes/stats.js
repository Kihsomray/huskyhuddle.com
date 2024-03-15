var express = require("express");
var router = express.Router();

const databaseConnect = require("../db/db-connect");

// IDEA
// Statistics about the users, guilds, messages, roles.
// Top servers
// servers with many admins

/**
 * @swagger
 * /role:
 *   get:
 *     summary: Counts the number of users
 *     description: Retunfs the number of users
 *     responses:
 *       200:
 *         description: Returned number of users
 */
router.get("/users/", function (req, res, next) {
    console.log("Counting number of users...");

    const sqlQuery = `SELECT COUNT(*) AS UserCount
        FROM User;`;
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            return res
                .status(400)
                .json({ error: "Couldn't connect to database" });
        }
        return res.status(200).json(result[0]);
    });
});

/**
 * @swagger
 * /role:
 *   get:
 *     summary: Counts the number of Guilds
 *     description: Returns the number of Guilds in the database
 *     responses:
 *       200:
 *         description: Counts the number of Guilds in the database
 */
router.get("/guilds/", function (req, res, next) {
    console.log("Counting the number of Guilds...");

    const sqlQuery = `SELECT COUNT(*) AS GuildCount
        FROM Guild;`;
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            return res
                .status(400)
                .json({ error: "Couldn't connect to database" });
        }
        return res.status(200).json(result[0]);
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
router.get("/channels/", function (req, res, next) {
    console.log("Role API");

    const sqlQuery = `SELECT COUNT(*) AS ChannelCount
        FROM Channel;`;
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            return res.status(400).json({ error: err });
        }
        return res.status(200).json(result[0]);
    });
});

/**
 * @swagger
 * /role:
 *   get:
 *     summary: Counts the number of messages across the databases
 *     description: Returns the number of messages across the databases
 *     responses:
 *       200:
 *         description: The number of messages sent throught the web application
 */
router.get("/messages/", function (req, res, next) {
    console.log("Counting the number of messages...");

    const sqlQuery = `SELECT COUNT(*) AS MessageCount
        FROM Message;`;
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            return res
                .status(400)
                .json({ error: "Couldn't connect to database" });
        }
        return res.status(200).json(result[0]);
    });
});

/**
 * @swagger
 * /role:
 *   get:
 *     summary: Calculates the average message per users
 *     description: Returns the average message per user
 *     responses:
 *       200:
 *         description: The average message per user
 */
router.get("/averagemessages/", function (req, res, next) {
    console.log("Calculating the average message per user...");

    const sqlQuery = `SELECT AVG(MessagePerUser) AS AvgMessagesPerUser
        FROM (SELECT COUNT(*) AS MessagePerUser
              FROM Message
              GROUP BY UserID) AS MessageCounts;`;
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            return res
                .status(400)
                .json({ error: "Couldn't connect to database" });
        }
        return res.status(200).json(result[0]);
    });
});

/**
 * @swagger
 * /role:
 *   get:
 *     summary: Counts the number of messages sent by user and sorts them
 *     description: Determines the most active user
 *     responses:
 *       200:
 *         description: Returns the most active user based on number of messages sent
 */
router.get("/mostactiveuser/", function (req, res, next) {
    console.log("Determining the most active user...");

    const sqlQuery = `SELECT u.UserID, u.UserName, COUNT(m.MessageID) AS MessageCount
        FROM Message m
        JOIN User u ON m.UserID = u.UserID
        GROUP BY u.UserID, u.UserName
        ORDER BY MessageCount DESC
        LIMIT 1;`;
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            return res.status(400).json({ error: err });
        }
        return res.status(200).json(result[0]);
    });
});

/**
 * @swagger
 * /role:
 *   get:
 *     summary: Counts the most active channel in a guild
 *     description: Returns the most active channel in a guild
 *     responses:
 *       200:
 *         description: Most active active channel in a guild
 */
router.get("/mostactivechannel/", function (req, res, next) {
    console.log("Determining the most active channel in a guild...");

    const sqlQuery = `SELECT c.ChannelID, c.ChannelName, COUNT(m.MessageID) AS MessageCount
        FROM Message m
        JOIN Channel c ON m.ChannelID = c.ChannelID AND m.GuildID = c.GuildID
        GROUP BY c.ChannelID, c.ChannelName
        ORDER BY MessageCount DESC
        LIMIT 1;`;
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            return res
                .status(400)
                .json({ error: "Couldn't connect to database" });
        }
        return res.status(200).json(result[0]);
    });
});

/**
 * @swagger
 * /role:
 *   get:
 *     summary: Returns the most active guild based on message count
 *     description: Counts the number of messages and outputs the most active guild
 *     responses:
 *       200:
 *         description: THe most active guild based on message count
 */
router.get("/mostactiveguild/", function (req, res, next) {
    console.log("Finding the most active guild...");

    const sqlQuery = `SELECT g.GuildID, g.GuildName, COUNT(m.MessageID) AS MessageCount
        FROM Message m
        JOIN Guild g ON m.GuildID = g.GuildID
        GROUP BY g.GuildID, g.GuildName
        ORDER BY MessageCount DESC
        LIMIT 1;`;
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            return res
                .status(400)
                .json({ error: "Couldn't connect to database" });
        }
        return res.status(200).json(result[0]);
    });
});

/**
 * @swagger
 * /role:
 *   get:
 *     summary: Returns the longest message content
 *     description: Looks thruogh the Message Databse and finds the longest message
 *     responses:
 *       200:
 *         description: Returns the longest message length
 */
router.get("/longestmessage/", function (req, res, next) {
    console.log("Finding the longest length of a message...");

    const sqlQuery = `SELECT MAX(LENGTH(MessageContent)) AS LongestMessageLength
        FROM Message;`;
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            return res.status(400).json({ error: err });
        }
        return res.status(200).json(result[0]);
    });
});

module.exports = router;
