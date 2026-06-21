const mongoose = require('mongoose');

const queueTokenSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  phone: { type: String }, // Optional
  tokenNumber: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['WAITING', 'CALLED', 'COMPLETED', 'SKIPPED'], 
    default: 'WAITING' 
  },
  joinedAt: { type: Date, default: Date.now },
  calledAt: { type: Date },
  completedAt: { type: Date },
  consultationDuration: { type: Number } // Stored in seconds
}, { timestamps: true });

// Indexing for faster queries
queueTokenSchema.index({ status: 1, tokenNumber: 1 });
queueTokenSchema.index({ joinedAt: 1 });

module.exports = mongoose.model('QueueToken', queueTokenSchema);
