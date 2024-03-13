var express = require("express");
var router = express.Router();
var axios = require("axios");

const databaseConnect = require("../db/db-connect");

/*
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

//Get all messages within a channel within a guild
router.get("/channel/", function (req, res, next) {
    console.log("Get all messages within a channel within a guild");

    let channelID = req.body.ChannelID;
    let guildID = req.body.GuildID;

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

//Get the latest X messages into this channel
//{"Limit" : "5"} as an example as of what to put in the body
router.get("/channel/latest/", function (req, res, next) {
    let channelID = req.body.ChannelID;
    let limit = req.body.Limit;

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

// Add a message to the channel
router.post("/channel/", function (req, res) {
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
            return res
                .status(400)
                .json({ "Error adding message to channel": err });
        }
        return res.status(200).json({ MessageID: result.insertId });
    });
});

//Edit message in a specific channel
router.put("/channel/", function (req, res, next) {
    let channelId = req.body.ChannelID;
    let messageId = req.body.MessageID;
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

// Delete a message from this Channel
router.delete("/channel", function (req, res, next) {
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
            return res.status(400).json({
                "Error executing delete message SQL statement": err,
            });
        }
        return res.status(200).json(result);
    });
});

// Creates a new message with a random quote by a random user from an external API
router.post("/random/", async function (req, res, next) {
    let channelId = req.body.ChannelID;

    if (!channelId) {
        return res.status(400).json({
            error: "ChannelID is required in the body in the request",
        });
    }
    try {
        const jokeResponse = await axios.get(
            "https://official-joke-api.appspot.com/random_joke"
        );
        const jokeData = jokeResponse.data;

        const userResponse = await axios.get("https://randomuser.me/api/");
        const userData = userResponse.data.results[0];

        let messageContent = `${jokeData.setup}\n${jokeData.punchline}\n\nPosted by ${userData.name.first} ${userData.name.last}`;

        const sqlQuery = `INSERT INTO Message (ChannelID, MessageContent)
                        VALUES (${channelId}, "${messageContent}");`;

        databaseConnect.query(sqlQuery, (err, result) => {
            if (err) {
                console.log(
                    "Error reading SQL statement to create random message:"
                );
                return res.status(400).json(err);
            }
            return res.status(200).json(result);
        });
    } catch (error) {
        console.error("Error creating random new message");
        return res
            .status(500)
            .json({ error: "Error gathering data from external api" });
    }
});
module.exports = router;
