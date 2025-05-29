const express = require('express');
const router = express.Router();

const {
  addStatistika,
  getUserStatistika,
  getLastTest,
  getStrongestSkill
} = require('../controllers/stat.controller');

// ✅ Statistika qo‘shish (testdan so‘ng chaqiriladi)
router.post('/add', addStatistika);

// ✅ Foydalanuvchining barcha statistikasi
router.get('/:userId/all', getUserStatistika);

// ✅ Oxirgi ishlagan testi
router.get('/:userId/last', getLastTest);

// ✅ Eng kuchli skill
router.get('/:userId/strongest-skill', getStrongestSkill);

module.exports = router;
