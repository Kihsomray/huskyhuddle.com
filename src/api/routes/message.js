var express = require("express");
var router = express.Router();

const databaseConnect = require("../db/db-connect");

/**
 * @swagger
 * tags:
 *   - name: Message
 *     description: The Message managing API
 *   - name: Message/Channel
 *     description: The Message/Channel managing API
 *   - name: Message/Latest
 *     description: The Message/Latest managing API
 */

/**
 * @swagger
 * /message:
 *   get:
 *     summary: Returns all messages
 *     description: Returns a json with all messages
 *     tags: [Message]
 *     responses:
 *       200:
 *         description: All messages
 */
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
 *     tags: [Message/Channel]
 *     parameters:
 *       -  in: header
 *          name: channelid
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: guildid
 *          required: true
 *          schema:
 *            type: integer
 *     responses:
 *       200:
 *         description: Successfully fetched messages
 *       400:
 *         description: Error fetching messages
 */
//Get all messages within a channel within a guild
router.get("/channel/", function (req, res, next) {
    console.log("Get all messages within a channel within a guild");

    let channelID = req.headers.channelid;
    let guildID = req.headers.guildid;

    if (!channelID || !guildID) {
        return res.status(400).json({
            error: "ChannelID and GuildID is required in the body request",
        });
    }

    const sqlQuery = 
        `SELECT Message.MessageContent
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
 *     tags: [Message/Latest]
 *     parameters:
 *       -  in: header
 *          name: channelid
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: limit
 *          required: true
 *          schema:
 *            type: integer
 *     responses:
 *       200:
 *         description: Successfully fetched messages
 *       400:
 *         description: Error fetching messages
 */
//Get the latest X messages into this channel
router.get("/channel/latest/", function (req, res, next) {
    let channelID = req.headers.channelid;
    let limit = req.headers.limit;

    if (!channelID || limit <= 0 || isNaN(limit)) {
        return res.status(400).json({
            error: "ChannelID in the body and a positive limit in the body is required in the request.",
        });
    }

    const sqlQuery = 
        `SELECT MessageContent
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
 *     tags: [Message/Channel]
 *     parameters:
 *       -  in: header
 *          name: channelid
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: userid
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: guildid
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: content
 *          required: true
 *          schema:
 *            type: string
 *     responses:
 *       200:
 *         description: Successfully added message
 *       400:
 *         description: Error adding message
 */
// Add a message to the channel
router.post("/channel/", function (req, res) {
    let channelId = req.headers.channelid;
    let UserID = req.headers.userid;
    let GuildID = req.headers.guildid;
    let messageContent = req.headers.content;

    console.log("Sending a message to channel");

    // if (!channelId || !messageContent) {
    //     return res
    //         .status(400)
    //         .json({ error: "ChannelID, MessageContent are required in body." });
    // }

    const sqlQuery = 
        `INSERT INTO Message (ChannelID, MessageContent, GuildID, UserID) 
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
 *     tags: [Message/Channel]
 *     parameters:
 *       -  in: header
 *          name: channelid
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: messageid
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: content
 *          required: true
 *          schema:
 *            type: string
 *     responses:
 *       200:
 *         description: Successfully edited message
 *       400:
 *         description: Error editing message
 */
//Edit message in a specific channel
router.put("/channel/", function (req, res, next) {
    let channelId = req.headers.channelid;
    let messageId = req.headers.messageid;
    let messageContent = req.headers.content;

    if (!channelId || !messageId || !messageContent) {
        return res.status(400).json({
            error: "ChannelId and MessageID are required in the body request and MessageContent is required in the body request.",
        });
    }

    const sqlQuery = 
        `UPDATE Message SET MessageContent = "${messageContent}" 
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
 *     tags: [Message/Channel]
 *     parameters:
 *       -  in: header
 *          name: channelid
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: messageid
 *          required: true
 *          schema:
 *            type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted message
 *       400:
 *         description: Error deleting message
 */
// Delete a message from this Channel
router.delete("/channel", function (req, res, next) {
    let channelId = req.headers.channelid;
    let messageId = req.headers.messageid;

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

module.exports = router;
