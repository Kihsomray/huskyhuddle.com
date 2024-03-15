var express = require("express");
var router = express.Router();

const databaseConnect = require("../db/db-connect");

// /Admin/

//// Web service for all admin commands

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: The Admin managing API
 *   - name: Admin/Channel
 *     description: The Admin/Channel managing API
 *   - name: Admin/Guild
 *     description: The Admin/Guild managing API
 *   - name: Admin/User
 *     description: The Admin/User managing API
 * 
 * 
 */

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Checks if user is an admin
 *     description: Returns whether or not user is an admin of specific guild
 *     tags: [Admin]
 *     parameters:
 *       -  in: header
 *          name: userid
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: guildid
 *          required: true
 *          schema:
 *            type: integer
 *     responses:
 *       200:
 *         description: All admin commands
 */
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
            return result.status(400).json({ Error: "Uhoh" });
        }

        // console.log(result);
        // console.log(result.length);

        if (result.length == 0) {
            return res
                .status(400)
                .json({ Error: "User is not member of Guild" });
        } else if (result[0].Role !== "Admin") {
            return res.status(400).json({ Error: "User is not an Admin" });
        }

        return res.status(200).json(result[0]);
    });
});

/**
 * @swagger
 * /admin/channel:
 *   post:
 *     summary: Create a new channel within a guild
 *     description: Create a new channel within a guild with the name provided checks if the user is an admin
 *     tags: [Admin/Channel]
 *     parameters:
 *       -  in: header
 *          name: userid
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: guildid
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: channelname
 *          required: true
 *          schema:
 *            type: string
 *     responses:
 *       200:
 *         description: New channel created
 *       400:
 *         description: Error creating new channel
 */
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
            return result.status(400).json({ Error: "Uhoh" });
        }

        // console.log(result);
        // console.log(result.length);

        if (result.length == 0) {
            return res
                .status(400)
                .json({ Error: "User is not member of Guild" });
        } else if (result[0].Role !== "Admin") {
            return res.status(400).json({ Error: "User is not an Admin" });
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
                return result.status(400).json({ Error: err });
            }
            return res
                .status(200)
                .json({ ChannelID: result.insertId, ChannelName: ChannelName });
        });
    });
});

/**
 * @swagger
 * /admin/channel:
 *   put:
 *     summary: Update the name of the channel
 *     description: Update the name of the channel within the specified guild
 *     tags: [Admin/Channel]
 *     parameters:
 *       -  in: header
 *          name: userid
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: guildid
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: channelid
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: channelname
 *          required: true
 *          schema:
 *            type: string
 *     responses:
 *       200:
 *         description: Channel name updated
 *       400:
 *         description: Error updating channel name
 */
// change a channels name within a guild with the name provided.
// The userid, guildid and channelname, channelid is to be passed in the header.
router.put("/channel/", function (req, res, next) {
    console.log("/Admin/channel/ PUT API");

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
            return result.status(400).json({ Error: "Uhoh" });
        }

        // console.log(result);
        // console.log(result.length);

        if (result.length == 0) {
            return res
                .status(400)
                .json({ Error: "User is not member of Guild" });
        } else if (result[0].Role !== "Admin") {
            return res.status(400).json({ Error: "User is not an Admin" });
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
                return result.status(400).json({ Error: err });
            }
            return res.status(200).json({ ChannelID: ChannelID });
        });
    });
});

/**
 * @swagger
 * /admin/channel:
 *   delete:
 *     summary: Delete a channel
 *     description: Delete a channel within a specified guild
 *     tags: [Admin/Channel]
 *     parameters:
 *       -  in: header
 *          name: userid
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: guildid
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: channelid
 *          required: true
 *          schema:
 *            type: integer
 *     responses:
 *       200:
 *         description: Channel deleted
 *       400:
 *         description: Error deleting channel
 */
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
            return result.status(400).json({ Error: "Uhoh" });
        }

        // console.log(result);
        // console.log(result.length);

        if (result.length == 0) {
            return res
                .status(400)
                .json({ Error: "User is not member of Guild" });
        } else if (result[0].Role !== "Admin") {
            return res.status(400).json({ Error: "User is not an Admin" });
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
                return result.status(400).json({ Error: err });
            }
            return res
                .status(200)
                .json({ NumChannelsRemoved: result.affectedRows });
        });
    });
});


