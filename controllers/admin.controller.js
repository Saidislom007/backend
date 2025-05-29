// controllers/authController.js

const adminService = require("../service/admin.service");

class AuthController {
  // Adminni ro‘yxatdan o‘tkazish
  async registerAdmin(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    try {
      const result = await adminService.registerAdmin(username, password);
      return res.status(201).json(result);
    } catch (err) {
      console.error("Error registering admin:", err.message);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Adminni login qilish
  async loginAdmin(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    try {
      const result = await adminService.loginAdmin(username, password);
      return res.json(result);
    } catch (err) {
      console.error("Error logging in admin:", err.message);
      return res.status(400).json({ message: err.message });
    }
  }
}

module.exports = new AuthController();
