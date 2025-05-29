const TestService = require('../service/savodxonTest.service');

class TestController {
  // Test yaratish
  static async createTest(req, res) {
    try {
      const testData = req.body;
      const createdTest = await TestService.createTest(testData);
      return res.status(201).json(createdTest);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Barcha testlarni olish
  static async getAllTests(req, res) {
    try {
      const tests = await TestService.getAllTests();
      return res.status(200).json(tests);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // ID bo'yicha test olish
  static async getTestById(req, res) {
    try {
      const { testId } = req.params;
      const test = await TestService.getTestById(testId);

      if (!test) {
        return res.status(404).json({ message: "Test not found" });
      }

      return res.status(200).json(test);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Testni hal qilgan odamni yangilash


  // Testni yechilganlar sonini yangilash
  static async updateTotalSolve(req, res) {
    try {
      const { testId } = req.params;
  
      const updatedTest = await TestService.updateTotalSolve(testId);
  
      if (!updatedTest) {
        return res.status(404).json({ message: "Test not found" });
      }
  
      return res.status(200).json(updatedTest);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Foydalanuvchining urinishlarini qo'shish
// Foydalanuvchining urinishlarini qo'shish
  static async addAttempt(req, res) {
    try {
        const { testId } = req.params;
        const { userName, isCorrect } = req.body;  // Foydalanuvchi ismi va to'g'riligini olish

        // Testni yangilash va urinish qo'shish
        const updatedTest = await TestService.addAttempt(testId, userName, isCorrect);

        if (!updatedTest) {
            return res.status(404).json({ message: "Test not found" });
        }

        return res.status(200).json(updatedTest);  // Yangilangan testni qaytarish
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
  }


  // Bulk test yaratish
  static async createBulkTests(req, res) {
    try {
      const testDataArray = req.body;  // array of test objects
      const createdTests = await TestService.createBulkTests(testDataArray);
      return res.status(201).json(createdTests);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}

module.exports = TestController;
