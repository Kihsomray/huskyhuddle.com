var express = require('express');
var router = express.Router();

/*
* @swagger
* /direct-message:   
*   get:
*     summary: Returns all direct messages
*     description: Returns a json with all direct messages
*     responses:
*       200:
*         description: All direct messages
*/
router.get("/", function(req, res, next) {
    res.send("Direct Message API is working properly");
});

module.exports = router;
