var express = require("express");
var router = express.Router();

const databaseConnect = require("../db/db-connect");

// let dbConnection = databaseConnect;

// /guild/ and /guild/user/ and /guild/channel/

//// Webservice guild/

/**
 * @swagger
 * tags:
 *   - name: Guild
 *     description: The guild managing API
 *   - name: Guild/User
 *     description: The user managing API within guilds
 *   - name: Guild/Channel
 *     description: The channel managing API within guilds.
 */

/**
 * @swagger
 * /guild:
 *   get:
 *     summary: Returns all guilds
 *     description: Returns a json with all guilds
 *     tags: [Guild]
 *     responses:
 *       200:
 *         description: All guilds
 */
// Get all guilds, returns a json with all guilds
router.get("/", function (req, res, next) {
    console.log("Guild API");

    const sqlQuery = "SELECT * FROM Guild;";
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            return res
                .status(400)
                .json({ error: "Couldn't connect to database" });
        }
        return res.status(200).json(result);
    });
});

/**
 * @swagger
 * /guild:
 *   post:
 *     summary: Create a new guild
 *     description: Create a new guild with the name provided. The guildname is to be passed in the header.
 *     tags: [Guild]
 *     parameters:
 *       -  in: header
 *          name: guildname
 *          required: true
 *          schema:
 *            type: string
 *     responses:
 *       200:
 *         description: New guild created
 *       400:
 *         description: Error creating new guild
 */
// Create a new guild with the name provided.
// The guildid is to be passed in the header.
router.post("/", function (req, res, next) {
    console.log("Guild POST API");

    let GuildName = req.headers.guildname;

    const sqlQuery = `INSERT INTO Guild (GuildName)
        VALUES ('${GuildName}');`;
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            return result.status(400).json({ Error: "Uhoh" });
        }
        return res.status(200).json({ GuildID: result.insertId, GuildName: GuildName });
    });
});

/**
 * @swagger
 * /guild:
 *   put:
 *     summary: Update a guild
 *     description: Update a guild with a new name based off of the guildID. The guildid and guildname is to be passed in the header.
 *     tags: [Guild]
 *     parameters:
 *       -  in: header
 *          name: guildname
 *          required: true
 *          schema:
 *            type: string
 *       -  in: header
 *          name: guildid
 *          required: true
 *          schema:
 *            type: integer
 *     responses:
 *       200:
 *         description: Guild updated
 *       400:
 *         description: Error updating guild
 */
// Update a guild with a new name based off of the guildID
// The guildid and guildname is to be passed in the header.
router.put("/", function (req, res, next) {
    console.log("Guild update");

    let GuildName = req.headers.guildname;
    let GuildID = req.headers.guildid;

    const sqlQuery = `UPDATE Guild
        SET GuildName = '${GuildName}'
        WHERE GuildID = ${GuildID};`;
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            res.status(400);
        }
        return res.status(200).json(result);
    });
});

/**
 * @swagger
 * /guild:
 *   delete:
 *     summary: Delete a guild
 *     description: Delete a guild
 *     tags: [Guild]
 *     parameters:
 *       -  in: header
 *          name: guildid
 *          required: true
 *          schema:
 *            type: integer
 *     responses:
 *       200:
 *         description: Guild deleted
 *       400:
 *         description: Error deleting guild
 */
// Delete a guild and also remove all members of that guild by deleting all guildUsers of that guild
// The guildid is to be passed in the header.
router.delete("/", function (req, res, next) {
    console.log("Guild Delete");

    let GuildID = req.headers.guildid;

    // Delete the members of a guild, this is safe because the users are still guildusers
    // of any other guild they are a part of but they are removed from this specific guild
    const sqlQuery = `DELETE FROM GuildUser
        WHERE GuildID = ${GuildID};`;
    const sqlQuery2 = `DELETE FROM Guild
        WHERE GuildID = ${GuildID};`;
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            res.status(400);
        }
        //return res.status(200).json(result);
    });
    databaseConnect.query(sqlQuery2, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            res.status(400);
        }
        return res.status(200).json(result);
    });
});

//// Webservice guild/user/

/**
 * @swagger
 * /guild/user:
 *   get:
 *     summary: Returns all users in this guild
 *     description: Returns a json with all users in this guild
 *     tags: [Guild/User]
 *     parameters:
 *       -  in: header
 *          name: guildid
 *          required: true
 *          schema:
 *            type: integer
 *     responses:
 *       200:
 *         description: All users in this guild
 */
// Grab all of the GuildUsers of this specific guild.
// The guildid, userid, and role are to be passed in the header.
router.get("/user/", function (req, res, next) {
    console.log("All users in this guild");

    let GuildID = req.headers.guildid;

    const sqlQuery = `SELECT GU.UserID, U.UserName, GU.Role
        FROM GuildUser GU
        JOIN User U ON GU.UserID = U.UserID
        WHERE GU.GuildID = ${GuildID}
        ORDER BY GU.UserID;`;

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            return res.status(400).json({ Error: "Uh-oh" });
        }
        return res.status(200).json(result);
    });
});

/**
 * @swagger
 * /guild/user:
 *   post:
 *     summary: Add a new user to a guild
 *     description: Add a new user to a guild with a role. The guildid, userid, and role are to be passed in the header.
 *     tags: [Guild/User]
 *     parameters:
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
 *       -  in: role
 *          name: role
 *          required: true
 *          schema:
 *            type: string
 *     responses:
 *       200:
 *         description: User added
 *       400:
 *         description: Error adding user
 */
