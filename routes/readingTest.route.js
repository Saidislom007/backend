// routes/readingTestRoutes.js
const express = require('express');
const router = express.Router();
const ReadingTestController = require('../controllers/readingTest.controller');

// Routes for reading test
router.post('/add', ReadingTestController.addReadingTest);
router.get('/all', ReadingTestController.getAllReadingTests);
router.get('/get/:id', ReadingTestController.getReadingTestById);
router.put('/update/:id', ReadingTestController.updateReadingTest);
router.delete('/dalete/:id', ReadingTestController.deleteReadingTest);

module.exports = router;
