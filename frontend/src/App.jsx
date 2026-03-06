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
  const defaultWorkers = [
    {
      name: "Ahmed Khan",
      role: "Electrician",
      company: "Company A",
      status: "Active"
    },
    {
      name: "Bilal Shah",
      role: "Supervisor",
      company: "Company B",
      status: "Active"
    },
    {
      name: "Ali Raza",
      role: "Driver",
      company: "Company C",
      status: "Inactive"
    }
  ]

  const defaultCompanies = [
    {
      name: "Company A",
      industry: "Construction",
      location: "Jeddah",
      workersAssigned: "25"
    },
    {
      name: "Company B",
      industry: "Logistics",
      location: "Riyadh",
      workersAssigned: "12"
    },
    {
      name: "Company C",
      industry: "Maintenance",
      location: "Dammam",
      workersAssigned: "8"
    }
  ]

  const defaultAttendanceRecords = [
    {
      workerName: "Ahmed Khan",
      company: "Company A",
      date: "2026-03-06",
      status: "Present"
    },
    {
      workerName: "Bilal Shah",
      company: "Company B",
      date: "2026-03-06",
      status: "Absent"
    },
    {
      workerName: "Ali Raza",
      company: "Company C",
      date: "2026-03-06",
      status: "Present"
    }
  ]

  const defaultContracts = [
    {
      workerName: "Ahmed Khan",
      company: "Company A",
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      status: "Active"
    },
    {
      workerName: "Bilal Shah",
      company: "Company B",
      startDate: "2026-02-01",
      endDate: "2026-11-30",
      status: "Active"
    },
    {
      workerName: "Ali Raza",
      company: "Company C",
      startDate: "2025-06-01",
      endDate: "2026-05-31",
      status: "Expiring Soon"
    }
  ]

  const [workers, setWorkers] = useState(() => {
    const savedWorkers = localStorage.getItem("tekture_workers")
    return savedWorkers ? JSON.parse(savedWorkers) : defaultWorkers
  })

  const [companies, setCompanies] = useState(() => {
    const savedCompanies = localStorage.getItem("tekture_companies")
    return savedCompanies ? JSON.parse(savedCompanies) : defaultCompanies
  })

  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    const savedAttendance = localStorage.getItem("tekture_attendance")
    return savedAttendance ? JSON.parse(savedAttendance) : defaultAttendanceRecords
  })

  const [contracts, setContracts] = useState(() => {
    const savedContracts = localStorage.getItem("tekture_contracts")
    return savedContracts ? JSON.parse(savedContracts) : defaultContracts
  })

  useEffect(() => {
    localStorage.setItem("tekture_workers", JSON.stringify(workers))
  }, [workers])

  useEffect(() => {
    localStorage.setItem("tekture_companies", JSON.stringify(companies))
  }, [companies])

  useEffect(() => {
    localStorage.setItem("tekture_attendance", JSON.stringify(attendanceRecords))
  }, [attendanceRecords])

  useEffect(() => {
    localStorage.setItem("tekture_contracts", JSON.stringify(contracts))
  }, [contracts])

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
                setWorkers={setWorkers}
              />
            }
          />

          <Route
            path="/companies"
            element={
              <Companies
                companies={companies}
                setCompanies={setCompanies}
              />
            }
          />

          <Route
            path="/attendance"
            element={
              <Attendance
                attendanceRecords={attendanceRecords}
                setAttendanceRecords={setAttendanceRecords}
              />
            }
          />

          <Route
            path="/contracts"
            element={
              <Contracts
                contracts={contracts}
                setContracts={setContracts}
              />
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App