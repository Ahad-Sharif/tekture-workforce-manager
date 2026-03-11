const express = require("express")
const router = express.Router()
const Company = require("../models/Company")

router.get("/", async (req, res) => {
  try {
    const companies = await Company.find().lean()
    res.json(companies)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/", async (req, res) => {
  try {
    const newCompany = new Company({
      name: req.body.name,
      industry: req.body.industry,
      location: req.body.location,
      workersAssigned: req.body.workersAssigned
    })

    const savedCompany = await newCompany.save()
    res.status(201).json(savedCompany)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.put("/:id", async (req, res) => {
  try {
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        industry: req.body.industry,
        location: req.body.location,
        workersAssigned: req.body.workersAssigned
      },
      { new: true }
    )

    res.json(updatedCompany)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id)
    res.json({ message: "Company deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router