const { Schema, model } = require('mongoose');

const TokenSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    refreshToken: { type: String, required: true }
}, { timestamps: true }); // Har bir hujjat uchun `createdAt` va `updatedAt` maydonlari qo‘shiladi

module.exports = model("Token", TokenSchema);
