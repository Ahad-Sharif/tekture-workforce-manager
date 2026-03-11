import { useState, useEffect } from "react"
import "./App.css"
import { Routes, Route, NavLink, Navigate, useNavigate } from "react-router-dom"
import { MdDashboard, MdGroups, MdBusiness, MdCalendarMonth, MdDescription } from "react-icons/md"
import { API_BASE_URL } from "./api"

import Dashboard from "./pages/Dashboard"
import Workers from "./pages/Workers"
import Companies from "./pages/Companies"
import Attendance from "./pages/Attendance"
import Contracts from "./pages/Contracts"
import Login from "./pages/Login"
import EmployeeDashboard from "./pages/EmployeeDashboard"

function App() {
  const navigate = useNavigate()

  const getStoredUser = () => {
    try {
      const storedUser = localStorage.getItem("user")
      return storedUser ? JSON.parse(storedUser) : null
    } catch (error) {
      console.error("Failed to parse stored user:", error)
      return null
    }
  }

  const [user, setUser] = useState(getStoredUser())
  const [workers, setWorkers] = useState([])
  const [companies, setCompanies] = useState([])
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [contracts, setContracts] = useState([])

  const fetchWorkers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/workers`)
      const data = await response.json()
      setWorkers(data)
    } catch (error) {
      console.error("Failed to fetch workers:", error)
    }
  }

  const fetchCompanies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/companies`)
      const data = await response.json()
      setCompanies(data)
    } catch (error) {
      console.error("Failed to fetch companies:", error)
    }
  }

  const fetchAttendanceRecords = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/attendance`)
      const data = await response.json()
      setAttendanceRecords(data)
    } catch (error) {
      console.error("Failed to fetch attendance records:", error)
    }
  }

  const fetchContracts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contracts`)
      const data = await response.json()
      setContracts(data)
    } catch (error) {
      console.error("Failed to fetch contracts:", error)
    }
  }

  useEffect(() => {
    const latestUser = getStoredUser()
    setUser(latestUser)
  }, [])

  useEffect(() => {
    if (user) {
      fetchWorkers()
      fetchCompanies()
      fetchAttendanceRecords()
      fetchContracts()
    } else {
      setWorkers([])
      setCompanies([])
      setAttendanceRecords([])
      setContracts([])
    }
  }, [user])

  const todayFormatted = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    window.location.href = "/"
  }

  const handleLogoClick = () => {
    if (user?.role === "employee") {
      navigate("/employee")
    } else {
      navigate("/")
    }
  }

  const displayRoleLabel = user?.role === "admin" ? "Admin" : "Employee"

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    )
  }

  if (user.role === "employee") {
    return (
      <div className="app-layout">
        <aside className="sidebar">
          <div
            className="brand-block"
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
          >
            <div className="brand-icon">T</div>

            <div className="brand-text">
              <h2 className="logo">Tekture</h2>
              <p>Workforce Management Made Easy</p>
            </div>
          </div>

          <nav className="sidebar-nav">
            <NavLink to="/employee" end>
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
              <h3>Tekture Employee Panel</h3>
            </div>

            <div className="topbar-right">
              <span className="date-chip">{todayFormatted}</span>
              <span className="user-chip">{displayRoleLabel}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          <Routes>
            <Route path="/employee" element={<EmployeeDashboard />} />
            <Route
              path="/workers"
              element={<Workers workers={workers} fetchWorkers={fetchWorkers} />}
            />
            <Route
              path="/companies"
              element={<Companies companies={companies} fetchCompanies={fetchCompanies} />}
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
              element={<Contracts contracts={contracts} fetchContracts={fetchContracts} />}
            />
            <Route path="/" element={<Navigate to="/employee" replace />} />
            <Route path="*" element={<Navigate to="/employee" replace />} />
          </Routes>
        </main>
      </div>
    )
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div
          className="brand-block"
          onClick={handleLogoClick}
          style={{ cursor: "pointer" }}
        >
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
            <span className="user-chip">{displayRoleLabel}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
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
            element={<Workers workers={workers} fetchWorkers={fetchWorkers} />}
          />

          <Route
            path="/companies"
            element={<Companies companies={companies} fetchCompanies={fetchCompanies} />}
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
            element={<Contracts contracts={contracts} fetchContracts={fetchContracts} />}
          />

          <Route path="/employee" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App