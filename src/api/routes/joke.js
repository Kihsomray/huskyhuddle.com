var express = require("express");
var router = express.Router();
var axios = require("axios");

const databaseConnect = require("../db/db-connect");

/**
 * @swagger
 * tags:
 *   - name: Joke
 *     description: The Joke managing API
 */

/**
 * @swagger
 * /joke/message:
 *   post:
 *     summary: Create a new message with a random quote
 *     description: Create a new message with a random quote by a user from an external API
 *     tags: [Joke]
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
 *       -  in: header
 *          name: userid
 *          required: true
 *          schema:
 *            type: integer
 *     responses:
 *       200:
 *         description: Successfully created message
 *       400:
 *         description: Error creating message
 */

router.post("/message/", async function (req, res, next) {
    let ChannelId = req.headers.channelid;
    let GuildID = req.headers.guildid;
    let UserID = req.headers.userid;

    if (!ChannelId || !GuildID || !UserID) {
        return res.status(400).json({
            error: "ChannelID, GuildID, and UserID is required in the header in the request",
        });
    }
    try {
        const jokeResponse = await axios.get(
            "https://official-joke-api.appspot.com/random_joke"
        );
        const jokeData = jokeResponse.data;

        let messageContent = `${jokeData.setup}\n${jokeData.punchline}`;

        const sqlQuery = 
            `INSERT INTO Message (GuildID, ChannelID, UserID, MessageContent)
            VALUES (${GuildID}, ${ChannelId}, ${UserID}, "${messageContent}");`;

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
