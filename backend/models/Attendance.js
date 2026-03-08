const mongoose = require("mongoose")

const attendanceSchema = new mongoose.Schema({
  workerName: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Present", "Absent"],
    default: "Present"
  }
}, {
  timestamps: true
})

module.exports = mongoose.model("Attendance", attendanceSchema)