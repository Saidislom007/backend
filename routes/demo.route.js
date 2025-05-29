const express = require('express');
const router = express.Router();
const DemogrammmarController = require('../controllers/demoGrammar.controller');

// CRUD
router.post('/', DemogrammmarController.create);
router.get('/', DemogrammmarController.getAll);
router.get('/:id', DemogrammmarController.getById);
router.put('/:id', DemogrammmarController.update);
router.delete('/:id', DemogrammmarController.delete);

// Filter by type
router.get('/type/:type', DemogrammmarController.getByType);

module.exports = router;
