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

// POST request to handler to add a message to a channel
// Send userid, channelid, guildid, and messagecontent
router.post("/message/", function (req, res) {
    let channelId = req.headers.channelid;
    let UserID = req.headers.userid;
    let GuildID = req.headers.guildid;
    let messageContent = req.headers.content;
    let DateTime = new Date();
    let DateString = DateTime.toLocaleString('en-GB', { timeZone: 'PST' });
    //console.log("Date time is ");
    //console.log(DateString);

    console.log("Sending a message to channel");

    if (!channelId || !messageContent) {
        return res
            .status(400)
            .json({ error: "ChannelID, MessageContent are required in header." });
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
