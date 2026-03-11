import { useNavigate } from "react-router-dom"

function EmployeeDashboard() {
  const navigate = useNavigate()

  return (
    <div className="dashboard-page">
      <section className="top-banner">
        <h1>Employee Portal</h1>
        <p>
          Welcome, Employee. Manage worker operations, attendance,
          companies and contracts.
        </p>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Quick Access</h2>
          <p>Select a module to continue your daily operational tasks</p>
        </div>

        <div className="dashboard-grid">
          <div
            className="stat-card clickable-card"
            onClick={() => navigate("/workers")}
          >
            <h3>Workers</h3>
          </div>

          <div
            className="stat-card clickable-card"
            onClick={() => navigate("/attendance")}
          >
            <h3>Attendance</h3>
          </div>

          <div
            className="stat-card clickable-card"
            onClick={() => navigate("/companies")}
          >
            <h3>Companies</h3>
          </div>

          <div
            className="stat-card clickable-card"
            onClick={() => navigate("/contracts")}
          >
            <h3>Contracts</h3>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Role Summary</h2>
          <p>Your current access level in Tekture</p>
        </div>

        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Access Level</th>
                <th>Portal</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Employee</td>
                <td>Operational Access</td>
                <td>Employee Panel</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default EmployeeDashboard