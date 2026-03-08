const express = require("express")
const router = express.Router()
const Attendance = require("../models/Attendance")

router.get("/", async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find()
    res.json(attendanceRecords)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/", async (req, res) => {
  try {
    const newAttendance = new Attendance({
      workerName: req.body.workerName,
      company: req.body.company,
      date: req.body.date,
      status: req.body.status
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
    res.json({ message: "Attendance record deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router