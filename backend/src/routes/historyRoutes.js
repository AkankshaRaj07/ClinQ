const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

router.get('/', historyController.getHistoryByDate);
router.get('/stats', historyController.getDailyStats);

module.exports = router;
