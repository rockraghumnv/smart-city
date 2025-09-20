const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/authMiddleware');
const { uploadProduct, getProducts } = require('../controllers/productController');

const router = express.Router();

// --- Multer Configuration ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // CORRECTED: The destination should be 'uploads' relative to the project root.
    const uploadDir = 'uploads'; 
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// --- Route Definitions ---
router.route('/').get(protect, getProducts);

router
  .route('/upload')
  .post(protect, upload.single('image'), uploadProduct);

module.exports = router;
