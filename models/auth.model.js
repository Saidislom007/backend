const { Schema, model } = require('mongoose');

// User Schema
const UserSchema = new Schema(
    {
        email: { 
            type: String, 
            required: true, 
            unique: true 
        },
        password: { 
            type: String, 
            required: true 
        },
        fullname: { 
            type: String, 
            required: true, 
            unique: true 
        },
        isActivated: { 
            type: Boolean, 
            default: false 
        },
        skills: {
            reading: { 
                type: Number,  
                default: 0 
            },  // 0 dan 10 gacha
            listening: { 
                type: Number, 
                default: 0 
            },
            writing: { 
                type: Number,  
                default: 0 
            },
            speaking: { 
                type: Number,  
                default: 0 
            }
        },
        tests: {
            readingTest: {
                totalScore: { type: Number, default: 0 },
                correctAnswers: { type: Number, default: 0 },
                incorrectAnswers: { type: Number, default: 0 },
                testHistory: [{
                    score: { type: Number, default: 0 },
                    date: { type: Date, default: Date.now },
                    answers: [{
                        question: String,
                        correctAnswer: String,
                        userAnswer: String,
                        isCorrect: { type: Boolean, default: false }
                    }]
                }]
            },
            vocabTest: {
                totalScore: { type: Number, default: 0 },
                correctAnswers: { type: Number, default: 0 },
                incorrectAnswers: { type: Number, default: 0 },
                testHistory: [{
                    score: { type: Number, default: 0 },
                    date: { type: Date, default: Date.now },
                    answers: [{
                        word: String,
                        correctTranslation: String,
                        userTranslation: String,
                        isCorrect: { type: Boolean, default: false }
                    }]
                }]
            },
            writingTest: {
                totalScore: { type: Number, default: 0 },
                correctAnswers: { type: Number, default: 0 },
                incorrectAnswers: { type: Number, default: 0 },
                testHistory: [{
                    score: { type: Number, default: 0 },
                    date: { type: Date, default: Date.now },
                    userAnswer: String, // Foydalanuvchi yozgan javob
                    isCorrect: { type: Boolean, default: false }
                }]
            },
            speakingTest: {
                totalScore: { type: Number, default: 0 },
                correctAnswers: { type: Number, default: 0 },
                incorrectAnswers: { type: Number, default: 0 },
                testHistory: [{
                    score: { type: Number, default: 0 },
                    date: { type: Date, default: Date.now },
                    userAnswer: String, // Foydalanuvchi javobi
                    isCorrect: { type: Boolean, default: false }
                }]
            }
        },
        coins :{
            type:Number,
            default:0
        },

    },
    { timestamps: true }
);

// Modelni yaratish
const User = model('User', UserSchema);

module.exports = User;
