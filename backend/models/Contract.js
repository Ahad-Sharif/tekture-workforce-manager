const mongoose = require("mongoose")

const contractSchema = new mongoose.Schema({
  workerName: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Active", "Expiring Soon", "Expired"],
    default: "Active"
  }
}, {
  timestamps: true
})

module.exports = mongoose.model("Contract", contractSchema)