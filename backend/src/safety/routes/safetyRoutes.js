import express from 'express';
import { protect } from '../../middleware/authMiddleware.js';
import {
  createEvent,
  getEvents,
  joinEvent,
  submitSafetyReport,
  createDemoIotReport,
  createDemoCctvReport,
} from '../controllers/safetyController.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Event Management Routes
router.route('/events').post(protect, createEvent).get(protect, getEvents);
router.route('/events/:id/join').post(protect, joinEvent);

// Safety Report Route
router.route('/reports/:eventId').post(protect, upload.single('file'), submitSafetyReport);

// Demo Routes for IoT and CCTV
router.route('/demo/iot-data').post(createDemoIotReport);
router.route('/demo/cctv-feed').post(createDemoCctvReport);

export default router;
