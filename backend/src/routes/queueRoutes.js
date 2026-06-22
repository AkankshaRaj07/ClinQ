const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');

router.post('/join', queueController.joinQueue);
router.get('/current', queueController.getCurrentState);
router.get('/token/:tokenNumber', queueController.getTokenTracking);
router.post('/call-next', queueController.callNext);
router.put('/:tokenId/complete', queueController.completeToken);
router.put('/:tokenId/skip', queueController.skipToken);
router.put('/:tokenId/recall', queueController.recallToken);
router.post('/reset', queueController.resetQueue);

module.exports = router;
