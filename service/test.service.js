const Test = require("../models/test.model");  // Test modelini import qilish

// Test qo‘shish (admin uchun)
const addTest = async (passage, options, correctAnswer, level) => {
  try {
    // Yangi test yaratish
    const newTest = new Test({
      passage,
      options,
      correctAnswer,
      level, // Levelni ham saqlaymiz
    });

    // Yangi testni bazaga saqlash
    await newTest.save();
    return newTest;
  } catch (err) {
    throw new Error("Error while adding test: " + err.message);
  }
};

// Barcha testlarni olish va level bo‘yicha saralash
const getAllTests = async (level = null) => {
  try {
    // Agar level bo‘lsa, uni filtrlash, aks holda barcha testlarni olish
    const query = level ? { level } : {};
    const tests = await Test.find(query).sort({ level: 1 });  // Level bo‘yicha saralash (1 - ascending)
    return tests;
  } catch (err) {
    throw new Error("Error while fetching tests: " + err.message);
  }
};

// Testni ID bo‘yicha olish
const getTestById = async (id) => {
  try {
    // ID bo‘yicha testni qidirish
    const test = await Test.findById(id);
    return test;
  } catch (err) {
    throw new Error("Error while fetching test by ID: " + err.message);
  }
};

// Testni o‘chirish
const deleteTest = async (id) => {
  try {
    // Testni o‘chirish
    const deletedTest = await Test.findByIdAndDelete(id);
    return deletedTest;
  } catch (err) {
    throw new Error("Error while deleting test: " + err.message);
  }
};

module.exports = { addTest, getAllTests, getTestById, deleteTest };
