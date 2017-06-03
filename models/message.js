"use strict";

module.exports = function (sequelize, DataTypes) {
    let Message = sequelize.define('Message', {
        // id: { type: Sequelize.INTEGER, autoIncrement: true,  allowNull: false, primaryKey: true},
        message_id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4},
        message: {type: DataTypes.STRING, allowNull: false}
    });

    return Message;
};