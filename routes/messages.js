var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/getAll', function (req, res, next) {
    db.all("SELECT * FROM messages", function (err, rows) {
        if (err) {
            console.err(err);
            res.status(500);
        } else {
            res.json(rows);
        }
    });
});

router.post('/send', function (req, res, next) {
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
        res.json({error: "Provide message, please"});
    }
});

router.get('/getByOffset', function (req, res, next) {
    var offset = parseInt(req.query.offset) || 0;
    var limit = parseInt(req.query.limit) || 5;
    var sql = "SELECT * FROM messages ORDER BY message_id DESC LIMIT ? OFFSET ?";
    db.all(sql, [limit, offset], function (err, rows) {
        if (err) {
            console.err(err);
            res.status(500);
        } else {
            res.json(rows);
        }
    });
});

router.get('/getByAnchor', function (req, res, next) {
    var message_anchor = parseInt(req.query.anchor) || undefined;
    var limit = parseInt(req.query.limit) || 5;

    var direction = req.query.direction;
    var toOldest;
    if (direction === undefined) {
        res.json({error: "Please, provide order of messages: direction = toNewest or toOldest"});
        return;
    } else if (direction === "toOldest") {
        toOldest = true;
    } else if (direction === "toNewest") {
        toOldest = false;
    } else {
        res.json({error: "Direction should be toNewest or toOldest"});
        return;
    }


    if (message_anchor !== undefined) {
        with_anchor(res, toOldest, message_anchor, limit);
    } else {
        without_anchor(res, toOldest, limit);
    }

});


function with_anchor(res, toOldest, message_anchor, limit) {
    var anchored_sql;
    if (toOldest) {
        anchored_sql = "SELECT * FROM messages WHERE message_id < ?  ORDER BY message_id DESC LIMIT ?";
    } else {
        anchored_sql = "SELECT * FROM messages WHERE message_id > ?  ORDER BY message_id ASC LIMIT ?";
    }

    db.all(anchored_sql, [message_anchor, limit], function (err, rows) {
        if (err) {
            console.err(err);
            res.status(500);
        } else {
            res.json(rows);
        }
    });
}

function without_anchor(res, toOldest, limit) {
    var sql;
    if (toOldest) {
        sql = "SELECT * FROM messages ORDER BY message_id DESC LIMIT ?";
    } else {
        sql = "SELECT * FROM messages ORDER BY message_id ASC LIMIT ?";
    }
    db.all(sql, [limit], function (err, rows) {
        if (err) {
            console.err(err);
            res.status(500);
        } else {
            res.json(rows);
        }
    });
}

module.exports = router;
