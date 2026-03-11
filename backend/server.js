const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const workerRoutes = require("./routes/workers")
const companyRoutes = require("./routes/companies")
const attendanceRoutes = require("./routes/attendance")
const contractRoutes = require("./routes/contracts")
const authRoutes = require("./routes/auth")
const authMiddleware = require("./middleware/authMiddleware")
const roleMiddleware = require("./middleware/roleMiddleware")

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

connectDB()

app.get("/", (req, res) => {
  res.send("Tekture Backend API Running")
})

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed successfully",
    user: req.user
  })
})

app.get("/api/admin-only", authMiddleware, roleMiddleware("admin"), (req, res) => {
  res.json({
    message: "Welcome Admin",
    user: req.user
  })
})

app.get("/api/employee-only", authMiddleware, roleMiddleware("employee"), (req, res) => {
  res.json({
    message: `Welcome ${req.user.name}`,
    user: req.user
  })
})

app.use("/api/workers", workerRoutes)
app.use("/api/companies", companyRoutes)
app.use("/api/attendance", attendanceRoutes)
app.use("/api/contracts", contractRoutes)
app.use("/api/auth", authRoutes)

const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})