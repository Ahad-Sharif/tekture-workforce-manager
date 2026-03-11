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
      existingAttendance.status = status
      existingAttendance.workerName = workerName
      existingAttendance.company = company
      existingAttendance.markedAt = now

      const updatedAttendance = await existingAttendance.save()
      return res.json(updatedAttendance)
    }

    const newAttendance = new Attendance({
      workerId,
      workerName,
      company,
      date: today,
      status,
      markedAt: now
    })

    const savedAttendance = await newAttendance.save()
    res.status(201).json(savedAttendance)
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