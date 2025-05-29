const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  title: String,
  testType: {
    type: String,
    enum: ['grammar', 'listening', 'reading', 'writing', 'vocabulary']
  },
  level: {
    type: String,
    enum: ['A1', 'A2', 'B1', 'B2', 'C1']
  },
  duration: Number,
  instructions: String,
  content: mongoose.Schema.Types.Mixed,
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tests', testSchema);
