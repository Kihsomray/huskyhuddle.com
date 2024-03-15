var express = require("express");
var router = express.Router();

const databaseConnect = require("../db/db-connect");

/**
 * @swagger
 * tags:
 *   - name: Channel
 *     description: The Channel managing API
 *   - name: Channel/Message
 *     description: The Channel/Message managing API
 *   - name: Channel/Latest
 *     description: The Channel Latest messages managing API
 */


/**
 * @swagger
 * /channel:
 *   get:
 *     summary: Returns all channels
 *     description: Returns a json with all channels
 *     tags: [Channel]
 *     responses:
 *       200:
 *         description: All channels
 */
// Get all channels, returns a json with all channels
router.get("/", function (req, res, next) {
    console.log("Getting all Channel ID and Names...");

    const sqlQuery = 
        `SELECT *  FROM Channel;`;

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            return res.status(400).json({ error: "Internal Server Error" });
        }
        return res.status(200).json(result);
    });
});

/**
 * @swagger
 * /channel/message:
 *   get:
 *     summary: Returns the last messages sent into the channel
 *     description: Returns a json with the last messages sent into the channel
 *     tags: [Channel/Message]
 *     parameters:
 *       -  in: header
 *          name: limit
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: guildid
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: channelid
 *          required: true
 *          schema:
 *            type: integer
 *     responses:
 *       200:
 *         description: Last messages sent into the channel
 *       400:
 *         description: Error getting the last messages sent into the channel
 */
router.get("/message/", function (req, res, next) {
    let Limit = req.headers.limit;
    let GuildID = req.headers.guildid;
    let ChannelID = req.headers.channelid;

    console.log(Limit + " " + ChannelID);

    console.log(`Getting the last ${Limit} messages sent into the channel`);

    const sqlQuery = 
        `SELECT M.MessageID, M.MessageContent, M.UserID, U.UserName, DATE_FORMAT(M.MessageDate, '%Y-%m-%d, %H-%i-%s') AS MessageDate
        FROM (
            SELECT MessageID, MessageContent, UserID, MessageDate
            FROM Message
            WHERE GuildID = ${GuildID} AND ChannelID = ${ChannelID}
            ORDER BY MessageID DESC
            LIMIT ${Limit}
        ) AS M
        JOIN User AS U ON M.UserID = U.UserID
        ORDER BY M.MessageID ASC;`;
    // const sqlQuery = `SELECT *  FROM Channel;`;

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log(
                `Error getting the last ${Limit} messages sent into the channel`
            );
            return res.status(400).json({
                error: `Error getting the last ${Limit} messages sent into the channel`,
            });
        }
        return res.status(200).json(result);
    });
});

/**
 * @swagger
 * /channel/message:
 *   post:
 *     summary: Add a new message to the channel
 *     description: Add a new message to the channel
 *     tags: [Channel/Message]
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
 *         description: New message added
 *       400:
 *         description: Error adding message to the channel
 */
