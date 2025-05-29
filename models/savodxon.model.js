const { Schema, model } = require('mongoose');

// User Schema
const SavSchema = new Schema(
    {
        fullname:{
            type:String,
            required:true
        },
        correct_answer:{
            type:Number,
            required:true
        },
    },
    { timestamps: true }
);

// Modelni yaratish
const Sav = model('Sav', SavSchema);

module.exports = Sav;
