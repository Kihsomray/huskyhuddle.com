var express = require("express");
var router = express.Router();


const databaseConnect = require("../db/db-connect");

// let dbConnection = databaseConnect;

router.get("/", function(req, res, next) {

    const sqlQuery = "SELECT * FROM Guild;"
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            res.status(400);
        } 
        // console.log("result");
        // console.log(result);
        // console.log("result2");
        // result1 = result;
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

        res.setHeader('user', "USERNAME");
        res.setHeader('pass', "PASSWORD");
        return res.status(200).json(result);
    });
});

module.exports = router;

