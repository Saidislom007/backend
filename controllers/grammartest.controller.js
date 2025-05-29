// controllers/grammartest.controller.js
const grammarService = require('../service/grammartest.service');

class GrammarController {
  // Add a single grammar test
  async addGrammar(req, res) {
    try {
      const {  correct_answer, difficulty, category, content } = req.body;
  
      const newGrammar = await grammarService.createTest({
        correct_answer,
        difficulty,
        category,
        content  // ✅ content qo‘shildi
      });
  
      res.status(201).json({
        message: 'Grammar added successfully',
        data: newGrammar
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Error adding Grammar",
        error: err.message
      });
    }
  }
  

  // Add multiple grammar tests (bulk)
  async addBulkVocabulary(req, res) {
    try {
      const grammarList = req.body;
  
      if (!Array.isArray(grammarList) || grammarList.length === 0) {
        return res.status(400).json({ message: 'Please send a non-empty array of grammar items.' });
      }
  
      // Har bir itemda content ham bo‘lishi mumkin
      const inserted = await grammarService.addBulkGrammar(grammarList);
  
      res.status(201).json({
        message: 'Bulk grammar added successfully',
        count: inserted.length,
        data: inserted
      });
    } catch (error) {
      res.status(500).json({ message: 'Error adding bulk grammar', error: error.message });
    }
  }
  

  // Get all grammars
  async getAllGrammars(req, res) {
    try {
      const grammars = await grammarService.getAll();
      res.status(200).json({ message: 'Grammars fetched successfully', data: grammars });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching Grammars', error });
    }
  }

  // Update grammar test statistics
  async updateGrammar(req, res) {
    try {
      const { number_of_solvers, correct_count, wrong_count } = req.body;
      const updatedGrammar = await grammarService.updateTest(
        req.params.id, 
        number_of_solvers, 
        correct_count, 
        wrong_count
      );
      res.status(200).json({ message: 'Grammar updated successfully', data: updatedGrammar });
    } catch (error) {
      res.status(500).json({ message: 'Error updating Grammar', error });
    }
  }

  // Delete grammar test
  async deleteGrammar(req, res) {
    try {
      await grammarService.delete(req.params.id);
      res.status(200).json({ message: 'Grammar deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting Grammar', error });
    }
  }
}

module.exports = new GrammarController();
