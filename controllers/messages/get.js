"use strict";

const Message = require('../../models/').Message;
const Promise = require('bluebird');


function define_offset(req) {
    return new Promise(resolve => {
        console.log("define_offset");
        resolve(parseInt(req.body.offset) || 0);
    });
}

function define_limit(req) {
    return new Promise(resolve => {
        console.log("define_limit");
        resolve(parseInt(req.body.limit) || 20);
    });
}

function define_message_id(messageId) {
    return new Promise(resolve => {
            if (messageId === undefined) {
                resolve(undefined);
                return;
            }
            return Message
                .findOne({where: {message_id: messageId}})
                .then(message => {
                    if (message === null) {
                        resolve(undefined);
                    } else {
                        resolve(message.id);
                    }
                })
                .catch(error => {
                    console.log(JSON.stringify(error));
                    resolve(undefined);
                })
        }
    );
}

function get_search_params(offset, limit, sinceId, tillId) {
    return new Promise(resolve => {
            if (tillId === undefined && sinceId === undefined) {
                resolve(params_default(offset, limit));
            } else if (tillId !== undefined && sinceId === undefined) {
                resolve(params_till(tillId, offset, limit));
            } else if (tillId === undefined && sinceId !== undefined) {
                resolve(params_since(sinceId, offset, limit));
            } else {
                resolve(params_since_and_till(sinceId, tillId, offset, limit));
            }
        }
    );
}

function params_since(sinceId, offset, limit) {
    return {
        where: {
            id: {
                $lt: sinceId,
            }
        },
        offset: offset,
        limit: limit,
        order: [['id', 'DESC']]
    };
}

function params_till(tillId, offset, limit) {
    return {
        where: {
            id: {
                $gt: tillId
            }
        },
        offset: offset,
        limit: limit,
        order: [['id', 'DESC']]
    };
}

function params_since_and_till(sinceId, tillId, offset, limit) {
    return {
        where: {
            id: {
                $lt: sinceId,
                $gt: tillId
            }
        },
        offset: offset,
        limit: limit,
        order: [['id', 'DESC']]
    };
}

function params_default(offset, limit) {
    return {
        offset: offset,
        limit: limit,
        order: [['id', 'DESC']]
    };
}

module.exports = {
    get(req, res) {
        const sinceMessageId = req.body.sinceId;
        const tillMessageId = req.body.tillId;
        Promise
            .all([define_offset(req),
                define_limit(req),
                define_message_id(sinceMessageId),
                define_message_id(tillMessageId)])
            .then(([offset, limit, sinceId, tillId]) => {
                    if ((sinceMessageId !== undefined && sinceId === undefined)
                        || (tillMessageId !== undefined && tillId === undefined)) {
                        throw {error: "Message with id " + sinceMessageId + " not exists"};
                    }
                    return get_search_params(offset, limit, sinceId, tillId);
                }
            )
            .then(params => {
                return Message
                    .findAll(params)
                    .then(messages => {
                        res.status(200).json(messages);
                        console.log(JSON.stringify(messages))
                    })
                    .catch(function (error) {
                        res.status(500).json(error);
                        console.log(JSON.stringify(error))
                    });
            })
            .catch(error => {
                res.status(404).json(error);
            });
    }
};