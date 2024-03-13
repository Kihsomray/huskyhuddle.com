var express = require("express");
var router = express.Router();

const databaseConnect = require("../db/db-connect");

/*
 * @swagger
 * /channel:
 *   get:
 *     summary: Returns all channels
 *     description: Returns a json with all channels
 *     responses:
 *       200:
 *         description: All channels
 */
// Get all channels, returns a json with all channels
router.get("/", function (req, res, next) {
    console.log("Getting all Channel ID and Names...");

    const sqlQuery = `SELECT *  FROM Channel;`;

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            return res.status(400).json({ error: "Internal Server Error" });
        }
        return res.status(200).json(result);
    });
});

/*
 * @swagger
 * /channel/message:
 *   get:
 *     summary: Returns the last messages sent into the channel
 *     description: Returns a json with the last messages sent into the channel
 *     responses:
 *       200:
 *         description: Last messages sent into the channel
 *       400:
 *         description: Error getting the last messages sent into the channel
 */
// {"Limit" : "5", ChannelID: "1"} as an example as of what to put in the body
router.get("/message/", function (req, res, next) {
    let limit = req.body.Limit;
    let channelID = req.body.ChannelID;

    console.log(limit + " " + channelID);

    console.log(`Getting the last ${limit} messages sent into the channel`);

    const sqlQuery = `SELECT * FROM Message 
                    WHERE ChannelID = ${channelID} LIMIT ${limit};`;
    // const sqlQuery = `SELECT *  FROM Channel;`;

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log(
                `Error getting the last ${limit} messages sent into the channel`
            );
            return res.status(400).json({
                error: `Error getting the last ${limit} messages sent into the channel`,
            });
        }
        return res.status(200).json(result);
    });
});

/*
 * @swagger
 * /channel/message:
 *   post:
 *     summary: Add a new message to the channel
 *     description: Add a new message to the channel
 *     responses:
 *       200:
 *         description: New message added
 *       400:
 *         description: Error adding message to the channel
 */
//POST request to handler to add a message to a channel
router.post("/message/", function (req, res) {
    let channelId = req.body.ChannelID;
    let UserID = req.body.UserID;
    let GuildID = req.body.GuildID;
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
            console.log("Error adding message to channel", err);
            return res
                .status(400)
                .json({ "Error adding message to channel": err });
        }
        return res.status(200).json({ MessageID: result.insertId });
    });
});

/*
 * @swagger
 * /channel/message:
 *   put:
 *     summary: Update a message in a channel
 *     description: Update a message in a channel
 *     responses:
 *       200:
 *         description: Message updated
 *       400:
 *         description: Error updating message
 */
//Edit message in a specific channel
router.put("/message/", function (req, res, next) {
    let channelId = req.body.ChannelID;
    let messageId = req.body.MessageID;
    let messageContent = req.body.Content;

    if (!channelId || !messageId || !messageContent) {
        return res.status(400).json({
            error: "ChannelId, MessageId, and MessageContent are required.",
        });
    }

    const sqlQuery = `UPDATE Message SET MessageContent = "${messageContent}" 
                    WHERE ChannelID = ${channelId} AND MessageID = ${messageId};`;

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error updating message content", err);
            return res
                .status(400)
                .json({ error: "Error updating message content" });
        }
        if (result.affectedRows == 0) {
            return res
                .status(400)
                .json({ error: "No message with messageID specified" });
        }
        return res.status(200).json(result);
    });
});

/*
 * @swagger
 * /channel/message:
 *   delete:
 *     summary: Delete a message from a channel
 *     description: Delete a message from a channel
 *     responses:
 *       200:
 *         description: Message deleted
 *       400:
 *         description: Error deleting message
 */
// Delete a message from this Channel
router.delete("/message/", function (req, res, next) {
    let channelId = req.body.ChannelID;
    let messageId = req.body.MessageID;

    if (!channelId || !messageId) {
        return res
            .status(400)
            .json({ error: "ChannelId and messageId are required in body" });
    }

    let sqlQuery = `DELETE FROM Message
                    WHERE ChannelID = ${channelId} AND MessageID = ${messageId};`;

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error deleting message", err);
            res.status(400);
        }
        return res.status(200).json(result);
    });
});

//delete a spcific channel using channelId

//patch. Changes the channel name within guild

//Post. Create a new channel within a guild

module.exports = router;
