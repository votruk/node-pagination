const Message = require('../../models/').Message;

module.exports = {
    //Get a list of all messages using model.findAll()
    listing(req, res) {
        Message.findAll()
            .then(messages => {
                res.status(200).json(messages);
                console.log(JSON.stringify(messages)) // ... in order to get the array of user objects
            })
            .catch(function (error) {
                res.status(500).json(error);
                console.log(JSON.stringify(error))
            });
    }
};