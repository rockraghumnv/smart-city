const express = require('express');
const { getItems, createItem } = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getItems).post(protect, createItem);

module.exports = router;
