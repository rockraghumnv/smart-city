import mongoose from 'mongoose';

const safetyReportSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  reportingUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reportType: {
    type: String,
    enum: ['text', 'image', 'video'],
    required: true,
  },
  textContent: {
    type: String,
    trim: true,
  },
  contentUrl: {
    type: String,
  },
  analysisResult: {
    type: String,
  },
  actionTaken: {
    tool_called: String,
    details: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

const SafetyReport = mongoose.model('SafetyReport', safetyReportSchema);

export default SafetyReport;
