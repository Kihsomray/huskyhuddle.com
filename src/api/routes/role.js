var express = require('express');
var router = express.Router();

/*
* @swagger
* /role:   
*   get:
*     summary: Returns string response "Role API is working properly"
*     description: Returns response that role API is working
*     responses:
*       200:
*         description: All roles
*/
router.get("/", function(req, res, next) {
    res.send("Role API is working properly");
});

module.exports = router;
