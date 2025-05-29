const { Schema, model, Types } = require('mongoose');

// Statistika Schema
const StatistikaSchema = new Schema(
    {
        user: {
            type: Types.ObjectId,
            ref: 'User',
            required: true
        },
        testDate: {
            type: Date,
            default: Date.now
        },
        score: {
            reading: { type: Number, required: true },
            listening: { type: Number, required: true },
            writing: { type: Number, required: true },
            speaking: { type: Number, required: true }
        },
        totalScore: {
            type: Number,
            required: true
        },
        testType: {
            type: String,
            required: true
          }
    },
    { timestamps: true }
);

// totalScore ni avtomatik hisoblash uchun middleware
StatistikaSchema.pre('save', function (next) {
    this.totalScore =
        this.score.reading +
        this.score.listening +
        this.score.writing +
        this.score.speaking;
    next();
});

module.exports = model('Statistika', StatistikaSchema);
