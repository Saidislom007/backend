const { Schema, model } = require('mongoose');

const GrammarSimpleTestSchema = new Schema(
  {

    number_of_solvers: {
      type: Number,
      default: 0
    },
    correct_counts: {
      type: Number,
      default: 0
    },
    wrong_counts: {
      type: Number,
      default: 0
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
      required: true
    },
    content: {
      type: Schema.Types.Mixed, // har qanday JSON struktura
      default: {}, // bo‘sh obyekt
      required:true
    },
  },
  { timestamps: true }
);

module.exports = model('GrammarSimpleTest', GrammarSimpleTestSchema); // Ensure this is being exported
