import { useEffect, useState } from "react"
import { API_BASE_URL } from "../api"
import { exportTableToPdf } from "../utils/exportPdf"
import { exportTableToExcel } from "../utils/exportExcel"

function Companies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState(null)

  const [newCompany, setNewCompany] = useState({
    name: "",
    industry: "",
    location: "",
    workersAssigned: ""
  })

  const fetchCompanies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/companies`)
      const data = await response.json()
      setCompanies(data)
    } catch (error) {
      console.error("Failed to fetch companies:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

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
    setEditingId(null)
    setShowForm(false)
  }

  const handleSaveCompany = async () => {
    const trimmedName = newCompany.name.trim()
    const trimmedIndustry = newCompany.industry.trim()
    const trimmedLocation = newCompany.location.trim()
    const trimmedWorkersAssigned = newCompany.workersAssigned.toString().trim()

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
      workersAssigned: Number(trimmedWorkersAssigned)
    }

    try {
      if (editingId) {
        await fetch(`${API_BASE_URL}/api/companies/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(companyToSave)
        })
      } else {
        await fetch(`${API_BASE_URL}/api/companies`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(companyToSave)
        })
      }

      await fetchCompanies()
      resetForm()
    } catch (error) {
      console.error("Failed to save company:", error)
      alert("Failed to save company")
    }
  }

  const handleEditCompany = (company) => {
    setNewCompany({
      name: company.name,
      industry: company.industry,
      location: company.location,
      workersAssigned: company.workersAssigned
    })

    setEditingId(company._id)
    setShowForm(true)
  }

  const handleDeleteCompany = async (companyId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this company?")

    if (!confirmDelete) {
      return
    }

    try {
      await fetch(`${API_BASE_URL}/api/companies/${companyId}`, {
        method: "DELETE"
      })

      await fetchCompanies()
    } catch (error) {
      console.error("Failed to delete company:", error)
      alert("Failed to delete company")
    }
  }

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().startsWith(searchTerm.trim().toLowerCase())
  )

  const handleDownloadPdf = () => {
    const columns = [
      "Company Name",
      "Industry",
      "Location",
      "Workers Assigned"
    ]

    const rows = filteredCompanies.map((company) => [
      company.name,
      company.industry,
      company.location,
      company.workersAssigned
    ])

    exportTableToPdf("Companies Records", columns, rows, "companies-records.pdf")
  }

  const handleDownloadExcel = () => {
    const columns = [
      "Company Name",
      "Industry",
      "Location",
      "Workers Assigned"
    ]

    const rows = filteredCompanies.map((company) => [
      company.name,
      company.industry,
      company.location,
      company.workersAssigned
    ])

    exportTableToExcel("Companies Records", columns, rows, "companies-records.xlsx")
  }

  if (loading) {
    return (
      <div className="page-section">
        <h2>Loading companies...</h2>
      </div>
    )
  }

  return (
    <div className="page-section">
      <div className="page-header">
        <div>
          <h1>Companies</h1>
          <p>Manage all client companies in Tekture.</p>
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
            Add Company
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-card">
          <h2 className="form-title">
            {editingId ? "Edit Company" : "Add New Company"}
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
              type="number"
              name="workersAssigned"
              placeholder="Workers Assigned"
              className="form-input"
              value={newCompany.workersAssigned}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button className="primary-btn" onClick={handleSaveCompany}>
              {editingId ? "Update Company" : "Save Company"}
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
              <tr key={company._id}>
                <td>{company.name}</td>
                <td>{company.industry}</td>
                <td>{company.location}</td>
                <td>{company.workersAssigned}</td>
                <td className="action-buttons">
                  <button
                    className="edit-btn"
                    onClick={() => handleEditCompany(company)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteCompany(company._id)}
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