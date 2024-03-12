var express = require("express");
var router = express.Router();

const databaseConnect = require("../db/db-connect");

// let dbConnection = databaseConnect;


//// Webservice guild/

/**
 * @swagger
 * /:
 *   get:
 *     summary: Retrieve all guilds
 *     description: Returns a list of all guilds from the database.
 *     tags: [Guilds]
 *     responses:
 *       200:
 *         description: A list of guilds.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   GuildID:
 *                     type: integer
 *                     description: The unique identifier of the guild.
 *                     example: 1
 *                   GuildName:
 *                     type: string
 *                     description: The name of the guild.
 *                     example: "Knights of the Round Table"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating the failure to connect to the database.
 *                   example: "Couldn't connect to database"
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
 * /:
 *   post:
 *     summary: Create a new guild
 *     description: Adds a new guild to the database with the provided name.
 *     tags: [Guilds]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - GuildName
 *             properties:
 *               GuildName:
 *                 type: string
 *                 description: The name of the new guild.
 *                 example: "Adventurers of the Lost Ark"
 *     responses:
 *       200:
 *         description: Guild successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: integer
 *                   description: The number of rows affected by the insert operation.
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
 *                   example: "Error creating new guild"
 */
// Create a new guild with the name provided in the body of the request with GuildName : "Some guild name goes here" in the json
// {"GuildName" : "newGuild"} as an example as of what to put in the body
router.post("/", function (req, res, next) {
    console.log("Guild POST API");

    let GuildName = req.body.GuildName;

    const sqlQuery = `INSERT INTO Guild (GuildName)
        VALUES ('${GuildName}');`;
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            return result.status(400);
        }
        return result.status(200).json(result);
    });
});

