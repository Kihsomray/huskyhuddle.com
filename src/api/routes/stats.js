var express = require('express');
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
*     summary: Returns string response "Role API is working properly"
*     description: Returns response that role API is working
*     responses:
*       200:
*         description: All roles
*/
router.get("/users/", function(req, res, next) {
    console.log("Role API");

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
* /role:   
*   get:
*     summary: Returns string response "Role API is working properly"
*     description: Returns response that role API is working
*     responses:
*       200:
*         description: All roles
*/
router.get("/guilds/", function(req, res, next) {
    console.log("Role API");

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
* /role:   
*   get:
*     summary: Returns string response "Role API is working properly"
*     description: Returns response that role API is working
*     responses:
*       200:
*         description: All roles
*/
router.get("/channels/", function(req, res, next) {
    console.log("Role API");

    const sqlQuery = 
        `SELECT COUNT(*) AS ChannelCount
        FROM Channel;`
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            return res
                .status(400)
                .json({ error: err });
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
router.get("/messages/", function(req, res, next) {
    console.log("Role API");

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
* /role:   
*   get:
*     summary: Returns string response "Role API is working properly"
*     description: Returns response that role API is working
*     responses:
*       200:
*         description: All roles
*/
router.get("/averagemessages/", function(req, res, next) {
    console.log("Role API");

    const sqlQuery = 
        `SELECT AVG(MessagePerUser) AS AvgMessagesPerUser
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
*     summary: Returns string response "Role API is working properly"
*     description: Returns response that role API is working
*     responses:
*       200:
*         description: All roles
*/
router.get("/mostactiveuser/", function(req, res, next) {
    console.log("Role API");

    const sqlQuery = 
        `SELECT u.UserID, u.UserName, COUNT(m.MessageID) AS MessageCount
        FROM Message m
        JOIN User u ON m.UserID = u.UserID
        GROUP BY u.UserID, u.UserName
        ORDER BY MessageCount DESC
        LIMIT 1;`
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            return res
                .status(400)
                .json({ error: err });
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
router.get("/mostactivechannel/", function(req, res, next) {
    console.log("Role API");

    const sqlQuery = 
        `SELECT c.ChannelID, c.ChannelName, COUNT(m.MessageID) AS MessageCount
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
*     summary: Returns string response "Role API is working properly"
*     description: Returns response that role API is working
*     responses:
*       200:
*         description: All roles
*/
router.get("/mostactiveguild/", function(req, res, next) {
    console.log("Role API");

    const sqlQuery = 
        `SELECT g.GuildID, g.GuildName, COUNT(m.MessageID) AS MessageCount
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
*     summary: Returns string response "Role API is working properly"
*     description: Returns response that role API is working
*     responses:
*       200:
*         description: All roles
*/
router.get("/longestmessage/", function(req, res, next) {
    console.log("Role API");

    const sqlQuery = 
        `SELECT MAX(LENGTH(MessageContent)) AS LongestMessageLength
        FROM Message;`
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            return res
                .status(400)
                .json({ error: err });
        }
        return res.status(200).json(result[0]);
    });
});








module.exports = router;
