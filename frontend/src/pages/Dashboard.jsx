import StatCard from "../components/StatCard"

function Dashboard({ workers, companies, attendanceRecords, contracts }) {
  const today = new Date().toISOString().split("T")[0]

  const activeWorkersCount = workers.filter(
    (worker) => worker.status === "Active"
  ).length

  const inactiveWorkersCount = workers.filter(
    (worker) => worker.status === "Inactive"
  ).length

  const presentTodayCount = attendanceRecords.filter(
    (record) => record.status === "Present" && record.date === today
  ).length

  const absentTodayCount = attendanceRecords.filter(
    (record) => record.status === "Absent" && record.date === today
  ).length

  const expiringSoonContractsCount = contracts.filter(
    (contract) => contract.status === "Expiring Soon"
  ).length

  return (
    <div className="dashboard-page">
      <section className="top-banner">
        <h1>Dashboard</h1>
        <p>Welcome to the Tekture Workforce Management Platform</p>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Workforce Overview</h2>
          <p>Core workforce and company statistics</p>
        </div>

        <div className="dashboard-grid">
          <StatCard title="Total Workers" value={workers.length} />
          <StatCard title="Active Workers" value={activeWorkersCount} />
          <StatCard title="Inactive Workers" value={inactiveWorkersCount} />
          <StatCard title="Total Companies" value={companies.length} />
        </div>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Daily Operations</h2>
          <p>Attendance and contract activity for the system</p>
        </div>

        <div className="dashboard-grid">
          <StatCard title="Present Today" value={presentTodayCount} />
          <StatCard title="Absent Today" value={absentTodayCount} />
          <StatCard title="Total Contracts" value={contracts.length} />
          <StatCard title="Expiring Contracts" value={expiringSoonContractsCount} />
        </div>
      </section>
    </div>
  )
}

export default Dashboard