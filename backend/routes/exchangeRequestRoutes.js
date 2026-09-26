const express = require('express');
const router = express.Router();
const {
  sendExchangeRequest,
  getReceivedRequests,
  getSentRequests,
  getPendingCount,
  acceptExchangeRequest,
  rejectExchangeRequest,
  cancelExchangeRequest,
  getActiveExchanges
} = require('../controllers/exchangeRequestController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', sendExchangeRequest);
router.get('/received', getReceivedRequests);
router.get('/sent', getSentRequests);
router.get('/pending-count', getPendingCount);
router.get('/active', getActiveExchanges);

router.put('/:id/accept', acceptExchangeRequest);
router.put('/:id/reject', rejectExchangeRequest);
router.put('/:id/cancel', cancelExchangeRequest);

module.exports = router;
