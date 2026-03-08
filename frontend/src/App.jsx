import { useState, useEffect } from "react"
import "./App.css"
import { Routes, Route, NavLink } from "react-router-dom"
import { MdDashboard, MdGroups, MdBusiness, MdCalendarMonth, MdDescription } from "react-icons/md"

import Dashboard from "./pages/Dashboard"
import Workers from "./pages/Workers"
import Companies from "./pages/Companies"
import Attendance from "./pages/Attendance"
import Contracts from "./pages/Contracts"

function App() {
  const [workers, setWorkers] = useState([])
  const [companies, setCompanies] = useState([])
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [contracts, setContracts] = useState([])

  const fetchWorkers = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/workers")
      const data = await response.json()
      setWorkers(data)
    } catch (error) {
      console.error("Failed to fetch workers:", error)
    }
  }

  const fetchCompanies = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/companies")
      const data = await response.json()
      setCompanies(data)
    } catch (error) {
      console.error("Failed to fetch companies:", error)
    }
  }

  const fetchAttendanceRecords = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/attendance")
      const data = await response.json()
      setAttendanceRecords(data)
    } catch (error) {
      console.error("Failed to fetch attendance records:", error)
    }
  }

  const fetchContracts = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/contracts")
      const data = await response.json()
      setContracts(data)
    } catch (error) {
      console.error("Failed to fetch contracts:", error)
    }
  }

  useEffect(() => {
    fetchWorkers()
    fetchCompanies()
    fetchAttendanceRecords()
    fetchContracts()
  }, [])

  const todayFormatted = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-icon">T</div>

          <div className="brand-text">
            <h2 className="logo">Tekture</h2>
            <p>Workforce Management Made Easy</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end>
            <MdDashboard />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/workers">
            <MdGroups />
            <span>Workers</span>
          </NavLink>

          <NavLink to="/companies">
            <MdBusiness />
            <span>Companies</span>
          </NavLink>

          <NavLink to="/attendance">
            <MdCalendarMonth />
            <span>Attendance</span>
          </NavLink>

          <NavLink to="/contracts">
            <MdDescription />
            <span>Contracts</span>
          </NavLink>
        </nav>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <div>
            <h3>Tekture Admin Panel</h3>
          </div>

          <div className="topbar-right">
            <span className="date-chip">{todayFormatted}</span>
            <span className="user-chip">Admin</span>
          </div>
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                workers={workers}
                companies={companies}
                attendanceRecords={attendanceRecords}
                contracts={contracts}
              />
            }
          />

          <Route
            path="/workers"
            element={
              <Workers
                workers={workers}
                fetchWorkers={fetchWorkers}
              />
            }
          />

          <Route
            path="/companies"
            element={
              <Companies
                companies={companies}
                fetchCompanies={fetchCompanies}
              />
            }
          />

          <Route
            path="/attendance"
            element={
              <Attendance
                attendanceRecords={attendanceRecords}
                fetchAttendanceRecords={fetchAttendanceRecords}
              />
            }
          />

          <Route
            path="/contracts"
            element={
              <Contracts
                contracts={contracts}
                fetchContracts={fetchContracts}
              />
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App