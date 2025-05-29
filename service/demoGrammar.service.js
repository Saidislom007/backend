const Demogrammmar = require('../models/demo.model');

class DemogrammmarService {
  // 🔹 Yangi savol qo‘shish
  async createQuestion(data) {
    const question = new Demogrammmar(data);
    return await question.save();
  }

  // 🔹 Barcha savollarni olish
  async getAllQuestions(filter = {}) {
    return await Demogrammmar.find(filter);
  }

  // 🔹 Bitta savolni ID orqali olish
  async getQuestionById(id) {
    return await Demogrammmar.findById(id);
  }

  // 🔹 Savolni yangilash
  async updateQuestion(id, updates) {
    return await Demogrammmar.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });
  }

  // 🔹 Savolni o‘chirish
  async deleteQuestion(id) {
    return await Demogrammmar.findByIdAndDelete(id);
  }

  // 🔹 Turi bo‘yicha savollarni olish (masalan: fill-in-the-blank)
  async getByType(type) {
    return await Demogrammmar.find({ type });
  }
}

module.exports = new DemogrammmarService();
