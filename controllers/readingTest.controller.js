// controllers/readingTestController.js
const ReadingTestService = require('../service/readingTest.service');

class ReadingTestController {
  // Add a new reading test
  static async addReadingTest(req, res) {
    try {
      const { passage, question, options, answer, level } = req.body;
      const newTest = await ReadingTestService.addReadingTest(passage, question, options, answer, level);
      res.status(201).json({ message: 'Reading test added successfully', data: newTest });
    } catch (error) {
      res.status(500).json({ message: 'Error adding reading test', error });
    }
  }

  // Get all reading tests
  static async getAllReadingTests(req, res) {
    try {
      const tests = await ReadingTestService.getAllReadingTests();
      res.status(200).json({ message: 'Reading tests fetched successfully', data: tests });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching reading tests', error });
    }
  }

  // Get reading test by ID
  static async getReadingTestById(req, res) {
    try {
      const test = await ReadingTestService.getReadingTestById(req.params.id);
      if (!test) {
        return res.status(404).json({ message: 'Reading test not found' });
      }
      res.status(200).json({ message: 'Reading test fetched successfully', data: test });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching reading test', error });
    }
  }

  // Update reading test
  static async updateReadingTest(req, res) {
    try {
      const { passage, question, options, answer, level } = req.body;
      const updatedTest = await ReadingTestService.updateReadingTest(req.params.id, passage, question, options, answer, level);
      res.status(200).json({ message: 'Reading test updated successfully', data: updatedTest });
    } catch (error) {
      res.status(500).json({ message: 'Error updating reading test', error });
    }
  }

  // Delete reading test
  static async deleteReadingTest(req, res) {
    try {
      await ReadingTestService.deleteReadingTest(req.params.id);
      res.status(200).json({ message: 'Reading test deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting reading test', error });
    }
  }
}

module.exports = ReadingTestController;
