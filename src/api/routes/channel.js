var express = require('express');
var router = express.Router();

router.get("/", function(req, res, next) {
    res.send("Channel API is working properly");
});

module.exports = router;
