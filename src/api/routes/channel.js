var express = require("express");
var router = express.Router();

const databaseConnect = require("../db/db-connect");

router.get("/", function (req, res, next) {
    console.log("Getting all Channel ID and Names...");

    const sqlQuery = `SELECT *  FROM Channel;`;

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            return res.status(400);
        }
        return res.status(200).json(result);
    });
});

// Get the latest x messages sent into the channel
// {"Limit" : "5", ChannelID: "1"} as an example as of what to put in the body
router.get("/message/", function (req, res) {
    let limit = req.body.Limit;
    let channelID = req.body.ChannelId;

    console.log(`Getting the last ${limit} messages sent into the channel`);

    const sqlQuery = `SELECT * FROM Message 
                    WHERE ChannelID = ${channelID};`;

    databaseConnect.query(sqlQuery, (err, res) => {
        if (err) {
            console.log(
                "Error getting the last ${limit} messages sent into the channel"
            );
            return res.status(400);
        }
        return res.status(200).json(res);
    });
});

//POST request to handler to add a message to a channel

router.post("/message/", function (req, res) {
    let channelId = res.body.ChannelId;
    let messageContent = res.body.Content;

    console.log("Sending a message to channel");

    if (!channelId || !messageContent) {
        return res
            .status(400)
            .json({ error: "ChannelID, MessageContent are required in body." });
    }

    const sqlQuery = `INSERT INTO Message (ChannelID, MessageContent) 
                    VALUES (${channelId}, ${messageContent});`;

    databaseConnect.query(sqlQuery, (err, res) => {
        if (err) {
            console.log("Error adding message to channel", err);
            return res.status(400);
        }
        return res.status(200).json(res);
    });
});

//Edit message in a specific channel
router.put("/message/", function (req, res) {
    let channelId = req.body.ChannelId;
    let messageId = req.body.MessageId;
    let messageContent = req.body.MessageContent;

    if (!channelId || !messageId || !messageContent) {
        return res.status(400).json({
            error: "ChannelId, MessageId, and MessageContent are required.",
        });
    }

    const sqlQuery = `UPDATE Message SET MessageContent = ${messageContent} 
                    WHERE ChannelID = ${channelId} AND MessageID = ${messageId};`;

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error updating message content", err);
            return res.status(400);
        }
        return res.status(200).json(result);
    });
});

// Delete a message from this Channel
router.delete("/message/", function (req, res) {
    let channelId = req.body.ChannelId;
    let messageId = req.body.MessageId;

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
