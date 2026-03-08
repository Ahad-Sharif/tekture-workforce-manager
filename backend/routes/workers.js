const express = require("express")
const router = express.Router()
const Worker = require("../models/Worker")

router.get("/", async (req, res) => {
  try {
    const workers = await Worker.find()
    res.json(workers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/", async (req, res) => {
  try {
    const newWorker = new Worker({
      name: req.body.name,
      role: req.body.role,
      company: req.body.company,
      status: req.body.status
    })

    const savedWorker = await newWorker.save()
    res.status(201).json(savedWorker)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.put("/:id", async (req, res) => {
  try {
    const updatedWorker = await Worker.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        role: req.body.role,
        company: req.body.company,
        status: req.body.status
      },
      { new: true }
    )

    res.json(updatedWorker)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    await Worker.findByIdAndDelete(req.params.id)
    res.json({ message: "Worker deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router