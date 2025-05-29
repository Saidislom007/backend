const express = require('express');
const router = express.Router();
const TestController = require('../controllers/savodxon.test.controller');

// Test yaratish
router.post('/create', TestController.createTest);

// Barcha testlarni olish
router.get('/all', TestController.getAllTests);

// ID bo'yicha test olish
router.get('/:testId', TestController.getTestById);



// Testni yechilganlar sonini yangilash
router.put('/:testId/totalSolve', TestController.updateTotalSolve);

// Foydalanuvchining urinishlarini qo'shish
router.put('/:testId/addAttempt', TestController.addAttempt);

// Bulk test yaratish
router.post('/bulk', TestController.createBulkTests);

module.exports = router;
