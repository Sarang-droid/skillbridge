const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  industry: { type: String, required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: Number, required: true },
  date: { type: String, required: true }
});

module.exports = mongoose.model('Quiz', quizSchema);