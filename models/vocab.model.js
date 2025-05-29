// models/Vocabulary.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Vocabulary Schema
const vocabularySchema = new Schema({
  word: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  translation: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });  // Timestamps will automatically add createdAt and updatedAt

// Create a model from the schema
const Vocabulary = mongoose.model('Vocabulary', vocabularySchema);

module.exports = Vocabulary;
