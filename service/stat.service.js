const Statistika = require("../models/stat.model");
const User = require("../models/auth.model");

class StatistikaService {
  // Yangi statistika yaratish
  async create(userId, score) {
    try {
      // Foydalanuvchini topamiz
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Foydalanuvchi topilmadi");
      }
  
      // Yangi statistikani yaratish
      const newStat = new Statistika({
        user: userId,
        score: {
          reading: score.reading,
          listening: score.listening,
          writing: score.writing,
          speaking: score.speaking
        },
      });
  
      // Statistikani saqlash
      const savedStat = await newStat.save();
      
      return savedStat; // Yaratilgan statistikani qaytarish
    } catch (err) {
      console.error("Statistika yaratishda xatolik:", err.message);
      
      // Xatolikni tushunarli qilish
      throw new Error("Statistika yaratishda xatolik: " + err.message);
    }
  }
  
  // Foydalanuvchiga tegishli barcha statistikalarni olish
  async getByUserId(userId) {
    try {
      const stats = await Statistika.find({ user: userId })
        .populate("user", "fullname email skills") // Foydalanuvchining ma'lumotlarini qo'shish
        .sort({ createdAt: -1 }); // Yangi statistikani birinchi o'ringa qo'yamiz
      return stats;
    } catch (err) {
      console.error("Statistikani olishda xatolik:", err.message);
      throw new Error("Statistikani olishda xatolik: " + err.message);
    }
  }

  // Oxirgi statistika
  async getLastStatByUserId(userId) {
    try {
      const lastStat = await Statistika.findOne({ user: userId })
        .sort({ createdAt: -1 }); // Yangi statistikani olish
      return lastStat;
    } catch (err) {
      console.error("Oxirgi statistikani olishda xatolik:", err.message);
      throw new Error("Oxirgi statistikani olishda xatolik: " + err.message);
    }
  }
}

module.exports = new StatistikaService();
