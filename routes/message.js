var express = require('express');
var router = express.Router();

var create = require('./message/create');
var get = require('./message/get');

router.post('/get', function (req, res, next) {
    get(req, res, next);
});

router.post('/create', function (req, res, next) {
    create(req, res, next);
});

module.exports = router;
