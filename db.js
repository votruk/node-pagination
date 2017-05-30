var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(":memory:");
var uuid = require('uuid');

function create_db() {
    db.serialize(function () {
        db.run(
            "CREATE TABLE IF NOT EXISTS messages (" +
            "  id         INTEGER  PRIMARY KEY AUTOINCREMENT," +
            "  message_id TEXT     NOT NULL," +
            "  message    TEXT     NOT NULL," +
            "  timestamp  DATETIME DEFAULT CURRENT_TIMESTAMP" +
            ");"
        );

        var stmt = db.prepare("INSERT INTO messages(message_id, message) VALUES (?, ?)");
        for (var i = 0; i < 40; i++) {
            stmt.run(uuid.v4(), "Message " + (i + 1));
        }
        stmt.finalize();

        db.each("SELECT * FROM messages", function (err, row) {
            console.log(row.message_id + ":  " + row.message + "  " + row.timestamp);
        });
    });
}

module.exports = {
    db: db,
    create_db_func: create_db
};