// routes/adminRoutes.js

const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");

// Admin ro‘yxatdan o‘tkazish va login qilish
router.post("/register", adminController.registerAdmin);
router.post("/login", adminController.loginAdmin);

module.exports = router;
