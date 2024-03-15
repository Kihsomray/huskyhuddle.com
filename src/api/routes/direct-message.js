var express = require('express');
var router = express.Router();


/**
 * @swagger
 * tags:
 *   - name: Unfinished
 *     description: The unfinished API
 */

/**
 * @swagger
 * /dm:
 *   get:
 *     summary: Returns test message
 *     description: Direct Messages
 *     tags: [Unfinished]
 *     responses:
 *       200:
 *         description: Direct Messages
 */
router.get("/", function(req, res, next) {
    return res.status(200).json({"test" : "Direct Message API is working properly"});
});

module.exports = router;
