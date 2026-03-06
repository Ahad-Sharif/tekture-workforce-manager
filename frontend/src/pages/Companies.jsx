import { useState } from "react"

function Companies({ companies, setCompanies }) {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingIndex, setEditingIndex] = useState(null)

  const [newCompany, setNewCompany] = useState({
    name: "",
    industry: "",
    location: "",
    workersAssigned: ""
  })

  const handleChange = (event) => {
    const { name, value } = event.target

    setNewCompany({
      ...newCompany,
      [name]: value
    })
  }

  const resetForm = () => {
    setNewCompany({
      name: "",
      industry: "",
      location: "",
      workersAssigned: ""
    })
    setEditingIndex(null)
    setShowForm(false)
  }

  const handleSaveCompany = () => {
    const trimmedName = newCompany.name.trim()
    const trimmedIndustry = newCompany.industry.trim()
    const trimmedLocation = newCompany.location.trim()
    const trimmedWorkersAssigned = newCompany.workersAssigned.trim()

    if (
      trimmedName === "" ||
      trimmedIndustry === "" ||
      trimmedLocation === "" ||
      trimmedWorkersAssigned === ""
    ) {
      alert("Please fill all fields properly")
      return
    }

    if (isNaN(trimmedWorkersAssigned)) {
      alert("Workers Assigned must be a number")
      return
    }

    const companyToSave = {
      name: trimmedName,
      industry: trimmedIndustry,
      location: trimmedLocation,
      workersAssigned: trimmedWorkersAssigned
    }

    if (editingIndex !== null) {
      const updatedCompanies = [...companies]
      updatedCompanies[editingIndex] = companyToSave
      setCompanies(updatedCompanies)
    } else {
      setCompanies([...companies, companyToSave])
    }

    resetForm()
  }

  const handleEditCompany = (indexToEdit) => {
    const company = companies[indexToEdit]

    setNewCompany({
      name: company.name,
      industry: company.industry,
      location: company.location,
      workersAssigned: company.workersAssigned
    })

    setEditingIndex(indexToEdit)
    setShowForm(true)
  }

  const handleDeleteCompany = (indexToDelete) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this company?")

    if (!confirmDelete) {
      return
    }

    const updatedCompanies = companies.filter((company, index) => index !== indexToDelete)
    setCompanies(updatedCompanies)
  }

  const filteredCompanies = companies
    .map((company, index) => ({ ...company, originalIndex: index }))
    .filter((company) =>
      company.name.toLowerCase().startsWith(searchTerm.trim().toLowerCase())
    )

  return (
    <div className="page-section">
      <div className="page-header">
        <div>
          <h1>Companies</h1>
          <p>Manage all client companies in Tekture.</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => {
            setEditingIndex(null)
            setNewCompany({
              name: "",
              industry: "",
              location: "",
              workersAssigned: ""
            })
            setShowForm(true)
          }}
        >
          Add Company
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2 className="form-title">
            {editingIndex !== null ? "Edit Company" : "Add New Company"}
          </h2>

          <div className="form-grid">
            <input
              type="text"
              name="name"
              placeholder="Company Name"
              className="form-input"
              value={newCompany.name}
              onChange={handleChange}
            />

            <input
              type="text"
              name="industry"
              placeholder="Industry"
              className="form-input"
              value={newCompany.industry}
              onChange={handleChange}
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              className="form-input"
              value={newCompany.location}
              onChange={handleChange}
            />

            <input
              type="text"
              name="workersAssigned"
              placeholder="Workers Assigned"
              className="form-input"
              value={newCompany.workersAssigned}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button className="primary-btn" onClick={handleSaveCompany}>
              {editingIndex !== null ? "Update Company" : "Save Company"}
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
            placeholder="Search companies by name..."
            className="search-input"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Industry</th>
              <th>Location</th>
              <th>Workers Assigned</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCompanies.map((company) => (
              <tr key={company.originalIndex}>
                <td>{company.name}</td>
                <td>{company.industry}</td>
                <td>{company.location}</td>
                <td>{company.workersAssigned}</td>
                <td className="action-buttons">
                  <button
                    className="edit-btn"
                    onClick={() => handleEditCompany(company.originalIndex)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteCompany(company.originalIndex)}
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

export default Companies