/**
 * @swagger
 * /admin/guild:
 *   post:
 *     summary: Create a new guild
 *     description: Create a new guild with a default channel named general and a user admin.
 *     tags: [Admin/Guild]
 *     parameters:
 *       -  in: header
 *          name: userid
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: guildname
 *          required: true
 *          schema:
 *            type: string
 *     responses:
 *       200:
 *         description: Guild name updated
 *       400:
 *         description: Error updating guild name
 */
// change a guilds name with the name provided.
// The userid, guildid and guildname is to be passed in the header.
router.post("/guild/", function (req, res, next) {
    console.log("/Admin/channel/ POST API");

    const UserID = req.headers.userid;
    //const GuildID = req.headers.guildid;
    const GuildName = req.headers.guildname;

    const sqlQueryRole = 
        `INSERT INTO Guild (GuildName)
        VALUES ('${GuildName}');`;

    databaseConnect.query(sqlQueryRole, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            return result.status(400).json({"Error" : "Uhoh"});
        }

        const GuildID = result.insertId;

        const sqlQuery = 
            `INSERT INTO GuildUser (GuildID, UserID, Role)
            VALUES (${GuildID}, ${UserID}, 'Admin');`;
        databaseConnect.query(sqlQuery, (err, result) => {
            if (err) {
                console.log("Error");
                console.log(err);
                return result.status(400).json({"Error" : err});
            }
            const sqlQueryChannel = 
                `INSERT INTO Channel (GuildID, ChannelName)
                VALUES (${GuildID}, 'General');`;
            databaseConnect.query(sqlQueryChannel, (err, result) => {
                if (err) {
                    console.log("Error");
                    console.log(err);
                    return result.status(400).json({"Error" : err});
                }
                return res.status(200).json({GuildID : GuildID, GuildName : GuildName});
            });
        });
    });
});


/**
 * @swagger
 * /admin/guild:
 *   put:
 *     summary: Update the name of the guild
 *     description: Update the name of the guild with the specified ID
 *     tags: [Admin/Guild]
 *     parameters:
 *       -  in: header
 *          name: userid
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: guildid
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: guildname
 *          required: true
 *          schema:
 *            type: string
 *     responses:
 *       200:
 *         description: Guild name updated
 *       400:
 *         description: Error updating guild name
 */
// change a guilds name with the name provided.
// The userid, guildid and guildname is to be passed in the header.
router.put("/guild/", function (req, res, next) {
    console.log("/Admin/channel/ PUT API");

    const UserID = req.headers.userid;
    const GuildID = req.headers.guildid;
    const GuildName = req.headers.guildname;

    const sqlQueryRole = 
        `SELECT Role
        FROM GuildUser
        WHERE UserID = ${UserID} AND GuildID = ${GuildID};`;

    databaseConnect.query(sqlQueryRole, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            return result.status(400).json({ Error: "Uhoh" });
        }

        // console.log(result);
        // console.log(result.length);

        if (result.length == 0) {
            return res
                .status(400)
                .json({ Error: "User is not member of Guild" });
        } else if (result[0].Role !== "Admin") {
            return res.status(400).json({ Error: "User is not an Admin" });
        }

        //return res.status(200).json(result[0]);
        // If here the user is an admin

        const sqlQuery = 
            `UPDATE Guild
            SET GuildName = '${GuildName}'
            WHERE GuildID = ${GuildID};`;
        databaseConnect.query(sqlQuery, (err, result) => {
            if (err) {
                console.log("Error");
                console.log(err);
                return result.status(400).json({ Error: err });
            }
            return res.status(200).json({ NewName: GuildName });
        });
    });
});

