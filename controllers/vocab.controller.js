// controllers/vocabularyController.js
const vocabularyService = require('../service/vocab.service');

class VocabularyController {
  // Add new vocabulary
  async addVocabulary(req, res) {
    try {
      const { word, translation, level, description } = req.body;
      const newVocabulary = await vocabularyService.addVocabulary(word, translation, level, description);
      res.status(201).json({ message: 'Vocabulary added successfully', data: newVocabulary });
    } catch (error) {
      res.status(500).json({ message: 'Error adding vocabulary', error });
    }
  }
  async addBulkVocabulary(req, res) {
    try {
      const vocabularyList = req.body;

      if (!Array.isArray(vocabularyList) || vocabularyList.length === 0) {
        return res
          .status(400)
          .json({ message: 'Please send a non-empty array of vocabulary items.' });
      }

      const inserted = await vocabularyService.addBulkVocabulary(vocabularyList);

      res
        .status(201)
        .json({
          message: 'Bulk vocabulary added successfully',
          count: inserted.length,
          data: inserted
        });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error adding bulk vocabulary', error: error.message });
    }
  }

  // Get all vocabularies
  async getAllVocabularies(req, res) {
    try {
      const vocabularies = await vocabularyService.getAllVocabularies();
      res.status(200).json({ message: 'Vocabularies fetched successfully', data: vocabularies });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching vocabularies', error });
    }
  }

  // Update vocabulary
  async updateVocabulary(req, res) {
    try {
      const { word, translation, level, description } = req.body;
      const updatedVocabulary = await vocabularyService.updateVocabulary(req.params.id, word, translation, level, description);
      res.status(200).json({ message: 'Vocabulary updated successfully', data: updatedVocabulary });
    } catch (error) {
      res.status(500).json({ message: 'Error updating vocabulary', error });
    }
  }

  // Delete vocabulary
  async deleteVocabulary(req, res) {
    try {
      await vocabularyService.deleteVocabulary(req.params.id);
      res.status(200).json({ message: 'Vocabulary deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting vocabulary', error });
    }
  }
}

module.exports = new VocabularyController();
