const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  cancelSession,
  completeSession
} = require('../controllers/sessionController');

router.use(protect);

router.post('/', createSession);
router.get('/', getSessions);
router.get('/:id', getSessionById);
router.put('/:id', updateSession);
router.put('/:id/cancel', cancelSession);
router.put('/:id/complete', completeSession);

module.exports = router;
