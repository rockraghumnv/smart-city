const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/orderController');
const { protect, isVendor } = require('../middleware/authMiddleware');

// This route is protected to ensure only logged-in vendors can access it.
router.route('/').post(protect, isVendor, createOrder);

module.exports = router;
