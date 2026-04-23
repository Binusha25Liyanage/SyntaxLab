const express = require('express');
const { protect } = require('../middleware/auth');
const { askTutor } = require('../controllers/aiController');

const router = express.Router();

router.post('/ask', protect, askTutor);

module.exports = router;