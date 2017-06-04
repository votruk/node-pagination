"use strict";

const Message = require('../../models/').Message;

module.exports = {
    listing(req, res) {
        Message
            .findAll({order: [['id', 'DESC']]})
            .then(messages => {
                res.status(200).json(messages);
                console.log(JSON.stringify(messages))
            })
            .catch(function (error) {
                res.status(500).json(error);
                console.log(JSON.stringify(error))
            });
    }
};