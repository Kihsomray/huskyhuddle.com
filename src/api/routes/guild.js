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
    console.log(GuildName);

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

router.get("/user/", function(req, res, next) {

    console.log("Guilds of a specific user");

    let username = req.headers.username;
    let password = req.headers.password;

    const sqlQuery = 
        `SELECT g.GuildID, g.GuildName
        FROM GuildUser gu
        JOIN Guild g ON gu.GuildID = g.GuildID
        WHERE gu.UserID = (
            SELECT UserID
            FROM User
            WHERE UserName = '${username}' AND UserPass = '${password}'
        );`

    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            console.log(err);
            res.status(400);
        } 
        return res.status(200).json(result);
    });
});

router.get("/user/", function(req, res, next) {

    // res.send("Guild API is working properly");

    console.log(databaseConnect.config.database);
    const sqlQuery = 
        `SELECT User.*, GuildUser.Role, Guild.GuildName
        FROM User
        INNER JOIN GuildUser ON User.UserID = GuildUser.UserID
        INNER JOIN Guild ON GuildUser.GuildID = Guild.GuildID
        ORDER BY Guild.GuildName, User.UserName;`


    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
        } 
        console.log(result);


        return res.status(200).json(result);
    });
});


router.get("/user/user/", function(req, res, next) {

    // res.send("Guild API is working properly");



    let username = req.headers.username;
    let password = req.headers.password;


    console.log(databaseConnect.config.database);
    const sqlQuery = 
        `SELECT User.*, GuildUser.Role, Guild.GuildName
        FROM User
        INNER JOIN GuildUser ON User.UserID = GuildUser.UserID
        INNER JOIN Guild ON GuildUser.GuildID = Guild.GuildID
        ORDER BY Guild.GuildName, User.UserName;`


    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
        } 
        //console.log(result);

        res.setHeader('user', "USERNAME");
        res.setHeader('pass', "PASSWORD");
        return res.status(200).json(result);
    });
});

module.exports = router;

