// routes/vocabularyRoutes.js
const express = require('express');
const router = express.Router();
const vocabularyController = require('../controllers/vocab.controller');

// Add single vocabulary
router.post('/add', vocabularyController.addVocabulary);

// Add bulk vocabularies
router.post('/add-bulk', vocabularyController.addBulkVocabulary); // Add this route for bulk

// Get all vocabularies
router.get('/all', vocabularyController.getAllVocabularies);

// Update vocabulary by ID
router.put('/update/:id', vocabularyController.updateVocabulary);

// Delete vocabulary by ID
router.delete('/delete/:id', vocabularyController.deleteVocabulary);

module.exports = router;
