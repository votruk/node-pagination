"use strict";

const Message = require('../../models/').Message;

module.exports = {
    create(req, res) {
        const message = req.body.message;
        if (message === undefined) {
            res.status(404).json({error: "Provide message, please"});
            return;
        }
        Message
            .create({message: message})
            .then(function () {
                res.status(200).end();
            })
            .catch(error => {
                res.status(500).end();
            });
    }
};