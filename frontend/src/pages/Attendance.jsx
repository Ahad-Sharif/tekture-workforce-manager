import { useEffect, useState } from "react"
import { API_BASE_URL } from "../api"

function Attendance() {
  const [workers, setWorkers] = useState([])
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [historySearchTerm, setHistorySearchTerm] = useState("")

  const today = new Date().toISOString().split("T")[0]

  const fetchWorkers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/workers`)
      const data = await response.json()
      setWorkers(data)
    } catch (error) {
      console.error("Failed to fetch workers:", error)
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

  const fetchAttendancePageData = async () => {
    try {
      await Promise.all([fetchWorkers(), fetchAttendanceRecords()])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendancePageData()
  }, [])

  const handleMarkAttendance = async (worker, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          workerId: worker._id,
          workerName: worker.name,
          company: worker.company,
          status
        })
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || "Failed to mark attendance")
        return
      }

      await fetchAttendanceRecords()
    } catch (error) {
      console.error("Failed to mark attendance:", error)
      alert("Failed to mark attendance")
    }
  }

  const handleDeleteAttendance = async (attendanceId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this attendance record?")

    if (!confirmDelete) {
      return
    }

    try {
      await fetch(`${API_BASE_URL}/api/attendance/${attendanceId}`, {
        method: "DELETE"
      })

      await fetchAttendanceRecords()
    } catch (error) {
      console.error("Failed to delete attendance:", error)
      alert("Failed to delete attendance")
    }
  }

  const getTodayAttendanceForWorker = (workerId) => {
    return attendanceRecords.find(
      (record) => record.workerId === workerId && record.date === today
    )
  }

  const formatMarkedTime = (markedAt) => {
    if (!markedAt) return "-"
    return new Date(markedAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const activeWorkers = workers.filter((worker) => worker.status === "Active")

  const filteredHistory = attendanceRecords.filter((record) =>
    record.workerName.toLowerCase().includes(historySearchTerm.trim().toLowerCase())
  )

  if (loading) {
    return (
      <div className="page-section">
        <h2>Loading attendance...</h2>
      </div>
    )
  }

  return (
    <div className="page-section">
      <div className="page-header">
        <div>
          <h1>Attendance</h1>
          <p>Mark daily attendance for active workers with one click.</p>
        </div>
      </div>

      <div className="table-card">
        <div className="dashboard-section-header" style={{ marginBottom: "18px" }}>
          <h2>Today's Attendance Register</h2>
          <p>Date: {today}</p>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Worker Name</th>
              <th>Company</th>
              <th>Status Today</th>
              <th>Clock In Time</th>
              <th>Mark Attendance</th>
            </tr>
          </thead>

          <tbody>
            {activeWorkers.map((worker) => {
              const todayAttendance = getTodayAttendanceForWorker(worker._id)

              return (
                <tr key={worker._id}>
                  <td>{worker.name}</td>
                  <td>{worker.company}</td>
                  <td>
                    {todayAttendance ? (
                      <span
                        className={
                          todayAttendance.status === "Present"
                            ? "status-badge status-present"
                            : "status-badge status-absent"
                        }
                      >
                        {todayAttendance.status}
                      </span>
                    ) : (
                      <span className="status-badge status-expiring">Not Marked</span>
                    )}
                  </td>
                  <td>{todayAttendance ? formatMarkedTime(todayAttendance.markedAt) : "-"}</td>
                  <td className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => handleMarkAttendance(worker, "Present")}
                    >
                      Present
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleMarkAttendance(worker, "Absent")}
                    >
                      Absent
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="table-card" style={{ marginTop: "24px" }}>
        <div className="dashboard-section-header" style={{ marginBottom: "18px" }}>
          <h2>Attendance History</h2>
          <p>All saved attendance records with date and marking time</p>
        </div>

        <div className="table-topbar">
          <input
            type="text"
            placeholder="Search attendance history by worker name..."
            className="search-input"
            value={historySearchTerm}
            onChange={(event) => setHistorySearchTerm(event.target.value)}
          />
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Worker Name</th>
              <th>Company</th>
              <th>Date</th>
              <th>Clock In Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredHistory.map((record) => (
              <tr key={record._id}>
                <td>{record.workerName}</td>
                <td>{record.company}</td>
                <td>{record.date}</td>
                <td>{formatMarkedTime(record.markedAt)}</td>
                <td>
                  <span
                    className={
                      record.status === "Present"
                        ? "status-badge status-present"
                        : "status-badge status-absent"
                    }
                  >
                    {record.status}
                  </span>
                </td>
                <td className="action-buttons">
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteAttendance(record._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Attendance