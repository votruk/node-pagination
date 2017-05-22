var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */
router.get('/', function (req, res, next) {
    db.all("SELECT * FROM messages", function (err, rows) {
        res.json(rows);
    });
});

router.post('/', function (req, res, next) {
    var message = req.body.message;
    if (message) {
        var sql = "INSERT INTO messages(message) VALUES (?)";
        db.run(sql, [message], function (err, rows) {
            if (err) {
                console.err(err);
                res.status(500);
            } else {
                res.status(200);
            }
            res.end();
        });
    } else {
        res.json({error: "provide message, please"});
    }
});

module.exports = router;
