const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const workerRoutes = require("./routes/workers")
const companyRoutes = require("./routes/companies")
const attendanceRoutes = require("./routes/attendance")
const contractRoutes = require("./routes/contracts")

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

connectDB()

app.get("/", (req, res) => {
  res.send("Tekture Backend API Running")
})

app.use("/api/workers", workerRoutes)
app.use("/api/companies", companyRoutes)
app.use("/api/attendance", attendanceRoutes)
app.use("/api/contracts", contractRoutes)

const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})