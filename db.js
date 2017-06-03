const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(":memory:");
const uuid = require('uuid');

const Sequelize = require('sequelize');
const sequelize = new Sequelize('sequelize.sqlite', 'username', null, {
    host: 'localhost',
    dialect: 'sqlite',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },

    // SQLite only
    storage: 'sequelize.sqlite'
});

const Message = sequelize.define('message', {
    // id: { type: Sequelize.INTEGER, autoIncrement: true,  allowNull: false, primaryKey: true},
    message_id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4},
    message: {type: Sequelize.STRING, allowNull: false}
});

Message.sync({force: true})
    .then(() => {
            let arr = [];
            for (let i = 0; i < 100; i++) {
                arr.push({
                    message: 'Message ' + i + 1
                });
            }
            return Message.bulkCreate(arr)
                .then(() => { // Notice: There are no arguments here, as of right now you'll have to...
                    return Message.findAll();
                }).then(messages => {
                    console.log(JSON.stringify(messages)) // ... in order to get the array of user objects
                });
        }
    );

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

        const stmt = db.prepare("INSERT INTO messages(message_id, message) VALUES (?, ?)");
        for (let i = 0; i < 40; i++) {
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