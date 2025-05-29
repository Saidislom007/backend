const ListeningModel = require("../models/listening.model");

class GrammarService {
  // Create a single grammar test
  async createListeningTest({ text, correct_answer, difficulty, category, content }) {
    const newTest = new ListeningModel({
      
      correct_answer,
      difficulty,
      category,
      content // ✅ JSON object qo‘shildi
    });

    return await newTest.save();
  }

  // Fetch all grammar tests
  async getAll() {
    return await ListeningModel.find();
  }

  // Update solver stats
  async updateListeningTest(id, number_of_solvers, correct_count, wrong_count) {
    return await ListeningModel.findByIdAndUpdate(
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
    return await ListeningModel.findByIdAndDelete(id);
  }

  // Bulk insert grammar tests
  async addBulkListeningTest(grammarList) {
    try {
      return await ListeningModel.insertMany(grammarList);
    } catch (error) {
      throw new Error('Error adding bulk grammars: ' + error.message);
    }
  }
}

module.exports = new GrammarService();
