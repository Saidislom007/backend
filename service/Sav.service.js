const savModel = require("../models/savodxon.model");

class SavService {
  async register(fullname, correct_answer) {
    const existUser = await savModel.findOne({ fullname });

    if (existUser) {
      throw new Error(`User with fullname "${fullname}" is already registered`);
    }

    const newUser = await savModel.create({
      fullname,
      correct_answer,
    });

    return newUser;
  }
  async getAll() {
    try {
        const allSavs = await savModel.find();
        if (!allSavs || allSavs.length === 0) {
            return []; // Bo'sh massiv qaytadi
        }
        return allSavs;
    } catch (error) {
        console.error("Savodxonlarni  olishda xatolik:", error);
        throw new Error("Savodxonlarniolishda muammo yuz berdi");
    }
}
}

module.exports = new SavService();
