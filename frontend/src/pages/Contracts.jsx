import { useEffect, useState } from "react"
import { API_BASE_URL } from "../api"
import { exportTableToPdf } from "../utils/exportPdf"
import { exportTableToExcel } from "../utils/exportExcel"

function Contracts() {
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState(null)

  const user = JSON.parse(localStorage.getItem("user"))
  const isAdmin = user?.role === "admin"

  const [newContract, setNewContract] = useState({
    workerName: "",
    company: "",
    startDate: "",
    endDate: "",
    status: "Active"
  })

  const fetchContracts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contracts`)
      const data = await response.json()
      setContracts(data)
    } catch (error) {
      console.error("Failed to fetch contracts:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContracts()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    setNewContract({
      ...newContract,
      [name]: value
    })
  }

  const resetForm = () => {
    setNewContract({
      workerName: "",
      company: "",
      startDate: "",
      endDate: "",
      status: "Active"
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSaveContract = async () => {
    const trimmedWorkerName = newContract.workerName.trim()
    const trimmedCompany = newContract.company.trim()
    const trimmedStartDate = newContract.startDate.trim()
    const trimmedEndDate = newContract.endDate.trim()

    if (
      trimmedWorkerName === "" ||
      trimmedCompany === "" ||
      trimmedStartDate === "" ||
      trimmedEndDate === ""
    ) {
      alert("Please fill all fields properly")
      return
    }

    if (
      newContract.status !== "Active" &&
      newContract.status !== "Expiring Soon" &&
      newContract.status !== "Expired"
    ) {
      alert("Invalid contract status selected")
      return
    }

    const contractToSave = {
      workerName: trimmedWorkerName,
      company: trimmedCompany,
      startDate: trimmedStartDate,
      endDate: trimmedEndDate,
      status: newContract.status
    }

    try {
      if (editingId) {
        await fetch(`${API_BASE_URL}/api/contracts/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(contractToSave)
        })
      } else {
        await fetch(`${API_BASE_URL}/api/contracts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(contractToSave)
        })
      }

      await fetchContracts()
      resetForm()
    } catch (error) {
      console.error("Failed to save contract:", error)
      alert("Failed to save contract")
    }
  }

  const handleEditContract = (contract) => {
    setNewContract({
      workerName: contract.workerName,
      company: contract.company,
      startDate: contract.startDate,
      endDate: contract.endDate,
      status: contract.status
    })

    setEditingId(contract._id)
    setShowForm(true)
  }

  const handleDeleteContract = async (contractId) => {
    if (!isAdmin) {
      alert("Employees are not allowed to delete contracts")
      return
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this contract?")

    if (!confirmDelete) {
      return
    }

    try {
      await fetch(`${API_BASE_URL}/api/contracts/${contractId}`, {
        method: "DELETE"
      })

      await fetchContracts()
    } catch (error) {
      console.error("Failed to delete contract:", error)
      alert("Failed to delete contract")
    }
  }

  const filteredContracts = contracts.filter((contract) =>
    contract.workerName.toLowerCase().startsWith(searchTerm.trim().toLowerCase())
  )

  const handleDownloadPdf = () => {
    const columns = [
      "Worker Name",
      "Company",
      "Start Date",
      "End Date",
      "Status"
    ]

    const rows = filteredContracts.map((contract) => [
      contract.workerName,
      contract.company,
      contract.startDate,
      contract.endDate,
      contract.status
    ])

    exportTableToPdf("Contracts Records", columns, rows, "contracts-records.pdf")
  }

  const handleDownloadExcel = () => {
    const columns = [
      "Worker Name",
      "Company",
      "Start Date",
      "End Date",
      "Status"
    ]

    const rows = filteredContracts.map((contract) => [
      contract.workerName,
      contract.company,
      contract.startDate,
      contract.endDate,
      contract.status
    ])

    exportTableToExcel("Contracts Records", columns, rows, "contracts-records.xlsx")
  }

  if (loading) {
    return (
      <div className="page-section">
        <h2>Loading contracts...</h2>
      </div>
    )
  }

  return (
    <div className="page-section">
      <div className="page-header">
        <div>
          <h1>Contracts</h1>
          <p>Manage all workforce contracts in Tekture.</p>
        </div>

        <div className="form-actions">
          <button className="secondary-btn" onClick={handleDownloadPdf}>
            Download PDF
          </button>

          <button className="secondary-btn" onClick={handleDownloadExcel}>
            Download Excel
          </button>

          <button
            className="primary-btn"
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
          >
            Add Contract
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-card">
          <h2 className="form-title">
            {editingId ? "Edit Contract" : "Add New Contract"}
          </h2>

          <div className="form-grid">
            <input
              type="text"
              name="workerName"
              placeholder="Worker Name"
              className="form-input"
              value={newContract.workerName}
              onChange={handleChange}
            />

            <input
              type="text"
              name="company"
              placeholder="Company"
              className="form-input"
              value={newContract.company}
              onChange={handleChange}
            />

            <input
              type="date"
              name="startDate"
              className="form-input"
              value={newContract.startDate}
              onChange={handleChange}
            />

            <input
              type="date"
              name="endDate"
              className="form-input"
              value={newContract.endDate}
              onChange={handleChange}
            />

            <select
              name="status"
              className="form-input"
              value={newContract.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Expiring Soon">Expiring Soon</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          <div className="form-actions">
            <button className="primary-btn" onClick={handleSaveContract}>
              {editingId ? "Update Contract" : "Save Contract"}
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
            placeholder="Search contracts by worker name..."
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
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredContracts.map((contract) => (
              <tr key={contract._id}>
                <td>{contract.workerName}</td>
                <td>{contract.company}</td>
                <td>{contract.startDate}</td>
                <td>{contract.endDate}</td>
                <td>
                  <span
                    className={
                      contract.status === "Active"
                        ? "status-badge status-active"
                        : contract.status === "Expiring Soon"
                        ? "status-badge status-expiring"
                        : "status-badge status-absent"
                    }
                  >
                    {contract.status}
                  </span>
                </td>
                <td className="action-buttons">
                  <button
                    className="edit-btn"
                    onClick={() => handleEditContract(contract)}
                  >
                    Edit
                  </button>

                  {isAdmin && (
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteContract(contract._id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Contracts