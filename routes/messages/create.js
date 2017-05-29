var db = require('../../db').db;
var uuid = require('uuid');

function create(req, res, next) {
    var message = req.body.message;
    if (message) {
        var sql = "INSERT INTO messages(message_id, message) VALUES (?, ?)";
        db.run(sql, [uuid.v4(), message], function (err, rows) {
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
}

module.exports = create;
