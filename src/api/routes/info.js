var express = require("express");
var router = express.Router();

const databaseConnect = require("../db/db-connect");

// Simple API to return the program name and version
router.get("/", function(req, res, next) {
    return res.status(200).json({
        name : "HuskyHuddle",
        version : "1.0.0"
    });
});

module.exports = router;