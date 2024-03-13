var express = require("express");
var router = express.Router();

const databaseConnect = require("../db/db-connect");

/*
* @swagger
* /message:   
*   get:
*     summary: Returns all messages
*     description: Returns a json with all messages
*     responses:
*       200:
*         description: All messages
*/
// YOUR ENDPOINT HERE, It will be called by GET local host 4000 /message/
router.get("/", function (req, res, next) {
    

    const sqlQuery = "SELECT * FROM Message;";
    databaseConnect.query(sqlQuery, (err, result) => {
        if (err) {
            console.log("Error");
            res.status(400);
        }
        return res.status(200).json(result);
    });
});



module.exports = router;