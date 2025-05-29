const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Vocabulary Schema
const TestSchema = new Schema({
    question: {
        type: String,
        required: true,
    },
    options: [{
        type: String,
        required: true,
    }],
    answer: {
        type: String,
        required: true,
    },
    totalSolve: {
        type: Number,
        default: 0,
    },
    attempts: [{
        userName: {
            type: String,
            default:"none"
        },
        isCorrect: {
            type: Number,
            default:0
        },
        date: {
            type: Date,
            default: Date.now,
        },
    }],
}, { timestamps: true });

// Create a model from the schema
const Test = mongoose.model('Test', TestSchema);

module.exports = Test;
