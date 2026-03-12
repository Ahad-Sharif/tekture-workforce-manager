const express = require("express")
const router = express.Router()
const Attendance = require("../models/Attendance")

router.get("/", async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find().sort({ markedAt: -1 }).lean()
    res.json(attendanceRecords)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/", async (req, res) => {
  try {
    const { workerId, workerName, company, status } = req.body

    if (!workerId || !workerName || !company || !status) {
      return res.status(400).json({ message: "Missing required attendance fields" })
    }

    if (status !== "Present" && status !== "Absent") {
      return res.status(400).json({ message: "Invalid attendance status" })
    }

    const now = new Date()
    const today = now.toISOString().split("T")[0]

    const existingAttendance = await Attendance.findOne({
      workerId,
      date: today
    })

    if (existingAttendance) {
      return res.status(400).json({
        message: "Attendance has already been marked for this worker today"
      })
    }

    const newAttendance = new Attendance({
      workerId,
      workerName,
      company,
      date: today,
      status,
      markedAt: now,
      clockOutAt: null
    })

    const savedAttendance = await newAttendance.save()
    res.status(201).json(savedAttendance)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.put("/clock-out/:id", async (req, res) => {
  try {
    const attendanceRecord = await Attendance.findById(req.params.id)

    if (!attendanceRecord) {
      return res.status(404).json({ message: "Attendance record not found" })
    }

    if (attendanceRecord.clockOutAt) {
      return res.status(400).json({ message: "Clock out has already been recorded" })
    }

    attendanceRecord.clockOutAt = new Date()

    const updatedAttendance = await attendanceRecord.save()
    res.json(updatedAttendance)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id)
    res.json({ message: "Attendance deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router