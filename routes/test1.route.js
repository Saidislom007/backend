const express = require('express');
const router = express.Router();
const testController = require('../controllers/test.controller');

router.post('/create', testController.createTest);
router.get('/get-all', testController.getAllTests);
router.get('/get/:id', testController.getTestById);
router.put('/edit/:id', testController.updateTest);
router.delete('/delete/:id', testController.deleteTest);

module.exports = router;
