const express = require('express');
const router = express.Router();

const messages = require('../controllers/messages');

router.post('/listing', messages.listing);
router.post('/create', messages.create);
router.post('/get', messages.get);

module.exports = router;
