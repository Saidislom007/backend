// models/readingTest.model.js
const mongoose = require('mongoose');

const readingTestSchema = new mongoose.Schema({
  passage: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  answer: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  }
}, { timestamps: true });

const ReadingTest = mongoose.model('ReadingTest', readingTestSchema);

module.exports = ReadingTest;
