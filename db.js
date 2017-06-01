var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(":memory:");
var uuid = require('uuid');
var Promise = require("bluebird");

const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },

    // SQLite only
    storage: ''
});

const User = sequelize.define('user', {
    username: Sequelize.STRING,
    birthday: Sequelize.DATE
});

sequelize
    .authenticate()
    .then(() => {
    console.log('Connection has been established successfully.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});

function create_db() {
    db.serialize(function () {
        db.run(
            "CREATE TABLE IF NOT EXISTS messages (" +
            "  id         INTEGER  PRIMARY KEY AUTOINCREMENT," +
            "  message_id TEXT     NOT NULL," +
            "  message    TEXT     NOT NULL," +
            "  timestamp  DATETIME DEFAULT CURRENT_TIMESTAMP" +
            "); " +
            "CREATE UNIQUE INDEX id_index ON id_index(message_id, message);"
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