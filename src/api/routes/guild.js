var express = require("express");
var router = express.Router();


const databaseConnect = require("../db/db-connect");

// let dbConnection = databaseConnect;

// Get all guilds, returns a json with all guilds 
router.get("/", function(req, res, next) {
    console.log("Guild API");

    const sqlQuery = "SELECT * FROM Guild;"
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            res.status(400);
        } 
        return res.status(200).json(result);
    });
});

// Create a new guild with the name provided in the body of the request with GuildName : "Some guild name goes here" in the json
// {"GuildName" : "newGuild"} as an example as of what to put in the body
router.post("/", function(req, res, next) {
    console.log("Guild POST API");

    let GuildName = req.body.GuildName;

    const sqlQuery = 
        `INSERT INTO Guild (GuildName)
        VALUES ('${GuildName}');`;
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            res.status(400);
        } 
        return res.status(200).json(result);
    });
});

// Update a guild with a new name based off of the guildID
// {"GuildName" : "newGuild"} as an example as of what to put in the body
router.put("/", function(req, res, next) {
    console.log("Guild update");

    let GuildName = req.body.GuildName;
    let GuildID = req.body.GuildID;

    const sqlQuery = 
        `UPDATE Guild
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

// Delete a guild and also remove all members of that guild by deleting all guildUsers of that guild
// {"GuildID" : "5"} as an example as of what to put in the body
router.delete("/", function(req, res, next) {
    console.log("Guild Delete");

    let GuildID = req.body.GuildID;

    // Delete the members of a guild, this is safe because the users are still guildusers
    // of any other guild they are a part of but they are removed from this specific guild  
    const sqlQuery = 
        `DELETE FROM GuildUser
        WHERE GuildID = ${GuildID};`
    const sqlQuery2 =     
        `DELETE FROM Guild
        WHERE GuildID = ${GuildID};`
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



// Grab all of the GuildUsers of this specific guild by the GuildID in the body
// {"GuildID" : "5"} as an example as of what to put in the body 
router.get("/user/", function(req, res, next) {

    console.log("All users in this guild");

    let GuildID = req.body.GuildID;

    const sqlQuery = 
        `SELECT GU.UserID, U.UserName, GU.Role
        FROM GuildUser GU
        JOIN User U ON GU.UserID = U.UserID
        WHERE GU.GuildID = ${GuildID}
        ORDER BY GU.UserID;`

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            res.status(400);
        } 
        return res.status(200).json(result);
    });
});

// Add a new GuildUser to a guild with a role. GuildID, UserID, and Role required in the body.
// {"GuildID" : "5", "UserID" : "5", "Member"} as an example as of what to put in the body 
router.post("/user/", function(req, res, next) {

    console.log("Add a new user to the guild");

    let GuildID = req.body.GuildID;
    let UserID = req.body.UserID;
    let Role = req.body.Role;

    const sqlQuery = 
        `INSERT INTO GuildUser (GuildID, UserID, Role)
        VALUES (${GuildID}, ${UserID}, '${Role}');`

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            res.status(400);
        } 
        return res.status(200).json(result);
    });
});

// Update a guildUsers Role within a guild. GuildID, UserID, and Role required in the body.
// {"GuildID" : "5", "UserID" : "5", "Member"} as an example as of what to put in the body 
router.put("/user/", function(req, res, next) {

    console.log("Update a GuildUsers role");

    let GuildID = req.body.GuildID;
    let UserID = req.body.UserID;
    let Role = req.body.Role;

    const sqlQuery = 
        `UPDATE GuildUser
        SET Role = '${Role}'
        WHERE GuildID = ${GuildID} AND UserID = ${UserID};`

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            res.status(400);
        } 
        return res.status(200).json(result);
    });
});

// Delete a GuildUser from a guild. GuildID and UserID required in the body.
// {"GuildID" : "5", "UserID" : "5"} as an example as of what to put in the body 
router.delete("/user/", function(req, res, next) {

    console.log("Remove a guild user");

    let GuildID = req.body.GuildID;
    let UserID = req.body.UserID;

    const sqlQuery = 
        `DELETE FROM GuildUser
        WHERE GuildID = ${GuildID} AND UserID = ${UserID};`

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            res.status(400);
        } 
        return res.status(200).json(result);
    });
});


// How to get headers, like this
// let username = req.headers.username;
// let password = req.headers.password;



module.exports = router;
