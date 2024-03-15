var express = require('express');
var router = express.Router();

/***
* @swagger
* /direct-message:   
*   get:
*     summary: Returns message about API working 
*     description: Returns a message "Direct Message API is working properly"
*     responses:
*       200:
*         description: All direct messages
*/
router.get("/", function(req, res, next) {
    res.send("Direct Message API is working properly");
});

module.exports = router;
