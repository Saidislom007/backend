// services/vocabularyService.js
const Vocabulary = require('../models/vocab.model');

class VocabularyService {
  // Add a new vocabulary
  async addVocabulary(word, translation, level, description) {
    const newVocabulary = new Vocabulary({ word, translation, level, description });
    return await newVocabulary.save();
  }

  // Get all vocabularies
  async getAllVocabularies() {
    return await Vocabulary.find();
  }

  // Update vocabulary by ID
  async updateVocabulary(id, word, translation, level, description) {
    return await Vocabulary.findByIdAndUpdate(id, { word, translation, level, description }, { new: true });
  }

  // Delete vocabulary by ID
  async deleteVocabulary(id) {
    return await Vocabulary.findByIdAndDelete(id);
  }
  async addBulkVocabulary(vocabularyList) {
    try {
      const newVocabularies = await Vocabulary.insertMany(vocabularyList);
      return newVocabularies;
    } catch (error) {
      throw new Error('Error adding bulk vocabulary: ' + error.message);
    }
  }

}

module.exports = new VocabularyService();
