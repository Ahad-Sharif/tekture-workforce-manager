import { useState } from "react"

function Contracts({ contracts, setContracts }) {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingIndex, setEditingIndex] = useState(null)

  const [newContract, setNewContract] = useState({
    workerName: "",
    company: "",
    startDate: "",
    endDate: "",
    status: "Active"
  })

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
    setEditingIndex(null)
    setShowForm(false)
  }

  const handleSaveContract = () => {
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

    if (editingIndex !== null) {
      const updatedContracts = [...contracts]
      updatedContracts[editingIndex] = contractToSave
      setContracts(updatedContracts)
    } else {
      setContracts([...contracts, contractToSave])
    }

    resetForm()
  }

  const handleEditContract = (indexToEdit) => {
    const contract = contracts[indexToEdit]

    setNewContract({
      workerName: contract.workerName,
      company: contract.company,
      startDate: contract.startDate,
      endDate: contract.endDate,
      status: contract.status
    })

    setEditingIndex(indexToEdit)
    setShowForm(true)
  }

  const handleDeleteContract = (indexToDelete) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this contract?")

    if (!confirmDelete) {
      return
    }

    const updatedContracts = contracts.filter(
      (contract, index) => index !== indexToDelete
    )
    setContracts(updatedContracts)
  }

  const filteredContracts = contracts
    .map((contract, index) => ({ ...contract, originalIndex: index }))
    .filter((contract) =>
      contract.workerName.toLowerCase().startsWith(searchTerm.trim().toLowerCase())
    )

  return (
    <div className="page-section">
      <div className="page-header">
        <div>
          <h1>Contracts</h1>
          <p>Manage all workforce contracts in Tekture.</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => {
            setEditingIndex(null)
            setNewContract({
              workerName: "",
              company: "",
              startDate: "",
              endDate: "",
              status: "Active"
            })
            setShowForm(true)
          }}
        >
          Add Contract
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2 className="form-title">
            {editingIndex !== null ? "Edit Contract" : "Add New Contract"}
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
              {editingIndex !== null ? "Update Contract" : "Save Contract"}
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
              <tr key={contract.originalIndex}>
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
                    onClick={() => handleEditContract(contract.originalIndex)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteContract(contract.originalIndex)}
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

export default Contracts