const { Schema, model } = require('mongoose');

const postSchema = new Schema(
    {
        title: { type: String, required: true },
        body: { type: String, required: true },
    },
    { timestamps: true } // Qo‘shimcha: post yaratilgan vaqtini avtomatik qo‘shish
);

module.exports = model('Post', postSchema);
