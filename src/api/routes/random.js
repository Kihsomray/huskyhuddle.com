var express = require("express");
var router = express.Router();
var axios = require("axios");

const databaseConnect = require("../db/db-connect");


router.get("/", function (req, res, next) {
    console.log("Random is working");

    const sqlQuery = "SELECT * FROM Message;";
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            return res.status(400).json({
                "Error executing SQL statement to get all messages in database":
                    err,
            });
        }
        return res.status(200).json(result);
    });
});



module.exports = router;
