var express = require('express');
var router = express.Router();

var create = require('./messages/create');
var get = require('./messages/get');

router.get('/get', function (req, res, next) {
    get(req, res, next);
});

router.post('/create', function (req, res, next) {
    create(req, res, next);
});

module.exports = router;
