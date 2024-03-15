var express = require("express");
var router = express.Router();

const databaseConnect = require("../db/db-connect");

/**
 * @swagger
 * /info:
 *   get:
 *     summary: Returns the program name and version
 *     description: Returns a JSON object containing the name and version of the program.
 *     responses:
 *       200:
 *         description: Name and version of the program
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: HuskyHuddle
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 */
// Simple API to return the program name and version
router.get("/", function (req, res, next) {
    return res.status(200).json({
        name: "HuskyHuddle",
        version: "1.0.0",
    });
});

module.exports = router;
