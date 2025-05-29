const Statistika = require('../models/stat.model');

// 📌 Statistika qo'shish (test yakunlanganda chaqiriladi)
const addStatistika = async (req, res) => {
  try {
    const { userId, reading, listening, writing, speaking } = req.body;

    const newStat = new Statistika({
      user: userId,
      score: {
        reading,
        listening,
        writing,
        speaking
      }
    });

    await newStat.save();

    res.status(201).json({
      success: true,
      message: "Statistika saqlandi",
      data: newStat
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Xatolik yuz berdi", error });
  }
};

// 📌 O'quvchining barcha statistikasi
const getUserStatistika = async (req, res) => {
  try {
    const { userId } = req.params;

    const stats = await Statistika.find({ user: userId }).sort({ createdAt: -1 });

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: "Statistikani olishda xatolik", error });
  }
};

// 📌 O'quvchining eng so'nggi testi
const getLastTest = async (req, res) => {
  try {
    const { userId } = req.params;

    const lastTest = await Statistika.findOne({ user: userId }).sort({ createdAt: -1 });

    res.json({ success: true, data: lastTest });
  } catch (error) {
    res.status(500).json({ success: false, message: "Oxirgi testni olishda xatolik", error });
  }
};

// 📌 Eng kuchli skillni aniqlash
const getStrongestSkill = async (req, res) => {
  try {
    const { userId } = req.params;

    const stats = await Statistika.find({ user: userId });

    if (stats.length === 0) {
      return res.json({ success: true, message: "Hali test ishlanmagan", strongestSkill: null });
    }

    // Har bir skill bo‘yicha umumiy ball
    const total = { reading: 0, listening: 0, writing: 0, speaking: 0 };

    stats.forEach(stat => {
      total.reading += stat.score.reading;
      total.listening += stat.score.listening;
      total.writing += stat.score.writing;
      total.speaking += stat.score.speaking;
    });

    // Eng yuqori bo‘lgan skillni topish
    const strongestSkill = Object.keys(total).reduce((a, b) => total[a] > total[b] ? a : b);

    res.json({ success: true, strongestSkill });
  } catch (error) {
    res.status(500).json({ success: false, message: "Skillni aniqlashda xatolik", error });
  }
};

module.exports = {
  addStatistika,
  getUserStatistika,
  getLastTest,
  getStrongestSkill
};
