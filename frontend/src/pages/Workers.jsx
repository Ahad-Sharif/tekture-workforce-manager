import { useState } from "react"

function Workers({ workers, fetchWorkers }) {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState(null)

  const [newWorker, setNewWorker] = useState({
    name: "",
    role: "",
    company: "",
    status: "Active"
  })

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
      status: "Active"
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSaveWorker = async () => {
    const trimmedName = newWorker.name.trim()
    const trimmedRole = newWorker.role.trim()
    const trimmedCompany = newWorker.company.trim()

    if (trimmedName === "" || trimmedRole === "" || trimmedCompany === "") {
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
      status: newWorker.status
    }

    try {
      if (editingId) {
        await fetch(`http://localhost:5001/api/workers/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(workerToSave)
        })
      } else {
        await fetch("http://localhost:5001/api/workers", {
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
      await fetch(`http://localhost:5001/api/workers/${workerId}`, {
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
      name: worker.name,
      role: worker.role,
      company: worker.company,
      status: worker.status
    })

    setEditingId(worker._id)
    setShowForm(true)
  }

  const filteredWorkers = workers.filter((worker) =>
    worker.name.toLowerCase().startsWith(searchTerm.trim().toLowerCase())
  )

  return (
    <div className="page-section">
      <div className="page-header">
        <div>
          <h1>Workers</h1>
          <p>Manage all outsourced workers in Tekture.</p>
        </div>

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