var express = require("express");
var router = express.Router();

const databaseConnect = require("../db/db-connect");

// /Admin/

//// Web service for all admin commands

// Check if this user is an admin
router.get("/", async function (req, res, next) {
    console.log("Admin API");

    const UserID = req.headers.userid;
    const GuildID = req.headers.guildid;

    const sqlQueryRole = 
        `SELECT Role
        FROM GuildUser
        WHERE UserID = ${UserID} AND GuildID = ${GuildID};`;

    databaseConnect.query(sqlQueryRole, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            return result.status(400).json({"Error" : "Uhoh"});
        }

        console.log(result);
        console.log(result.length);

        if (result.length == 0) {
            return res.status(400).json({"Error" : "User is not member of Guild"});
        } else if (result[0].Role !== "Admin") {
            return res.status(400).json({"Error" : "User is not an Admin"});
        }
        
        return res.status(200).json(result[0]);
    });
});

// Create a new channel within a guild with the name provided.
// The userid, guildid and channelname is to be passed in the header.
router.post("/channel/", function (req, res, next) {
    console.log("/Admin/channel/ POST API");

    const UserID = req.headers.userid;
    const GuildID = req.headers.guildid;
    const ChannelName = req.headers.channelname;

    const sqlQueryRole = 
        `SELECT Role
        FROM GuildUser
        WHERE UserID = ${UserID} AND GuildID = ${GuildID};`;

    databaseConnect.query(sqlQueryRole, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            return result.status(400).json({"Error" : "Uhoh"});
        }

        console.log(result);
        console.log(result.length);

        if (result.length == 0) {
            return res.status(400).json({"Error" : "User is not member of Guild"});
        } else if (result[0].Role !== "Admin") {
            return res.status(400).json({"Error" : "User is not an Admin"});
        }
        
        //return res.status(200).json(result[0]);
        // If here the user is an admin

        const sqlQuery = 
            `INSERT INTO Channel (GuildID, ChannelName)
            VALUES (${GuildID}, '${ChannelName}');`;
        databaseConnect.query(sqlQuery, (err, result) => {
            if (err) {
                console.log("Error");
                console.log(err);
                return result.status(400).json({"Error" : err});
            }
            return res.status(200).json({"ChannelID" : result.insertId});
        });
    });
});

// change a channels name within a guild with the name provided.
// The userid, guildid and channelname, channelid is to be passed in the header.
router.put("/channel/", function (req, res, next) {
    console.log("/Admin/channel/ POST API");

    const UserID = req.headers.userid;
    const GuildID = req.headers.guildid;
    const ChannelID = req.headers.channelid;
    const ChannelName = req.headers.channelname;

    const sqlQueryRole = 
        `SELECT Role
        FROM GuildUser
        WHERE UserID = ${UserID} AND GuildID = ${GuildID};`;

    databaseConnect.query(sqlQueryRole, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            return result.status(400).json({"Error" : "Uhoh"});
        }

        console.log(result);
        console.log(result.length);

        if (result.length == 0) {
            return res.status(400).json({"Error" : "User is not member of Guild"});
        } else if (result[0].Role !== "Admin") {
            return res.status(400).json({"Error" : "User is not an Admin"});
        }
        
        //return res.status(200).json(result[0]);
        // If here the user is an admin

        const sqlQuery = 
            `UPDATE Channel
            SET ChannelName = '${ChannelName}'
            WHERE ChannelID = ${ChannelID} AND GuildID = ${GuildID};`;
        databaseConnect.query(sqlQuery, (err, result) => {
            if (err) {
                console.log("Error");
                console.log(err);
                return result.status(400).json({"Error" : err});
            }
            return res.status(200).json({"ChannelID" : result.insertId});
        });
    });
});

// Delete a channel within a guild with the channelid provided.
// The userid, guildid and channelid is to be passed in the header.
router.delete("/channel/", function (req, res, next) {
    console.log("/Admin/channel/ DELETE API");

    const UserID = req.headers.userid;
    const GuildID = req.headers.guildid;
    const ChannelID = req.headers.channelid;

    const sqlQueryRole = 
        `SELECT Role
        FROM GuildUser
        WHERE UserID = ${UserID} AND GuildID = ${GuildID};`;

    databaseConnect.query(sqlQueryRole, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            return result.status(400).json({"Error" : "Uhoh"});
        }

        console.log(result);
        console.log(result.length);

        if (result.length == 0) {
            return res.status(400).json({"Error" : "User is not member of Guild"});
        } else if (result[0].Role !== "Admin") {
            return res.status(400).json({"Error" : "User is not an Admin"});
        }
        
        //return res.status(200).json(result[0]);
        // If here the user is an admin

        const sqlQuery = 
            `DELETE FROM Channel
            WHERE ChannelID = ${ChannelID} AND GuildID = ${GuildID};`;
        databaseConnect.query(sqlQuery, (err, result) => {
            if (err) {
                console.log("Error");
                console.log(err);
                return result.status(400).json({"Error" : err});
            }
            return res.status(200).json({"NumChannelsRemoved": result.affectedRows});
        });
    });
});




module.exports = router;
