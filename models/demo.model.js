const { Schema, model } = require('mongoose');

const DemogrammmarSchema = new Schema(
  {
    // Savol matni
    question: {
      type: String,
      required: true,
      trim: true
    },

    // Variantlar (kamida 2 ta bo'lishi lozim)
    options: {
      type: [String],
      required: true,
      validate: [(val) => val.length >= 2, 'Kamida 2 ta variant bo‘lishi kerak']
    },

    // To'g'ri javob
    correct_answer: {
      type: String,
      required: true
    },

    // Izoh (foydalanuvchiga to'g'ri javob tushuntiriladi)
    explanation: {
      type: String,
      default: '',
      trim: true
    },

    // Savol turi (enum)
    type: {
      type: String,
      enum: [
        'multiple-choice',
        'multiple-select',
        'fill-in-the-blank',
        'true-false',
        'drag-and-drop',
        'match-pairs',
        'reorder-sentence',
        'choose-the-correct-form',
        'error-identification',
        'sentence-completion'
      ],
      required: true
    },

    // Har bir savol uchun ball
    points: {
      type: Number,
      default: 1,
      min: 0
    },

    // Media fayllar (faqat rasm hozircha)
    media: {
      image: {
        type: String,
        default: ''
      }
    },

    // Variantlar har safar aralashtirib beriladimi yoki yo‘q
    shuffle_options: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true // createdAt va updatedAt avtomatik yaratiladi
  }
);

module.exports = model('Demogrammmar', DemogrammmarSchema);
