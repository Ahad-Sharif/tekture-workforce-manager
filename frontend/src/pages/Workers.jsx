import { useEffect, useState } from "react"
import { API_BASE_URL } from "../api"
import { exportTableToPdf } from "../utils/exportPdf"

function Workers() {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState(null)

  const [newWorker, setNewWorker] = useState({
    name: "",
    role: "",
    company: "",
    iqamahNo: "",
    iqamahExpiryDate: "",
    phoneNumber: "",
    status: "Active"
  })

  const fetchWorkers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/workers`)
      const data = await response.json()
      setWorkers(data)
    } catch (error) {
      console.error("Failed to fetch workers:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkers()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    setNewWorker({
      ...newWorker,
      [name]: value
    })
  }

  const resetForm = () => {
    setNewWorker({
      name: "",
      role: "",
      company: "",
      iqamahNo: "",
      iqamahExpiryDate: "",
      phoneNumber: "",
      status: "Active"
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSaveWorker = async () => {
    const trimmedName = newWorker.name.trim()
    const trimmedRole = newWorker.role.trim()
    const trimmedCompany = newWorker.company.trim()
    const trimmedIqamahNo = newWorker.iqamahNo.trim()
    const trimmedIqamahExpiryDate = newWorker.iqamahExpiryDate.trim()
    const trimmedPhoneNumber = newWorker.phoneNumber.trim()

    if (
      trimmedName === "" ||
      trimmedRole === "" ||
      trimmedCompany === "" ||
      trimmedIqamahNo === "" ||
      trimmedIqamahExpiryDate === "" ||
      trimmedPhoneNumber === ""
    ) {
      alert("Please fill all fields properly")
      return
    }

    if (newWorker.status !== "Active" && newWorker.status !== "Inactive") {
      alert("Invalid status selected")
      return
    }

    const workerToSave = {
      name: trimmedName,
      role: trimmedRole,
      company: trimmedCompany,
      iqamahNo: trimmedIqamahNo,
      iqamahExpiryDate: trimmedIqamahExpiryDate,
      phoneNumber: trimmedPhoneNumber,
      status: newWorker.status
    }

    try {
      if (editingId) {
        await fetch(`${API_BASE_URL}/api/workers/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(workerToSave)
        })
      } else {
        await fetch(`${API_BASE_URL}/api/workers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(workerToSave)
        })
      }

      await fetchWorkers()
      resetForm()
    } catch (error) {
      console.error("Failed to save worker:", error)
      alert("Failed to save worker")
    }
  }

  const handleDeleteWorker = async (workerId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this worker?")

    if (!confirmDelete) {
      return
    }

    try {
      await fetch(`${API_BASE_URL}/api/workers/${workerId}`, {
        method: "DELETE"
      })

      await fetchWorkers()
    } catch (error) {
      console.error("Failed to delete worker:", error)
      alert("Failed to delete worker")
    }
  }

  const handleEditWorker = (worker) => {
    setNewWorker({
      name: worker.name || "",
      role: worker.role || "",
      company: worker.company || "",
      iqamahNo: worker.iqamahNo || "",
      iqamahExpiryDate: worker.iqamahExpiryDate || "",
      phoneNumber: worker.phoneNumber || "",
      status: worker.status || "Active"
    })

    setEditingId(worker._id)
    setShowForm(true)
  }

  const handleDownloadPdf = () => {
    const columns = [
      "Name",
      "Role",
      "Company",
      "Iqamah No",
      "Iqamah Expiry",
      "Phone Number",
      "Status"
    ]

    const rows = filteredWorkers.map((worker) => [
      worker.name,
      worker.role,
      worker.company,
      worker.iqamahNo || "-",
      worker.iqamahExpiryDate || "-",
      worker.phoneNumber || "-",
      worker.status
    ])

    exportTableToPdf("Workers Records", columns, rows, "workers-records.pdf")
  }

  const filteredWorkers = workers.filter((worker) =>
    worker.name.toLowerCase().startsWith(searchTerm.trim().toLowerCase())
  )

  if (loading) {
    return (
      <div className="page-section">
        <h2>Loading workers...</h2>
      </div>
    )
  }

  return (
    <div className="page-section">
      <div className="page-header">
        <div>
          <h1>Workers</h1>
          <p>Manage all outsourced workers in Tekture.</p>
        </div>

        <div className="form-actions">
          <button
            className="secondary-btn"
            onClick={handleDownloadPdf}
          >
            Download PDF
          </button>

          <button
            className="primary-btn"
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
          >
            Add Worker
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-card">
          <h2 className="form-title">
            {editingId ? "Edit Worker" : "Add New Worker"}
          </h2>

          <div className="form-grid">
            <input
              type="text"
              name="name"
              placeholder="Worker Name"
              className="form-input"
              value={newWorker.name}
              onChange={handleChange}
            />

            <input
              type="text"
              name="role"
              placeholder="Role"
              className="form-input"
              value={newWorker.role}
              onChange={handleChange}
            />

            <input
              type="text"
              name="company"
              placeholder="Assigned Company"
              className="form-input"
              value={newWorker.company}
              onChange={handleChange}
            />

            <input
              type="text"
              name="iqamahNo"
              placeholder="Iqamah Number"
              className="form-input"
              value={newWorker.iqamahNo}
              onChange={handleChange}
            />

            <input
              type="date"
              name="iqamahExpiryDate"
              className="form-input"
              value={newWorker.iqamahExpiryDate}
              onChange={handleChange}
            />

            <input
              type="text"
              name="phoneNumber"
              placeholder="Worker Phone Number"
              className="form-input"
              value={newWorker.phoneNumber}
              onChange={handleChange}
            />

            <select
              name="status"
              className="form-input"
              value={newWorker.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="form-actions">
            <button className="primary-btn" onClick={handleSaveWorker}>
              {editingId ? "Update Worker" : "Save Worker"}
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
            placeholder="Search workers by name..."
            className="search-input"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Company</th>
              <th>Iqamah No</th>
              <th>Iqamah Expiry</th>
              <th>Phone Number</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredWorkers.map((worker) => (
              <tr key={worker._id}>
                <td>{worker.name}</td>
                <td>{worker.role}</td>
                <td>{worker.company}</td>
                <td>{worker.iqamahNo || "-"}</td>
                <td>{worker.iqamahExpiryDate || "-"}</td>
                <td>{worker.phoneNumber || "-"}</td>
                <td>
                  <span
                    className={
                      worker.status === "Active"
                        ? "status-badge status-active"
                        : "status-badge status-absent"
                    }
                  >
                    {worker.status}
                  </span>
                </td>
                <td className="action-buttons">
                  <button
                    className="edit-btn"
                    onClick={() => handleEditWorker(worker)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteWorker(worker._id)}
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

export default Workers