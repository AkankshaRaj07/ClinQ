const mongoose = require('mongoose');

const queueTokenSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  phone: { type: String }, // Optional
  tokenNumber: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['WAITING', 'CALLED', 'COMPLETED', 'SKIPPED', 'RECALLED'], 
    default: 'WAITING' 
  },
  joinedAt: { type: Date, default: Date.now },
  calledAt: { type: Date },
  completedAt: { type: Date },
  consultationDuration: { type: Number }, // Stored in seconds
  queueDate: { type: String } // Stored as YYYY-MM-DD
}, { timestamps: true });

// Indexing for faster queries
queueTokenSchema.index({ status: 1, tokenNumber: 1 });
queueTokenSchema.index({ joinedAt: 1 });
queueTokenSchema.index({ queueDate: 1 });
// Guarantee at database level that only one token can be CALLED at a time
queueTokenSchema.index(
  { status: 1 }, 
  { unique: true, partialFilterExpression: { status: 'CALLED' } }
);

module.exports = mongoose.model('QueueToken', queueTokenSchema);
