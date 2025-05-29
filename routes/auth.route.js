const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');

// Foydalanuvchi ro'yxatga olish
router.post('/register', AuthController.register);

// Foydalanuvchini aktivlashtirish
router.get('/activate/:id', AuthController.activation);

// Foydalanuvchi tizimga kirishi
router.post('/login', AuthController.login);

// Foydalanuvchi profilini olish
router.get('/get-profile/:id', AuthController.getProfile);

// Foydalanuvchining skillarini yangilash
router.put('/update-skill/:id', AuthController.updateSkills);

// Barcha foydalanuvchilarni olish
router.get('/get-all', AuthController.getAll);

// Foydalanuvchini tahrirlash
router.put('/edit/:id', AuthController.edit);

// Foydalanuvchini o'chirish
router.post('/delete/:id', AuthController.delete);

// Reading Testni yangilash
router.put('/update-reading-test/:id', AuthController.updateReadingTest);

// Vocabulary Testni yangilash
router.put('/update-vocab-test/:id', AuthController.updateVocabTest);

// Writing Testni yangilash
router.put('/update-writing-test/:id', AuthController.updateWritingTest);

// Speaking Testni yangilash
router.put('/update-speaking-test/:id', AuthController.updateSpeakingTest);

module.exports = router;
