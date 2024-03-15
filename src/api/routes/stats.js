var express = require("express");
var router = express.Router();

const databaseConnect = require("../db/db-connect");

// IDEA
// Statistics about the users, guilds, messages, roles.
// Top servers
// servers with many admins

/**
 * @swagger
 * tags:
 *   - name: Stats
 *     description: Gathering Web Application statistics
 */

/**
 * @swagger
 * /stats/users/:
 *   get:
 *     summary: Counts the number of users
 *     description: Counts the number of users in database
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Counted number of users
 *       400:
 *         description: Error counting number of users
 */
router.get("/users/", function (req, res, next) {
    console.log("Counting number of users...");

    const sqlQuery =
        `SELECT COUNT(*) AS UserCount
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
 * /stats/guilds:
 *   get:
 *     summary: Counts the number of guilds
 *     description: Count the number of guilds in the database
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Counted number of guilds
 *       400:
 *         description: Error counting number of guilds
 */
router.get("/guilds/", function (req, res, next) {
    console.log("Counting the number of Guilds...");

    const sqlQuery =
        `SELECT COUNT(*) AS GuildCount
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
 * /stats/channels/:
 *   get:
 *     summary: Count the number of Channels
 *     description: Counts the number of Channels in the database
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Channels counted
 *       400:
 *         description: Error counting channels
 */
router.get("/channels/", function (req, res, next) {
    console.log("Role API");

    const sqlQuery =
        `SELECT COUNT(*) AS ChannelCount
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
 * /stats/messages/:
 *   get:
 *     summary: Count the number of Messages
 *     description: Counts the number of Messages in the database
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Messages counted
 *       400:
 *         description: Error counting messages
 */
router.get("/messages/", function (req, res, next) {
    console.log("Counting the number of messages...");

    const sqlQuery =
        `SELECT COUNT(*) AS MessageCount
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
 * /stats/averagemessages/:
 *   get:
 *     summary: Count the average number of messages per user
 *     description: Counts the average number of messages per user in the database
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Average number of messages per user counted
 *       400:
 *         description: Error counting average number of messages per user
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
 * /stats/mostactiveuser/:
 *   get:
 *     summary: Find the most active user
 *     description: Counts the messages sent per user and finds the highgest one
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Found the most active user
 *       400:
 *         description: Error finding the most active user
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
 * /stats/mostactivechannel/:
 *   get:
 *     summary: Find the most active channel
 *     description: Counts the messages per channel and finds the channel with the most messages
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Found the most active channel
 *       400:
 *         description: Error finding the most active channel
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
 * /stats/mostactiveguild/:
 *   get:
 *     summary: Find the most active guild
 *     description: Count the number of messages in each guild and find the guild with the most messages
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Found the most active guild
 *       400:
 *         description: Error finding the most guild
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
 * /stats/longestmessage/:
 *   get:
 *     summary: Finds the longest message
 *     description: Finds the longest message content in the database
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Found the longest message
 *       400:
 *         description: Error finding the longest message
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
