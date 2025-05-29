const express = require('express');
const router = express.Router();
const GrammarController = require("../controllers/grammartest.controller")


router.post('/create-grammar-test',GrammarController.addGrammar);
router.put('/update-grammar-test/:id',GrammarController.updateGrammar);
router.get('/get-all-grammar-tests',GrammarController.getAllGrammars)
router.post('/delete-grammar-test/:id',GrammarController.deleteGrammar)
router.post('/create-bulk-grammar-test',GrammarController.addBulkVocabulary)

module.exports = router