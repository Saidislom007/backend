const GrammarModel = require("../models/grammar.model");

class GrammarService {
  // Create a single grammar test
  async createTest({ text, correct_answer, difficulty, category, content }) {
    const newTest = new GrammarModel({
      
      correct_answer,
      difficulty,
      category,
      content // ✅ JSON object qo‘shildi
    });

    return await newTest.save();
  }

  // Fetch all grammar tests
  async getAll() {
    return await GrammarModel.find();
  }

  // Update solver stats
  async updateTest(id, number_of_solvers, correct_count, wrong_count) {
    return await GrammarModel.findByIdAndUpdate(
      id,
      {
        number_of_solvers,
        correct_counts: correct_count,
        wrong_counts: wrong_count
      },
      { new: true }
    );
  }

  // Delete a grammar test
  async delete(id) {
    return await GrammarModel.findByIdAndDelete(id);
  }

  // Bulk insert grammar tests
  async addBulkGrammar(grammarList) {
    try {
      return await GrammarModel.insertMany(grammarList);
    } catch (error) {
      throw new Error('Error adding bulk grammars: ' + error.message);
    }
  }
}

module.exports = new GrammarService();
