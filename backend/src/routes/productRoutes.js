import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect, isVendor } from '../middleware/authMiddleware.js';
import { uploadProduct, getProducts, getProductById } from '../controllers/productController.js';

const router = express.Router();

// --- Multer Configuration ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
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
router.route('/:id').get(protect, getProductById);

router
  .route('/upload')
  .post(protect, isVendor, upload.single('file'), uploadProduct);

export default router;
