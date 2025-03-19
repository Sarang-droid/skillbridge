const mongoose = require('mongoose');

const personalitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true
  },
  coreDesire: {
    type: String,
    required: true
  },
  hiddenFear: {
    type: String,
    required: true
  },
  keyword: {
    type: String,
    required: true
  },
  strengths: {
    type: [String],
    required: true
  },
  weaknesses: {
    type: [String],
    required: true
  },
  famousPersonalities: {
    type: [String],
    required: true
  },
  // New fields from additional data points
  coreMotivations: {
    type: String,
    required: true
  },
  workplaceRole: {
    type: String,
    required: true
  },
  communicationStyle: {
    type: String,
    required: true
  },
  learningStyle: {
    type: String,
    required: true
  },
  bestIndustries: {
    type: [String],
    required: true
  },
  stressTriggers: {
    type: [String],
    required: true
  },
  conflictStyle: {
    type: String,
    required: true
  },
  innovationVsStability: {
    type: String,
    required: true,
    enum: ['Innovation', 'Stability']
  },
  bestCollaborationMatch: {
    type: String,
    required: true
  },
  selfImprovementTip: {
    type: String,
    required: true
  },
  description: { // Adding the one-liner description
    type: String,
    required: true
  }
});

const Personality = mongoose.model('Personality', personalitySchema);

module.exports = Personality;