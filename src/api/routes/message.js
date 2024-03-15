var express = require("express");
var router = express.Router();
var axios = require("axios");

const databaseConnect = require("../db/db-connect");

/**
 * @swagger
 * /message:
 *   get:
 *     summary: Returns all messages
 *     description: Returns a json with all messages
 *     responses:
 *       200:
 *         description: All messages
 */
// YOUR ENDPOINT HERE, It will be called by GET local host 4000 /message/
// Get all the messages sent across the servers
router.get("/", function (req, res, next) {
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

/**
 * @swagger
 * /message/channel:
 *   get:
 *     summary: Get all messages within a channel within a guild
 *     description: Fetches all messages associated with channel within guild.
 *     responses:
 *       200:
 *         description: Successfully fetched messages
 *       400:
 *         description: Error fetching messages
 */
//Get all messages within a channel within a guild
router.get("/channel/", function (req, res, next) {
    console.log("Get all messages within a channel within a guild");

    let channelID = req.headers.ChannelID;
    let guildID = req.headers.GuildID;

    if (!channelID || !guildID) {
        return res.status(400).json({
            error: "ChannelID and GuildID is required in the body request",
        });
    }

    const sqlQuery = `SELECT Message.MessageContent
                    FROM Message
                    JOIN Channel on Message.ChannelID = Channel.ChannelID
                    WHERE Channel.GuildID = ${guildID} AND Channel.ChannelID = ${channelID};`;

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            return res.status(400).json({
                "Error executing sql query to get all message within a channel":
                    err,
            });
        }
        return res.status(200).json(result);
    });
});

/**
 * @swagger
 * /message/channel/latest:
 *   get:
 *     summary: Get the latest X messages into this channel
 *     description: Get the latest X messages into this channel
 *     responses:
 *       200:
 *         description: Successfully fetched messages
 *       400:
 *         description: Error fetching messages
 */
//Get the latest X messages into this channel
//{"Limit" : "5"} as an example as of what to put in the headers
router.get("/channel/latest/", function (req, res, next) {
    let channelID = req.headers.ChannelID;
    let limit = req.headers.limit;

    if (!channelID || limit <= 0 || isNaN(limit)) {
        return res.status(400).json({
            error: "ChannelID in the body and a positive limit in the body is required in the request.",
        });
    }

    const sqlQuery = `SELECT MessageContent
                    FROM Message
                    WHERE ChannelID = ${channelID}
                    LIMIT ${limit};`;

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            return res.status(400).json({ "Error executing sql query": err });
        }
        return res.status(200).json(result);
    });
});

/**
 * @swagger
 * /message/channel:
 *   post:
 *     summary: Add a message to the channel
 *     description: Add a message to the channel
 *     responses:
 *       200:
 *         description: Successfully added message
 *       400:
 *         description: Error adding message
 */
// Add a message to the channel
router.post("/channel/", function (req, res) {
    let channelId = req.headers.ChannelID;
    let UserID = req.headers.UserID;
    let GuildID = req.headers.GuildID;
    let messageContent = req.body.Content;

    console.log("Sending a message to channel");

    if (!channelId || !messageContent) {
        return res
            .status(400)
            .json({ error: "ChannelID, MessageContent are required in body." });
    }

    const sqlQuery = `INSERT INTO Message (ChannelID, MessageContent, GuildID, UserID) 
                    VALUES (${channelId}, "${messageContent}", ${GuildID}, ${UserID});`;

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            return res
                .status(400)
                .json({ "Error adding message to channel": err });
        }
        return res.status(200).json({ MessageID: result.insertId });
    });
});

/**
 * @swagger
 * /message/channel:
 *   put:
 *     summary: Edit message in a specific channel
 *     description: Edit message in a specific channel
 *     responses:
 *       200:
 *         description: Successfully edited message
 *       400:
 *         description: Error editing message
 */
//Edit message in a specific channel
router.put("/channel/", function (req, res, next) {
    let channelId = req.headers.ChannelID;
    let messageId = req.headers.MessageID;
    let messageContent = req.body.Content;

    if (!channelId || !messageId || !messageContent) {
        return res.status(400).json({
            error: "ChannelId and MessageID are required in the body request and MessageContent is required in the body request.",
        });
    }

    const sqlQuery = `UPDATE Message SET MessageContent = "${messageContent}" 
                    WHERE ChannelID = ${channelId} AND MessageID = ${messageId};`;

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            return res
                .status(400)
                .json({ "Error updating message content": err });
        }
        if (result.affectedRows == 0) {
            return res
                .status(400)
                .json({ "No message with messageID specified": err });
        }
        return res.status(200).json(result);
    });
});

/**
 * @swagger
 * /message/channel:
 *   delete:
 *     summary: Delete a message from this Channel
 *     description: Delete a message from this Channel
 *     responses:
 *       200:
 *         description: Successfully deleted message
 *       400:
 *         description: Error deleting message
 */
// Delete a message from this Channel
router.delete("/channel", function (req, res, next) {
    let channelId = req.headers.ChannelID;
    let messageId = req.headers.MessageID;

    if (!channelId || !messageId) {
        return res
            .status(400)
            .json({ error: "ChannelId and messageId are required in body" });
    }

    let sqlQuery = `DELETE FROM Message
                    WHERE ChannelID = ${channelId} AND MessageID = ${messageId};`;

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            return res.status(400).json({
                "Error executing delete message SQL statement": err,
            });
        }
        return res.status(200).json(result);
    });
});

// /**
//  * @swagger
//  * /message/random:
//  *   post:
//  *     summary: Create a new message with a random quote
//  *     description: Create a new message with a random quote by a user from an external API
//  *     responses:
//  *       200:
//  *         description: Successfully created message
//  *       400:
//  *         description: Error creating message
//  */
// // Creates a new message with a random quote by a user from an external API
// router.post("/random/", async function (req, res, next) {
//     let ChannelId = req.body.ChannelID;
//     let GuildID = req.body.GuildID;
//     let UserID = req.body.UserID;

//     if (!ChannelId || !GuildID || !UserID) {
//         return res.status(400).json({
//             error: "ChannelID, GuildID, and UserID is required in the body in the request",
//         });
//     }
//     try {
//         const jokeResponse = await axios.get(
//             "https://official-joke-api.appspot.com/random_joke"
//         );
//         const jokeData = jokeResponse.data;

//         let messageContent = `${jokeData.setup}\n${jokeData.punchline}`;

//         const sqlQuery = `INSERT INTO Message (GuildID, ChannelID, UserID, MessageContent)
//                         VALUES (${GuildID}, ${ChannelId}, ${UserID}, "${messageContent}");`;

//         databaseConnect.query(sqlQuery, (err, result) => {
//             if (err) {
//                 console.log(
//                     "Error reading SQL statement to create random message:"
//                 );
//                 return res.status(400).json(err);
//             }
//             return res.status(200).json(result);
//         });
//     } catch (error) {
//         console.error("Error creating random new message");
//         return res
//             .status(500)
//             .json({ error: "Error gathering data from external api" });
//     }
// });
module.exports = router;
