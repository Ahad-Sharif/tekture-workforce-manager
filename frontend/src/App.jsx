import { useState, useEffect } from "react"
import "./App.css"
import { Routes, Route, NavLink, Navigate, useNavigate } from "react-router-dom"
import { MdDashboard, MdGroups, MdBusiness, MdCalendarMonth, MdDescription } from "react-icons/md"

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

  useEffect(() => {
    const latestUser = getStoredUser()
    setUser(latestUser)
  }, [])

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
            className="brand-block brand-block-logo-only"
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
          >
            <img
              src="/psfm-logo.gif"
              alt="PSFM Logo"
              className="brand-gif"
            />
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
            <Route path="/workers" element={<Workers />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/contracts" element={<Contracts />} />
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
          className="brand-block brand-block-logo-only"
          onClick={handleLogoClick}
          style={{ cursor: "pointer" }}
        >
          <img
            src="/psfm-logo.gif"
            alt="PSFM Logo"
            className="brand-gif"
          />
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
          <Route path="/" element={<Dashboard />} />
          <Route path="/workers" element={<Workers />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/employee" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App