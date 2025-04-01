const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pilotCompanySchema = new Schema({
    name: { type: String, required: true },
    company: { type: String, required: true },
    email: { type: String, required: true },
    industry: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PilotCompany', pilotCompanySchema);