// Update a guild with a new name based off of the guildID
// {"GuildName" : "newGuild"} as an example as of what to put in the body
router.put("/", function (req, res, next) {
    console.log("Guild update");

    let GuildName = req.body.GuildName;
    let GuildID = req.body.GuildID;

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
 * /:
 *   delete:
 *     summary: Delete a guild and its members
 *     description: Deletes an existing guild and all its members from the database based on the provided guild ID. This operation removes the guild and disassociates all members from this guild, but does not delete the users from the database.
 *     tags: [Guilds]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - GuildID
 *             properties:
 *               GuildID:
 *                 type: integer
 *                 description: The unique identifier of the guild to be deleted.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Guild and its members successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: integer
 *                   description: The number of rows affected by the deletion operation.
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
 *                   example: "Error deleting guild or its members"
 */
// Delete a guild and also remove all members of that guild by deleting all guildUsers of that guild
// {"GuildID" : "5"} as an example as of what to put in the body
router.delete("/", function (req, res, next) {
    console.log("Guild Delete");

    let GuildID = req.body.GuildID;

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
 * /user/:
 *   get:
 *     summary: Retrieve all users in a specific guild
 *     description: Returns a list of all users belonging to a specified guild, including their roles within the guild.
 *     tags: [Guild Users]
 *     parameters:
 *       - in: query
 *         name: GuildID
 *         required: true
 *         description: The unique identifier of the guild.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of guild users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   UserID:
 *                     type: integer
 *                     description: The unique identifier of the user.
 *                   UserName:
 *                     type: string
 *                     description: The name of the user.
 *                   Role:
 *                     type: string
 *                     description: The role of the user within the guild.
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Error:
 *                   type: string
 *                   description: Error message indicating what went wrong.
 *                   example: "Uh-oh"
 */
// Grab all of the GuildUsers of this specific guild by the GuildID in the body
// {"GuildID" : "5"} as an example as of what to put in the body
router.get("/user/", function (req, res, next) {
    console.log("All users in this guild");

    let GuildID = req.body.GuildID;

    const sqlQuery = `SELECT GU.UserID, U.UserName, GU.Role
        FROM GuildUser GU
        JOIN User U ON GU.UserID = U.UserID
        WHERE GU.GuildID = ${GuildID}
        ORDER BY GU.UserID;`;

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            return res.status(400).json({"Error" : "Uh-oh"});
        }
        return res.status(200).json(result);
    });
});

/**
 * @swagger
 * /user/:
 *   post:
 *     summary: Add a new user to a guild
 *     description: Adds a new user to a specified guild with a given role.
 *     tags: [Guild Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - GuildID
 *               - UserID
 *               - Role
 *             properties:
 *               GuildID:
 *                 type: integer
 *                 description: The unique identifier of the guild.
 *                 example: 1
 *               UserID:
 *                 type: integer
 *                 description: The unique identifier of the user to be added to the guild.
 *                 example: 2
 *               Role:
 *                 type: string
 *                 description: The role of the user within the guild.
 *                 example: "Member"
 *     responses:
 *       200:
 *         description: User successfully added to the guild.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: integer
 *                   description: The number of rows affected by the insert operation.
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
 *                   example: "Error adding new user to guild"
 */
// Add a new GuildUser to a guild with a role. GuildID, UserID, and Role required in the body.
// {"GuildID" : "5", "UserID" : "5", "Member"} as an example as of what to put in the body
router.post("/user/", function (req, res, next) {
    console.log("Add a new user to the guild");

    let GuildID = req.body.GuildID;
    let UserID = req.body.UserID;
    let Role = req.body.Role;

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
 * /user/:
 *   put:
 *     summary: Update a user's role within a guild
 *     description: Updates the role of an existing user within a specified guild.
 *     tags: [Guild Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - GuildID
 *               - UserID
 *               - Role
 *             properties:
 *               GuildID:
 *                 type: integer
 *                 description: The unique identifier of the guild.
 *                 example: 1
 *               UserID:
 *                 type: integer
 *                 description: The unique identifier of the user whose role is to be updated.
 *                 example: 2
 *               Role:
 *                 type: string
 *                 description: The new role of the user within the guild.
 *                 example: "Admin"
 *     responses:
 *       200:
 *         description: User's role successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: integer
 *                   description: The number of rows affected by the update operation.
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
 *                   example: "Error updating user's role"
 */
// Update a guildUsers Role within a guild. GuildID, UserID, and Role required in the body.
// {"GuildID" : "5", "UserID" : "5", "Member"} as an example as of what to put in the body
router.put("/user/", function (req, res, next) {
    console.log("Update a GuildUsers role");

    let GuildID = req.body.GuildID;
    let UserID = req.body.UserID;
    let Role = req.body.Role;

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
 * /user/:
 *   delete:
 *     summary: Remove a user from a guild
 *     description: Deletes a user from a specified guild based on the provided guild and user IDs.
 *     tags: [Guild Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - GuildID
 *               - UserID
 *             properties:
 *               GuildID:
 *                 type: integer
 *                 description: The unique identifier of the guild.
 *                 example: 1
 *               UserID:
 *                 type: integer
 *                 description: The unique identifier of the user to be removed from the guild.
 *                 example: 2
 *     responses:
 *       200:
 *         description: User successfully removed from the guild.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: integer
 *                   description: The number of rows affected by the delete operation.
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
 *                   example: "Error removing user from guild"
 */
// Delete a GuildUser from a guild. GuildID and UserID required in the body.
// {"GuildID" : "5", "UserID" : "5"} as an example as of what to put in the body
router.delete("/user/", function (req, res, next) {
    console.log("Remove a guild user");

    let GuildID = req.body.GuildID;
    let UserID = req.body.UserID;

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

/**
 * @swagger
 * /channel/:
 *   get:
 *     summary: Retrieve all channels in a specific guild
 *     description: Returns a list of all channels belonging to a specified guild.
 *     tags: [Channels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - GuildID
 *             properties:
 *               GuildID:
 *                 type: integer
 *                 description: The unique identifier of the guild.
 *                 example: 1
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
 *                     description: The unique identifier of the channel.
 *                   ChannelName:
 *                     type: string
 *                     description: The name of the channel.
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating the failure to retrieve channels.
 *                   example: "No GuildID specified"
 */
// Get channels from this specific GuildID
// {"GuildID": "5"} as an example as of what to put in the body
router.get("/channel/", function (req, res) {
    console.log("Get all the channels from this guild");

    let GuildID = req.body.GuildID;

    if (!GuildID) {
        return res.status(400).json({ error: "No GuildID specified"});
    }

    const sqlQuery = `SELECT * FROM Channel
        WHERE GuildID = ${GuildID}`;

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
 * /channel/:
 *   post:
 *     summary: Create a new channel within a guild
 *     description: Adds a new channel to the specified guild with the provided channel name.
 *     tags: [Channels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - GuildID
 *               - ChannelName
 *             properties:
 *               GuildID:
 *                 type: integer
 *                 description: The unique identifier of the guild.
 *                 example: 1
 *               ChannelName:
 *                 type: string
 *                 description: The name of the new channel.
 *                 example: "General Discussion"
 *     responses:
 *       200:
 *         description: Channel successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: integer
 *                   description: The number of rows affected by the insert operation.
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
 *                   example: "Error creating new channel"
 */
// Create a new channel within the specified guild
router.post("/channel/", function (req, res) {
    console.log("Create a new channel");

    let GuildID = req.body.GuildID;
    let ChannelName = req.body.ChannelName;

    const sqlQuery = `INSERT INTO Channel (GuildID, ChannelName)
        VALUES (${GuildID}, '${ChannelName}')`;

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error creating new channel");
            console.log(err);
            return res.status(400);
        }
        return res.status(200).json(result);
    });
});

/**
 * @swagger
 * /channel/:
 *   put:
 *     summary: Update the name of a channel within a guild
 *     description: Updates the name of an existing channel within the specified guild.
 *     tags: [Channels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - GuildID
 *               - ChannelID
 *               - ChannelName
 *             properties:
 *               GuildID:
 *                 type: integer
 *                 description: The unique identifier of the guild.
 *                 example: 1
 *               ChannelID:
 *                 type: integer
 *                 description: The unique identifier of the channel to be updated.
 *                 example: 2
 *               ChannelName:
 *                 type: string
 *                 description: The new name of the channel.
 *                 example: "Updated Channel Name"
 *     responses:
 *       200:
 *         description: Channel name successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: integer
 *                   description: The number of rows affected by the update operation.
 *                   example: 1
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating the channel could not be found or updated.
 *                   example: "Error updating channel name"
 */
// Update the name of the channel within the specified guild
router.put("/channel/", function (req, res) {
    console.log("Update channel name");

    let GuildID = req.body.GuildID;
    let ChannelID = req.body.ChannelID;
    let ChannelName = req.body.ChannelName;

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
 * /channel/:
 *   delete:
 *     summary: Delete a channel within a specified guild
 *     description: Deletes a channel from a specified guild based on the provided guild and channel IDs.
 *     tags: [Channels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - GuildID
 *               - ChannelID
 *             properties:
 *               GuildID:
 *                 type: integer
 *                 description: The unique identifier of the guild.
 *                 example: 1
 *               ChannelID:
 *                 type: integer
 *                 description: The unique identifier of the channel to be deleted.
 *                 example: 2
 *     responses:
 *       200:
 *         description: Channel successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: integer
 *                   description: The number of rows affected by the delete operation.
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
 *                   example: "Error deleting channel"
 */
//Delete a channel within a specified guild
router.delete("/channel/", function (req, res) {
    console.log("Deleting a channel");

    let GuildID = req.body.GuildID;
    let ChannelID = req.body.ChannelID;

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

//// Webservice guild/channel/

/**
 * @swagger
 * /channel/:
 *   get:
 *     summary: Retrieve all channels in a specific guild
 *     description: Returns a list of all channels belonging to a specified guild.
 *     tags: [Channels]
 *     parameters:
 *       - in: query
 *         name: GuildID
 *         required: true
 *         description: The unique identifier of the guild.
 *         schema:
 *           type: integer
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
 *                     description: The unique identifier of the channel.
 *                   ChannelName:
 *                     type: string
 *                     description: The name of the channel.
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating the failure to retrieve channels.
 *                   example: "No GuildID specified or other error"
 */
// Grab all of the channels of this specific guild by the GuildID in the body
// {"GuildID" : "5"} as an example as of what to put in the body 
router.get("/channel/", function(req, res, next) {
    console.log("All channels in this guild");

    let GuildID = req.body.GuildID;

    const sqlQuery = 
        `SELECT ChannelID, ChannelName
        FROM Channel
        WHERE GuildID = ${GuildID};`

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
 * /channel/:
 *   post:
 *     summary: Create a new channel within a guild
 *     description: Adds a new channel to the specified guild with the provided channel name.
 *     tags: [Channels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - GuildID
 *               - ChannelName
 *             properties:
 *               GuildID:
 *                 type: integer
 *                 description: The unique identifier of the guild.
 *                 example: 1
 *               ChannelName:
 *                 type: string
 *                 description: The name of the new channel.
 *                 example: "General Discussion"
 *     responses:
 *       200:
 *         description: Channel successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: integer
 *                   description: The number of rows affected by the insert operation.
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
 *                   example: "Error creating new channel"
 */
// Create a new channel within the specified guild
router.post("/channel/", function (req, res) {
    console.log("Create a new channel");

    let GuildID = req.body.GuildID;
    let ChannelName = req.body.ChannelName;

    const sqlQuery = `INSERT INTO Channel (GuildID, ChannelName)
        VALUES (${GuildID}, '${ChannelName}')`;

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error creating new channel");
            console.log(err);
            return res.status(400);
        }
        return res.status(200).json(result);
    });
});

/**
 * @swagger
 * /channel/:
 *   put:
 *     summary: Update the name of a channel within a guild
 *     description: Updates the name of an existing channel within the specified guild.
 *     tags: [Channels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - GuildID
 *               - ChannelID
 *               - ChannelName
 *             properties:
 *               GuildID:
 *                 type: integer
 *                 description: The unique identifier of the guild.
 *                 example: 1
 *               ChannelID:
 *                 type: integer
 *                 description: The unique identifier of the channel to be updated.
 *                 example: 2
 *               ChannelName:
 *                 type: string
 *                 description: The new name of the channel.
 *                 example: "Updated Channel Name"
 *     responses:
 *       200:
 *         description: Channel name successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: integer
 *                   description: The number of rows affected by the update operation.
 *                   example: 1
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating the channel could not be found or updated.
 *                   example: "Error updating channel name"
 */
// Update the name of the channel within the specified guild
router.put("/channel/", function (req, res) {
    console.log("Update channel name");

    let GuildID = req.body.GuildID;
    let ChannelID = req.body.ChannelID;
    let ChannelName = req.body.ChannelName;

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
 * /channel/:
 *   delete:
 *     summary: Delete a channel within a specified guild
 *     description: Deletes a channel from a specified guild based on the provided guild and channel IDs.
 *     tags: [Channels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - GuildID
 *               - ChannelID
 *             properties:
 *               GuildID:
 *                 type: integer
 *                 description: The unique identifier of the guild.
 *                 example: 1
 *               ChannelID:
 *                 type: integer
 *                 description: The unique identifier of the channel to be deleted.
 *                 example: 2
 *     responses:
 *       200:
 *         description: Channel successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: integer
 *                   description: The number of rows affected by the delete operation.
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
 *                   example: "Error deleting channel"
 */
//Delete a channel within a specified guild
router.delete("/channel/", function (req, res) {
    console.log("Deleting a channel");

    let GuildID = req.body.GuildID;
    let ChannelID = req.body.ChannelID;

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

// How to get headers, like this
// let username = req.headers.username;
// let password = req.headers.password;

module.exports = router;
