const mongoose = require("mongoose")

const attendanceSchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true
    },
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
      required: true
    },
    markedAt: {
      type: Date,
      required: true
    },
    clockOutAt: {
      type: Date,
      default: null
    },
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    },
    officeStatus: {
      type: String,
      enum: ["Inside Office", "Outside Office"],
      default: "Outside Office"
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model("Attendance", attendanceSchema)