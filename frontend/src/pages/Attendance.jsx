import { useEffect, useState } from "react"
import { API_BASE_URL } from "../api"
import { exportTableToPdf } from "../utils/exportPdf"
import { exportTableToExcel } from "../utils/exportExcel"

function Attendance() {
  const [workers, setWorkers] = useState([])
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [historySearchTerm, setHistorySearchTerm] = useState("")

  const today = new Date().toISOString().split("T")[0]

  const OFFICE_LATITUDE = 21.543333
  const OFFICE_LONGITUDE = 39.172779
  const OFFICE_RADIUS_METERS = 100

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

  const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
    const toRadians = (value) => (value * Math.PI) / 180

    const earthRadius = 6371000
    const dLat = toRadians(lat2 - lat1)
    const dLon = toRadians(lon2 - lon1)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return earthRadius * c
  }

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    })
  }

  const handleMarkAttendance = async (worker, status) => {
    try {
      const location = await getCurrentLocation()

      const distance = getDistanceInMeters(
        location.latitude,
        location.longitude,
        OFFICE_LATITUDE,
        OFFICE_LONGITUDE
      )

      const officeStatus =
        distance <= OFFICE_RADIUS_METERS ? "Inside Office" : "Outside Office"

      const response = await fetch(`${API_BASE_URL}/api/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          workerId: worker._id,
          workerName: worker.name,
          company: worker.company,
          status,
          latitude: location.latitude,
          longitude: location.longitude,
          officeStatus
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
      alert("Location permission is required to mark attendance")
    }
  }

  const handleClockOut = async (attendanceId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/attendance/clock-out/${attendanceId}`, {
        method: "PUT"
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || "Failed to record clock out")
        return
      }

      await fetchAttendanceRecords()
    } catch (error) {
      console.error("Failed to clock out:", error)
      alert("Failed to record clock out")
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

  const formatTime = (dateValue) => {
    if (!dateValue) return "-"
    return new Date(dateValue).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const activeWorkers = workers.filter((worker) => worker.status === "Active")

  const filteredHistory = attendanceRecords.filter((record) =>
    record.workerName.toLowerCase().includes(historySearchTerm.trim().toLowerCase())
  )

  const handleDownloadPdf = () => {
    const columns = [
      "Worker Name",
      "Company",
      "Date",
      "Clock In",
      "Clock Out",
      "Status",
      "Office Status"
    ]

    const rows = filteredHistory.map((record) => [
      record.workerName,
      record.company,
      record.date,
      formatTime(record.markedAt),
      formatTime(record.clockOutAt),
      record.status,
      record.officeStatus || "-"
    ])

    exportTableToPdf("Attendance Records", columns, rows, "attendance-records.pdf")
  }

  const handleDownloadExcel = () => {
    const columns = [
      "Worker Name",
      "Company",
      "Date",
      "Clock In",
      "Clock Out",
      "Status",
      "Office Status"
    ]

    const rows = filteredHistory.map((record) => [
      record.workerName,
      record.company,
      record.date,
      formatTime(record.markedAt),
      formatTime(record.clockOutAt),
      record.status,
      record.officeStatus || "-"
    ])

    exportTableToExcel("Attendance Records", columns, rows, "attendance-records.xlsx")
  }

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

        <div className="form-actions">
          <button className="secondary-btn" onClick={handleDownloadPdf}>
            Download PDF
          </button>

          <button className="secondary-btn" onClick={handleDownloadExcel}>
            Download Excel
          </button>
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
              <th>Clock Out Time</th>
              <th>Office Status</th>
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
                  <td>{todayAttendance ? formatTime(todayAttendance.markedAt) : "-"}</td>
                  <td>{todayAttendance ? formatTime(todayAttendance.clockOutAt) : "-"}</td>
                  <td>
                    {todayAttendance ? (
                      <span
                        className={
                          todayAttendance.officeStatus === "Inside Office"
                            ? "status-badge status-present"
                            : "status-badge status-absent"
                        }
                      >
                        {todayAttendance.officeStatus}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="action-buttons">
                    {!todayAttendance ? (
                      <>
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
                      </>
                    ) : !todayAttendance.clockOutAt ? (
                      <button
                        className="primary-btn"
                        onClick={() => handleClockOut(todayAttendance._id)}
                      >
                        Clock Out
                      </button>
                    ) : (
                      <span className="status-badge status-active">Completed</span>
                    )}
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
          <p>All saved attendance records with office check result</p>
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
              <th>Clock Out Time</th>
              <th>Status</th>
              <th>Office Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredHistory.map((record) => (
              <tr key={record._id}>
                <td>{record.workerName}</td>
                <td>{record.company}</td>
                <td>{record.date}</td>
                <td>{formatTime(record.markedAt)}</td>
                <td>{formatTime(record.clockOutAt)}</td>
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
                <td>
                  <span
                    className={
                      record.officeStatus === "Inside Office"
                        ? "status-badge status-present"
                        : "status-badge status-absent"
                    }
                  >
                    {record.officeStatus || "Outside Office"}
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