//POST request to handler to add a message to a channel
// Send userid, channelid, guildid, and messagecontent
router.post("/message/", function (req, res) {
    let channelId = req.headers.channelid;
    let UserID = req.headers.userid;
    let GuildID = req.headers.guildid;
    let messageContent = req.headers.content;
    let DateTime = new Date();
    let DateString = DateTime.toLocaleString("en-GB", { timeZone: "PST" });
    //console.log("Date time is ");
    //console.log(DateString);

    console.log("Sending a message to channel");

    if (!channelId || !messageContent) {
        return res
            .status(400)
            .json({
                error: "ChannelID, MessageContent are required in header.",
            });
    }

    const sqlQuery = 
        `INSERT INTO Message (ChannelID, MessageContent, GuildID, UserID, MessageDate)
        VALUES (${channelId}, "${messageContent}", ${GuildID}, ${UserID}, STR_TO_DATE("${DateString}", "%d/%m/%Y, %H:%i:%s"));`;

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

/**
 * @swagger
 * /channel/message:
 *   put:
 *     summary: Update a message in a channel
 *     description: Update a message in a channel
 *     tags: [Channel/Message]
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
 *         description: Message updated
 *       400:
 *         description: Error updating message
 */
//Edit message in a specific channel
router.put("/message/", function (req, res, next) {
    let channelId = req.headers.channelid;
    let messageId = req.headers.messageid;
    let messageContent = req.headers.content;

    if (!channelId || !messageId || !messageContent) {
        return res.status(400).json({
            error: "ChannelId, MessageId, and MessageContent are required.",
        });
    }

    const sqlQuery = 
        `UPDATE Message SET MessageContent = "${messageContent}" 
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

/**
 * @swagger
 * /channel/message:
 *   delete:
 *     summary: Delete a message from a channel
 *     description: Delete a message from a channel
 *     tags: [Channel/Message]
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
 *         description: Message deleted
 *       400:
 *         description: Error deleting message
 */
// Delete a message from this Channel
router.delete("/message/", function (req, res, next) {
    let channelId = req.headers.channelid;
    let messageId = req.headers.messageid;

    if (!channelId || !messageId) {
        return res
            .status(400)
            .json({ error: "ChannelId and messageId are required in body" });
    }

    let sqlQuery = 
        `DELETE FROM Message
        WHERE ChannelID = ${channelId} AND MessageID = ${messageId};`;

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error deleting message", err);
            res.status(400);
        }
        return res.status(200).json(result);
    });
});

/**
 * @swagger
 * /channel/islatest:
 *   get:
 *     summary: Get if this message is the latest
 *     description: Get if this message is the latest
 *     tags: [Channel/Latest]
 *     parameters:
 *       -  in: header
 *          name: latestmessageid
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: guildid
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: channelid
 *          required: true
 *          schema:
 *            type: integer
 *     responses:
 *       200:
 *         description: Message deleted
 *       400:
 *         description: Error deleting message
 */
// Get the latest x messages sent into the channel
router.get("/islatest/", function (req, res, next) {
    let latestMID = req.headers.latestmessageid;
    let GuildID = req.headers.guildid;
    let ChannelID = req.headers.channelid;

    // console.log(Limit + " " + ChannelID);

    // console.log(`Getting the last ${Limit} messages sent into the channel`);

    const sqlQuery = 
        `SELECT CASE
        WHEN ${latestMID} = (
            SELECT MAX(MessageID)
            FROM Message
            WHERE GuildID = ${GuildID} AND ChannelID = ${ChannelID}
        ) THEN 1
        ELSE 0
        END AS IsLatestMessage;`;

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log(
                `Error getting the last ${latestMID} messages sent into the channel`
            );
            return res.status(400).json({
                error: `Error getting the last ${latestMID} messages sent into the channel`,
            });
        }
        return res.status(200).json(result);
    });
});

/**
 * @swagger
 * /channel/latestmessage:
 *   get:
 *     summary: Get the messages up to the latest
 *     description: Get the messages up to the latest
 *     tags: [Channel/Latest]
 *     parameters:
 *       -  in: header
 *          name: latestmessageid
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: guildid
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: channelid
 *          required: true
 *          schema:
 *            type: integer
 *     responses:
 *       200:
 *         description: Message deleted
 *       400:
 *         description: Error deleting message
 */
// Get the latest x messages sent into the channel
router.get("/latestmessage/", function (req, res, next) {
    console.log("latest message");
    let latestMID = req.headers.latestmessageid;
    let GuildID = req.headers.guildid;
    let ChannelID = req.headers.channelid;

    const sqlQuery = 
        `SELECT M.MessageID, M.MessageContent, M.UserID, U.UserName, DATE_FORMAT(M.MessageDate, '%Y-%m-%d, %H-%i-%s') AS MessageDate
        FROM Message M
        JOIN User U ON M.UserID = U.UserID
        WHERE M.GuildID = ${GuildID} AND M.ChannelID = ${ChannelID} AND M.MessageID > ${latestMID}
        ORDER BY M.MessageID ASC;`;

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log(
                `Error getting the last ${latestMID} messages sent into the channel` +
                    err
            );
            return res.status(400).json({
                error: err,
            });
        }
        return res.status(200).json(result);
    });
});

module.exports = router;
