const mongoose = require("mongoose")

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  industry: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  workersAssigned: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model("Company", companySchema)