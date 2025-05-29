const savService = require("../service/Sav.service");

class SavController {
  async registerAdmin(req, res) {
    const { fullname, correct_answer } = req.body;

    if (!fullname?.trim() || typeof correct_answer !== 'number' || !Number.isInteger(correct_answer)) {
      return res.status(400).json({ message: "fullname bo‘sh bo‘lmasligi va correct_answer butun son bo‘lishi kerak" });
    }

    try {
      const result = await savService.register(fullname, correct_answer);
      return res.status(201).json(result);
    } catch (err) {
      console.error("Error registering savodxon:", err.message);
      return res.status(500).json({ message: "Server error" });
    }
  }
    async getAll(req, res, next) {
          try {
              const allSavs = await savService.getAll();
  
              if (!allSavs || allSavs.length === 0) {
                  return res.status(404).json({ message: "No savodxonlar found" });
              }
  
              res.status(200).json(allSavs);
          } catch (error) {
              next(error); // Xatoni error-handling middleware'ga uzatish
          }
    }
}

module.exports = new SavController();
