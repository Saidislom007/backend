const DemogrammmarService = require('../service/demoGrammar.service');

class DemogrammmarController {
  // 🔹 POST /api/demo - Yangi savol yaratish
  async create(req, res) {
    try {
      const question = await DemogrammmarService.createQuestion(req.body);
      res.status(201).json(question);
    } catch (error) {
      res.status(400).json({
        message: 'Savol yaratishda xatolik yuz berdi',
        error: error.message
      });
    }
  }

  // 🔹 GET /api/demo - Barcha savollarni olish
  async getAll(req, res) {
    try {
      const questions = await DemogrammmarService.getAllQuestions();
      res.status(200).json(questions);
    } catch (error) {
      res.status(500).json({
        message: 'Savollarni olishda xatolik',
        error: error.message
      });
    }
  }

  // 🔹 GET /api/demo/:id - ID orqali savolni olish
  async getById(req, res) {
    try {
      const question = await DemogrammmarService.getQuestionById(req.params.id);
      if (!question) {
        return res.status(404).json({ message: 'Savol topilmadi' });
      }
      res.status(200).json(question);
    } catch (error) {
      res.status(500).json({
        message: 'Savolni olishda xatolik',
        error: error.message
      });
    }
  }

  // 🔹 PUT /api/demo/:id - Savolni yangilash
  async update(req, res) {
    try {
      const updated = await DemogrammmarService.updateQuestion(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: 'Yangilash uchun savol topilmadi' });
      }
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({
        message: 'Savolni yangilashda xatolik',
        error: error.message
      });
    }
  }

  // 🔹 DELETE /api/demo/:id - Savolni o‘chirish
  async delete(req, res) {
    try {
      const deleted = await DemogrammmarService.deleteQuestion(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'O‘chirish uchun savol topilmadi' });
      }
      res.status(200).json({ message: 'Savol muvaffaqiyatli o‘chirildi' });
    } catch (error) {
      res.status(500).json({
        message: 'Savolni o‘chirishda xatolik',
        error: error.message
      });
    }
  }

  // 🔹 GET /api/demo/type/:type - Turi bo‘yicha olish
  async getByType(req, res) {
    try {
      const questions = await DemogrammmarService.getByType(req.params.type);
      res.status(200).json(questions);
    } catch (error) {
      res.status(500).json({
        message: 'Berilgan turdagi savollarni olishda xatolik',
        error: error.message
      });
    }
  }
}

module.exports = new DemogrammmarController();
