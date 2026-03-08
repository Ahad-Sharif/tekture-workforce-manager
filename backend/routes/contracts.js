const express = require("express")
const router = express.Router()
const Contract = require("../models/Contract")

router.get("/", async (req, res) => {
  try {
    const contracts = await Contract.find()
    res.json(contracts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/", async (req, res) => {
  try {
    const newContract = new Contract({
      workerName: req.body.workerName,
      company: req.body.company,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      status: req.body.status
    })

    const savedContract = await newContract.save()
    res.status(201).json(savedContract)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.put("/:id", async (req, res) => {
  try {
    const updatedContract = await Contract.findByIdAndUpdate(
      req.params.id,
      {
        workerName: req.body.workerName,
        company: req.body.company,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        status: req.body.status
      },
      { new: true }
    )

    res.json(updatedContract)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    await Contract.findByIdAndDelete(req.params.id)
    res.json({ message: "Contract deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router