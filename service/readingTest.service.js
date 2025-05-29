// services/readingTestService.js
const ReadingTest = require('../models/readingTest.model');

class ReadingTestService {
  // Add a new reading test
  static async addReadingTest(passage, question, options, answer, level) {
    const newTest = new ReadingTest({ passage, question, options, answer, level });
    return await newTest.save();
  }

  // Get all reading tests
  static async getAllReadingTests() {
    return await ReadingTest.find();
  }

  // Get reading test by ID
  static async getReadingTestById(id) {
    return await ReadingTest.findById(id);
  }

  // Update reading test by ID
  static async updateReadingTest(id, passage, question, options, answer, level) {
    return await ReadingTest.findByIdAndUpdate(id, { passage, question, options, answer, level }, { new: true });
  }

  // Delete reading test by ID
  static async deleteReadingTest(id) {
    return await ReadingTest.findByIdAndDelete(id);
  }
}

module.exports = ReadingTestService;
