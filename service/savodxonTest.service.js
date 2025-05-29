const Test = require('../models/savodxon.test.model');

class TestService {
  // Test yaratish
  static async createTest(data) {
    const { question, options, answer, totalSolve } = data;

    try {
      const newTest = new Test({
        question,
        options,
        answer,
        totalSolve: totalSolve || 0,
        attempts: []  // attempts ni boshlang'ich bo'sh massiv qilib qo'yish
      });

      return await newTest.save();
    } catch (err) {
      throw new Error("Error creating test: " + err.message);
    }
  }

  // Barcha testlarni olish
  static async getAllTests() {
    try {
      return await Test.find();
    } catch (err) {
      throw new Error("Error retrieving tests: " + err.message);
    }
  }

  // Bulk test yaratish
  static async createBulkTests(testDataArray) {
    try {
      const createdTests = await Test.insertMany(testDataArray);  // Insert many documents at once
      return createdTests;
    } catch (err) {
      throw new Error('Error creating bulk tests: ' + err.message);
    }
  }

  // ID bo‘yicha test olish
  static async getTestById(testId) {
    try {
      return await Test.findById(testId);
    } catch (err) {
      throw new Error("Error retrieving test: " + err.message);
    }
  }

  // Testni hal qilgan odamni yangilash

  // Testni yechilganlar sonini yangilash
  static async updateTotalSolve(testId) {
    try {
      return await Test.findByIdAndUpdate(
        testId,
        { $inc: { totalSolve: 1 } },  // totalSolve ni oshirish
        { new: true }
      );
    } catch (err) {
      throw new Error("Error updating totalSolve: " + err.message);
    }
  }

  // Foydalanuvchining testga urinishlarini qo'shish
  static async addAttempt(testId, userName, isCorrect) {
    try {
      const updatedTest = await Test.findByIdAndUpdate(
        testId,
        {
          $push: {
            attempts: { userName, isCorrect, date: new Date() }  // Yangi urinishni qo'shish
          }
        },
        { new: true }
      );

      if (!updatedTest) {
        throw new Error("Test not found");
      }

      return updatedTest;
    } catch (err) {
      throw new Error("Error adding attempt: " + err.message);
    }
  }
}

module.exports = TestService;
