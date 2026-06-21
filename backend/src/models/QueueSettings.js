const mongoose = require('mongoose');

const queueSettingsSchema = new mongoose.Schema({
  currentToken: { type: Number, default: 0 },
  nextTokenNumber: { type: Number, default: 1 },
  defaultConsultationTime: { type: Number, default: 600 }, // 600 seconds = 10 minutes
  lastResetDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('QueueSettings', queueSettingsSchema);
