var express = require("express");
var router = express.Router();

const databaseConnect = require("../db/db-connect");

/**
 * @swagger
 * /:
 *   get:
 *     summary: Retrieve all channels
 *     description: Returns a list of all channels with their IDs and names.
 *     responses:
 *       200:
 *         description: A list of channels.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ChannelID:
 *                     type: integer
 *                     description: The channel ID.
 *                     example: 1
 *                   ChannelName:
 *                     type: string
 *                     description: The name of the channel.
 *                     example: General
 *       400:
 *         description: Internal Server Error
 */
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

/**
 * @swagger
 * /message/:
 *   get:
 *     summary: Retrieve the last x messages from a channel
 *     description: Returns the last x messages sent into the specified channel, ordered by the most recent.
 *     tags: [Messages]
 *     parameters:
 *       - in: query
 *         name: Limit
 *         schema:
 *           type: integer
 *         required: true
 *         description: The number of messages to retrieve
 *       - in: query
 *         name: ChannelID
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the channel from which to retrieve messages
 *     responses:
 *       200:
 *         description: A list of messages.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   MessageID:
 *                     type: integer
 *                     description: The unique identifier of the message.
 *                     example: 123
 *                   ChannelID:
 *                     type: integer
 *                     description: The ID of the channel the message was sent in.
 *                     example: 1
 *                   UserID:
 *                     type: integer
 *                     description: The ID of the user who sent the message.
 *                     example: 45
 *                   MessageContent:
 *                     type: string
 *                     description: The content of the message.
 *                     example: "Hello, world!"
 *                   CreatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the message was sent.
 *                     example: "2021-04-23T18:25:43.511Z"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: "Error getting the last x messages sent into the channel"
 */
// Get the latest x messages sent into the channel
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

/**
 * @swagger
 * /message/:
 *   post:
 *     summary: Post a new message to a channel
 *     description: Allows posting a new message to a specified channel.
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ChannelID
 *               - Content
 *             properties:
 *               ChannelID:
 *                 type: integer
 *                 description: The ID of the channel to which the message is being sent.
 *                 example: 1
 *               UserID:
 *                 type: integer
 *                 description: The ID of the user sending the message.
 *                 example: 45
 *               GuildID:
 *                 type: integer
 *                 description: The ID of the guild where the channel exists.
 *                 example: 10
 *               Content:
 *                 type: string
 *                 description: The content of the message being sent.
 *                 example: "Hello, world!"
 *     responses:
 *       200:
 *         description: Message successfully added to the channel.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 MessageID:
 *                   type: integer
 *                   description: The unique identifier of the newly added message.
 *                   example: 123
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating what went wrong.
 *                   example: "ChannelID, MessageContent are required in body."
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

/**
 * @swagger
 * /message/:
 *   put:
 *     summary: Update an existing message in a channel
 *     description: Allows updating the content of an existing message in a specified channel.
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ChannelID
 *               - MessageID
 *               - Content
 *             properties:
 *               ChannelID:
 *                 type: integer
 *                 description: The ID of the channel where the message exists.
 *                 example: 1
 *               MessageID:
 *                 type: integer
 *                 description: The unique identifier of the message to be updated.
 *                 example: 123
 *               Content:
 *                 type: string
 *                 description: The new content of the message.
 *                 example: "Updated message content here."
 *     responses:
 *       200:
 *         description: Message successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: integer
 *                   description: The number of rows affected by the update.
 *                   example: 1
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating what went wrong.
 *                   example: "ChannelId, MessageId, and MessageContent are required."
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

/**
 * @swagger
 * /message/:
 *   delete:
 *     summary: Delete a message from a channel
 *     description: Allows deleting an existing message from a specified channel.
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ChannelID
 *               - MessageID
 *             properties:
 *               ChannelID:
 *                 type: integer
 *                 description: The ID of the channel from which the message is to be deleted.
 *                 example: 1
 *               MessageID:
 *                 type: integer
 *                 description: The unique identifier of the message to be deleted.
 *                 example: 123
 *     responses:
 *       200:
 *         description: Message successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: integer
 *                   description: The number of rows affected by the deletion.
 *                   example: 1
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating what went wrong.
 *                   example: "ChannelId and messageId are required in body"
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
