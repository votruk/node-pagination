const Message = require('../models/').Message;


function calculate_offset(req) {
    return parseInt(req.body.offset) || 0;
}

function calculate_limit(req) {
    return parseInt(req.body.limit) || 20;
}

function calculate_since_id(req) {
    return req.body.sinceId;
}

function calculate_till_id(req) {
    return req.body.tillId;
}


module.exports = {
    //Get a list of all messages using model.findAll()
    listing(req, res) {
        Message.findAll({order: [['id', 'DESC']]})
            .then(messages => {
                res.status(200).json(messages);
                console.log(JSON.stringify(messages)) // ... in order to get the array of user objects
            })
            .catch(function (error) {
                res.status(500).json(error);
                console.log(JSON.stringify(error))
            });
    },

    //Create a new author using model.create()
    create(req, res) {
        const message = req.body.message;
        console.error('Got message with body:', JSON.stringify(req.body));
        if (message === undefined) {
            res.json({error: "Provide message, please"});
            return;
        }
        Message.create({
            message: message
        }).then(function () {
            console.error('Successfully created message');
            res.status(200).end();
        }).catch(error => {
            console.error('Unable to connect to the database:', JSON.stringify(error));
            res.status(500).end();
        });
    },

    //Edit an existing author details using model.update()
    get(req, res) {
        const offset = calculate_offset(req);
        if (offset < 0) {
            res.json({error: "Negative offset not supported by now"});
            return;
        }
        const limit = calculate_limit(req);
        const sinceId = calculate_since_id(req);
        const tillId = calculate_till_id(req);

        if (tillId === undefined && sinceId === undefined) {
            Message
                .findAll({
                    offset: offset,
                    limit: limit,
                    order: [['id', 'DESC']]
                })
                .then(messages => {
                    res.status(200).json(messages);
                    console.log(JSON.stringify(messages))
                })
                .catch(function (error) {
                    res.status(500).json(error);
                    console.log(JSON.stringify(error))
                });
        } else if (sinceId !== undefined) {
            Message
                .findOne({where: {message_id: sinceId}})
                .then(sinceMessage => {
                    if (sinceMessage === undefined) {
                        res.status(404).json({error: "Message with id " + sinceId + " not exists"})
                    } else {
                        return Message.findAll({
                            where: {
                                id: {
                                    $lt: sinceMessage.id
                                }
                            },
                            offset: offset,
                            limit: limit,
                            order: [['id', 'DESC']]
                        })
                    }
                    // project will be the first entry of the Projects table with the title 'aProject' || null
                })
                .then(messages => {
                    res.status(200).json(messages);
                    console.log(JSON.stringify(messages))
                })
                .catch(function (error) {
                    res.status(500).json(error);
                    console.log(JSON.stringify(error))
                });
        }
    }
};