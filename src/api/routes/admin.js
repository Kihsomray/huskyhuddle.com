var express = require("express");
var router = express.Router();

const databaseConnect = require("../db/db-connect");

// /Admin/

//// Web service for all admin commands

// Get all guilds, returns a json with all guilds
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
                return result.status(400).json({"Error" : "Uhoh"});
            }
            return res.status(200).json({"ChannelID" : result.insertId});
        });
    });
});

module.exports = router;
