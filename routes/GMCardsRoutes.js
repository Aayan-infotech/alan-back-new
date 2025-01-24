const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/GMCardsControllers');

// Routes
router.post('/sessions', sessionController.createSessionData);
router.get('/sessions/:session_id', sessionController.getSessionData);
router.put('/sessions/:id', sessionController.updateSessionData);
router.delete('/sessions/:id', sessionController.deleteSessionData);

module.exports = router;
    