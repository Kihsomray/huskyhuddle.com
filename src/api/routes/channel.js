var express = require('express');
var router = express.Router();

const databaseConnect = require("../db/db-connect");

router.get("/", function(req, res, next) {
    res.send("Channel API is working properly");
});

//Get all the channels by guild id
router.get("/channels", function (req, res, next) {
    
    const guildId = req.query.guildId;

    if (!guildId) {
        return res.status(400).json({error:"No GuildId was specified"});
    }

    const sqlQuery = "SELECT * FROM channels WHERE GuildID = ?;";

    databaseConnect.query(sqlQuery, (err, channels) => {
        if (err) {
            console.error("Error fetching channles using GuildID");
            res.status(400);
        }

        return res.status(200).json(channels);
    });
});

//get specific channel within a guild
router.get("/channels/:channelId", function(req, res) {
    const channelId = req.params.channelId;

    const sqlQuery = "SELECT * FROM channels where ChannelId = ?;"

    databaseConnect.query(sqlQuery, [channelId], (err, channel) => {
        if (err) {
            console.error("Error fetching channel using ChannelID")
            res.status(400);
        }

        if (!channel || channel.length === 0) {
            return res.status(404).json({error: "No channel found using ChannelID"});
        }

        return res.status(200).json(channel);
    })
})

//delete a spcific channel using channelId

//patch. Changes the channel name within guild

//Post. Create a new channel within a guild


module.exports = router;