// Add a new GuildUser to a guild with a role.
// The guildid, userid, and role are to be passed in the header.
router.post("/user/", function (req, res, next) {
    console.log("Add a new user to the guild");

    let GuildID = req.headers.guildid;
    let UserID = req.headers.userid;
    let Role = req.headers.role;

    const sqlQuery = `INSERT INTO GuildUser (GuildID, UserID, Role)
        VALUES (${GuildID}, ${UserID}, '${Role}');`;

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            res.status(400);
        }
        return res.status(200).json(result);
    });
});

/**
 * @swagger
 * /guild/user:
 *   put:
 *     summary: Update a guildUsers role
 *     description: Update a guildUsers role. The guildid, userid, and role are to be passed in the header
 *     tags: [Guild/User]
 *     parameters:
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
 *       -  in: role
 *          name: role
 *          required: true
 *          schema:
 *            type: string
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Error updating user
 */
// Update a guildUsers Role within a guild.
// The guildid, userid, and role are to be passed in the header
router.put("/user/", function (req, res, next) {
    console.log("Update a GuildUsers role");

    let GuildID = req.headers.guildid;
    let UserID = req.headers.userid;
    let Role = req.headers.role;

    const sqlQuery = `UPDATE GuildUser
        SET Role = '${Role}'
        WHERE GuildID = ${GuildID} AND UserID = ${UserID};`;

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            res.status(400);
        }
        return res.status(200).json(result);
    });
});

/**
 * @swagger
 * /guild/user:
 *   delete:
 *     summary: Delete a guildUser
 *     description: Delete a guildUser. The guildid and userid are to be passed in the header
 *     tags: [Guild/User]
 *     parameters:
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
 *         description: User deleted
 *       400:
 *         description: Error deleting user
 */
// Delete a GuildUser from a guild.
// The guildid and userid are to be passed in the header
router.delete("/user/", function (req, res, next) {
    console.log("Remove a guild user");

    let GuildID = req.headers.guildid;
    let UserID = req.headers.userid;

    const sqlQuery = `DELETE FROM GuildUser
        WHERE GuildID = ${GuildID} AND UserID = ${UserID};`;

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            res.status(400);
        }
        return res.status(200).json(result);
    });
});

//// Webservice guild/channel/

/**
 * @swagger
 * /guild/channel:
 *   get:
 *     summary: Returns all channels in this guild
 *     description: Returns a json with all channels in this guild
 *     tags: [Guild/Channel]
 *     parameters:
 *       -  in: header
 *          name: guildid
 *          required: true
 *          schema:
 *            type: integer
 *     responses:
 *       200:
 *         description: All channels in this guild
 */
// Grab all of the channels of this specific guild by the GuildID in the body
// The guildid is to be passed in the header
router.get("/channel/", function (req, res, next) {
    console.log("All channels in this guild");

    let GuildID = req.headers.guildid;

    const sqlQuery = `SELECT ChannelID, ChannelName
        FROM Channel
        WHERE GuildID = ${GuildID};`;

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            res.status(400);
        }
        return res.status(200).json(result);
    });
});

/**
 * @swagger
 * /guild/channel:
 *   post:
 *     summary: Create a new channel
 *     description: Create a new channel within the specified guild
 *     tags: [Guild/Channel]
 *     responses:
 *       200:
 *         description: New channel created
 *       400:
 *         description: Error creating channel
 */
// Create a new channel within the specified guild
// The guild and channel name are both to be passed in the header
router.post("/channel/", function (req, res) {
    console.log("Create a new channel");

    let GuildID = req.headers.guildid;
    let ChannelName = req.headers.channelname;

    const sqlQuery = `INSERT INTO Channel (GuildID, ChannelName)
        VALUES (${GuildID}, '${ChannelName}')`;

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error creating new channel");
            console.log(err);
            return res.status(400);
        }
        return res.status(200).json({ ChannelID: result.insertId });
    });
});

/**
 * @swagger
 * /guild/channel:
 *   put:
 *     summary: Update the name of the channel
 *     description: Update the name of the channel within the specified guild
 *     tags: [Guild/Channel]
 *     responses:
 *       200:
 *         description: Channel updated
 *       400:
 *         description: Error updating channel
 */
// Update the name of the channel within the specified guild
// The guild and channel ID and channel name are to be passed in the header
router.put("/channel/", function (req, res) {
    console.log("Update channel name");

    let GuildID = req.headers.guildid;
    let ChannelID = req.headers.channelid;
    let ChannelName = req.headers.channelname;

    const sqlQuery = `UPDATE Channel SET ChannelName = '${ChannelName}'
        WHERE GuildID = ${GuildID} AND ChannelID = ${ChannelID}`;

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.error("Error updating channelname", err);
            return res.status(404);
        }
        return res.status(200).json(result);
    });
});

/**
 * @swagger
 * /guild/channel:
 *   delete:
 *     summary: Delete a channel
 *     description: Delete a channel within a specified guild
 *     tags: [Guild/Channel]
 *     responses:
 *       200:
 *         description: Channel deleted
 *       400:
 *         description: Error deleting channel
 */
// Delete a channel within a specified guild
// The guild and channel ID are both to be passed in the header
router.delete("/channel/", function (req, res) {
    console.log("Deleting a channel");

    let GuildID = req.headers.guildid;
    let ChannelID = req.headers.channelid;

    const sqlQuery = `DELETE FROM Channel
                    WHERE GuildID = ${GuildID} AND ChannelID = ${ChannelID}`;

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.error("Error deleting channel");
            res.status(400);
        }
        return res.status(200).json(result);
    });
});


module.exports = router;
