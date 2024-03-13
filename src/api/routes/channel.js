var express = require("express");
var router = express.Router();

const databaseConnect = require("../db/db-connect");

// /channel/ and /channel/message/
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

// Get the latest x messages sent into the channel
// {"Limit" : "5", ChannelID: "1"} as an example as of what to put in the body
router.get("/message/", function (req, res, next) {
    let Limit = req.headers.limit;
    let GuildID = req.headers.guildid;
    let ChannelID = req.headers.channelid;

    console.log(Limit + " " + ChannelID);

    console.log(`Getting the last ${Limit} messages sent into the channel`);

    const sqlQuery = 
        `SELECT * FROM Message 
        WHERE ChannelID = ${ChannelID} AND GuildID = ${GuildID} LIMIT ${Limit};`;
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

// POST request to handler to add a message to a channel
router.post("/message/", function (req, res) {
    let channelId = req.headers.ChannelID;
    let UserID = req.headers.UserID;
    let GuildID = req.headers.GuildID;
    let messageContent = req.headers.Content;

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

//Edit message in a specific channel
router.put("/message/", function (req, res, next) {
    let channelId = req.headers.ChannelID;
    let messageId = req.headers.MessageID;
    let messageContent = req.headers.Content;

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

// Delete a message from this Channel
router.delete("/message/", function (req, res, next) {
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
