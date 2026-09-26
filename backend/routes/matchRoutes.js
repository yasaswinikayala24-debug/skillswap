const express = require('express');
const router = express.Router();
const { getMatches, getMatchDetails } = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getMatches);
router.get('/:userId', getMatchDetails);

module.exports = router;
