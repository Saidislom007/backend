const express = require('express');
const router = express.Router();
const ListeningController = require("../controllers/listening.controller")

router.post('/create-listening-test',ListeningController.addListeningTest);
router.put('/update-listening-test/:id',ListeningController.updateListeningTest);
router.get('/get-all-listening-tests',ListeningController.getAllListeningTests)
router.post('/delete-listening-test/:id',ListeningController.deleteListeningTest)
router.post('/create-bulk-listening-test',ListeningController.addBulkListeningTest)

module.exports = router