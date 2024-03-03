var express = require("express");
var router = express.Router();


const databaseConnect = require("../db/db-connect");

let dbConnection = databaseConnect;

router.get("/", function(req, res, next) {


    res.send("Guild API is working properly");

    console.log(databaseConnect.config.database);
    const sqlQuery = "SELECT * FROM categories;"


    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
        } 
        console.log("result");
        console.log(result);
        console.log("result2");
        result1 = result;
    });


});

module.exports = router;

