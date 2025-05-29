const express = require("express");
const router = express.Router();
const SavController = require("../controllers/sav.controller");

// Foydalanuvchini ro‘yxatdan o‘tkazish (fullname va correct_answer bilan)
router.post('/create', SavController.registerAdmin);
router.get('/all',SavController.getAll);

module.exports = router;
