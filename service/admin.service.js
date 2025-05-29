// services/admin.service.js
const adminModel = require('../models/admin.model');
const bcrypt = require('bcrypt');
const tokenService = require('./token.service');
const AdminDto = require('../dtos/admin.dto');
const BaseError = require('../errors/base.error');// Agar siz BaseError ishlatayotgan bo‘lsangiz

class AdminService {
  // Adminni ro‘yxatdan o‘tkazish
  async registerAdmin(username, password) {
    const existUser = await adminModel.findOne({ username });
    if (existUser) {
      throw BaseError.BadRequest(`Admin with email ${username} is already registered`);
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newAdmin = await adminModel.create({
      username,
      password: hashPassword,
    });

    const adminDto = new AdminDto(newAdmin);
    const tokens = tokenService.generateToken({ ...adminDto });

    await tokenService.saveToken(newAdmin.id, tokens.refreshToken);

    return { admin: adminDto, ...tokens };
  }

  // Adminni login qilish
  async loginAdmin(username, password) {
    const admin = await adminModel.findOne({ username });
    if (!admin) {
      throw BaseError.BadRequest('Admin not found');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw BaseError.BadRequest('Incorrect password');
    }

    const adminDto = new AdminDto(admin);
    const tokens = tokenService.generateToken({ ...adminDto });

    await tokenService.saveToken(admin.id, tokens.refreshToken);

    return { admin: adminDto, ...tokens };
  }
}

module.exports = new AdminService();