/**
 * @swagger
 * /admin/guild:
 *   delete:
 *     summary: Delete a guild
 *     description: Delete a guild with the specified guildid
 *     tags: [Admin/Guild]
 *     parameters:
 *       -  in: header
 *          name: userid
 *          required: true
 *          schema:
 *            type: integer
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
// Delete the entire guild
// The userid, guildid is to be passed in the header.
router.delete("/guild/", function (req, res, next) {
    console.log("/Admin/guild/ DELETE API");

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
            return result.status(400).json({ Error: err });
        }

        // console.log(result);
        // console.log(result.length);

        if (result.length == 0) {
            return res
                .status(400)
                .json({ Error: "User is not member of Guild" });
        } else if (result[0].Role !== "Admin") {
            return res.status(400).json({ Error: "User is not an Admin" });
        }

        //return res.status(200).json(result[0]);
        // If here the user is an admin

        const sqlQueryGuildUser = `DELETE FROM GuildUser
            WHERE GuildID = ${GuildID};`;
        databaseConnect.query(sqlQueryGuildUser, (err, result) => {
            if (err) {
                console.log("Error");
                console.log(err);
                return result.status(400).json({ Error: err });
            }
            //return res.status(200).json({"NumOfGuildsRemoved": result.affectedRows});
            console.log("All guildUsers removed");
        });

        const sqlQuery = 
            `DELETE FROM Guild
            WHERE GuildID = ${GuildID};`;
        databaseConnect.query(sqlQuery, (err, result) => {
            if (err) {
                console.log("Error");
                console.log(err);
                return result.status(400).json({ Error: err });
            }
            return res
                .status(200)
                .json({ NumOfGuildsRemoved: result.affectedRows });
        });
    });
});

/**
 * @swagger
 * /admin/user:
 *   put:
 *     summary: Update a user's role
 *     description: Update a user's role within the specified guild
 *     tags: [Admin/User]
 *     parameters:
 *       -  in: header
 *          name: userid
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: guildid
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: useridchange
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: role
 *          required: true
 *          schema:
 *            type: string
 *     responses:
 *       200:
 *         description: User's role updated
 *       400:
 *         description: Error updating user's role
 */
// Change a members role.
// The admins userid, guildid, useridchange, and role to be passed in the header.
router.put("/user/", function (req, res, next) {
    console.log("/Admin/channel/ PUT API");

    const UserID = req.headers.userid;
    const GuildID = req.headers.guildid;
    const UserIDToChange = req.headers.useridchange;
    const Role = req.headers.role;

    const sqlQueryRole = 
        `SELECT Role
        FROM GuildUser
        WHERE UserID = ${UserID} AND GuildID = ${GuildID};`;

    databaseConnect.query(sqlQueryRole, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            return result.status(400).json({ Error: "Uhoh" });
        }

        // console.log(result);
        // console.log(result.length);

        if (result.length == 0) {
            return res
                .status(400)
                .json({ Error: "User is not member of Guild" });
        } else if (result[0].Role !== "Admin") {
            return res.status(400).json({ Error: "User is not an Admin" });
        }

        //return res.status(200).json(result[0]);
        // If here the user is an admin

        const sqlQuery = 
            `UPDATE GuildUser
            SET Role = '${Role}'
            WHERE GuildID = ${GuildID} AND UserID = ${UserIDToChange};`;
        databaseConnect.query(sqlQuery, (err, result) => {
            if (err) {
                console.log("Error");
                console.log(err);
                return result.status(400).json({ Error: err });
            }
            return res.status(200).json({ NewRole: Role });
        });
    });
});

/**
 * @swagger
 * /admin/user:
 *   delete:
 *     summary: Remove a user from the guild
 *     description: Remove a user from the guild with the specified userid and guildid
 *     tags: [Admin/User]
 *     parameters:
 *       -  in: header
 *          name: userid
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: guildid
 *          required: true
 *          schema:
 *            type: integer
 *       -  in: header
 *          name: useridremove
 *          required: true
 *          schema:
 *            type: integer
 *     responses:
 *       200:
 *         description: User removed
 *       400:
 *         description: Error removing user
 */
// Remove a user from the guild
// The userid, guildid is to be passed in the header.
router.delete("/user/", function (req, res, next) {
    console.log("/Admin/guild/ DELETE API");

    const UserID = req.headers.userid;
    const GuildID = req.headers.guildid;
    const UserIDToRemove = req.headers.useridremove;

    const sqlQueryRole = 
        `SELECT Role
        FROM GuildUser
        WHERE UserID = ${UserID} AND GuildID = ${GuildID};`;

    databaseConnect.query(sqlQueryRole, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            return result.status(400).json({ Error: err });
        }

        // console.log(result);
        // console.log(result.length);

        if (result.length == 0) {
            return res
                .status(400)
                .json({ Error: "User is not member of Guild" });
        } else if (result[0].Role !== "Admin") {
            return res.status(400).json({ Error: "User is not an Admin" });
        }

        //return res.status(200).json(result[0]);
        // If here the user is an admin

        const sqlQueryGuildUser = 
            `DELETE FROM GuildUser
            WHERE GuildID = ${GuildID} AND UserID = ${UserIDToRemove};`;
        databaseConnect.query(sqlQueryGuildUser, (err, result) => {
            if (err) {
                console.log("Error");
                console.log(err);
                return result.status(400).json({ Error: err });
            }
            return res
                .status(200)
                .json({ NumOfUsersRemoved: result.affectedRows });
        });
    });
});

module.exports = router;
