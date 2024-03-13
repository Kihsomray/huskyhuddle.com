var express = require('express');
var router = express.Router();

/*
* @swagger
* /role:   
*   get:
*     summary: Returns all roles
*     description: Returns a json with all roles
*     responses:
*       200:
*         description: All roles
*/
router.get("/", function(req, res, next) {
    res.send("Role API is working properly");
});

module.exports = router;
