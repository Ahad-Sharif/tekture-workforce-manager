import { useState } from "react"

function Attendance({ attendanceRecords, fetchAttendanceRecords }) {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const [newAttendance, setNewAttendance] = useState({
    workerName: "",
    company: "",
    date: "",
    status: "Present"
  })

  const handleChange = (event) => {
    const { name, value } = event.target

    setNewAttendance({
      ...newAttendance,
      [name]: value
    })
  }

  const resetForm = () => {
    setNewAttendance({
      workerName: "",
      company: "",
      date: "",
      status: "Present"
    })
    setShowForm(false)
  }

  const handleSaveAttendance = async () => {
    const trimmedWorkerName = newAttendance.workerName.trim()
    const trimmedCompany = newAttendance.company.trim()
    const trimmedDate = newAttendance.date.trim()

    if (trimmedWorkerName === "" || trimmedCompany === "" || trimmedDate === "") {
      alert("Please fill all fields properly")
      return
    }

    if (newAttendance.status !== "Present" && newAttendance.status !== "Absent") {
      alert("Invalid attendance status selected")
      return
    }

    const attendanceToSave = {
      workerName: trimmedWorkerName,
      company: trimmedCompany,
      date: trimmedDate,
      status: newAttendance.status
    }

    try {
      await fetch("http://localhost:5001/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(attendanceToSave)
      })

      await fetchAttendanceRecords()
      resetForm()
    } catch (error) {
      console.error("Failed to save attendance:", error)
      alert("Failed to save attendance")
    }
  }

  const handleDeleteAttendance = async (attendanceId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this attendance record?")

    if (!confirmDelete) {
      return
    }

    try {
      await fetch(`http://localhost:5001/api/attendance/${attendanceId}`, {
        method: "DELETE"
      })

      await fetchAttendanceRecords()
    } catch (error) {
      console.error("Failed to delete attendance:", error)
      alert("Failed to delete attendance")
    }
  }

  const filteredAttendance = attendanceRecords.filter((record) =>
    record.workerName.toLowerCase().startsWith(searchTerm.trim().toLowerCase())
  )

  return (
    <div className="page-section">
      <div className="page-header">
        <div>
          <h1>Attendance</h1>
          <p>Track daily workforce attendance in Tekture.</p>
        </div>

        <button className="primary-btn" onClick={() => setShowForm(true)}>
          Mark Attendance
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2 className="form-title">Mark Attendance</h2>

          <div className="form-grid">
            <input
              type="text"
              name="workerName"
              placeholder="Worker Name"
              className="form-input"
              value={newAttendance.workerName}
              onChange={handleChange}
            />

            <input
              type="text"
              name="company"
              placeholder="Company"
              className="form-input"
              value={newAttendance.company}
              onChange={handleChange}
            />

            <input
              type="date"
              name="date"
              className="form-input"
              value={newAttendance.date}
              onChange={handleChange}
            />

            <select
              name="status"
              className="form-input"
              value={newAttendance.status}
              onChange={handleChange}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>

          <div className="form-actions">
            <button className="primary-btn" onClick={handleSaveAttendance}>
              Save Attendance
            </button>

            <button className="secondary-btn" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="table-card">
        <div className="table-topbar">
          <input
            type="text"
            placeholder="Search attendance by worker name..."
            className="search-input"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Worker Name</th>
              <th>Company</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAttendance.map((record) => (
              <tr key={record._id}>
                <td>{record.workerName}</td>
                <td>{record.company}</td>
                <td>{record.date}</td>
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