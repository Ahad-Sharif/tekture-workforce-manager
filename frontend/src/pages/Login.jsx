import { useState } from "react"
import { API_BASE_URL } from "../api"

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    const trimmedEmail = formData.email.trim()
    const trimmedPassword = formData.password.trim()

    if (trimmedEmail === "" || trimmedPassword === "") {
      alert("Please enter both email and password")
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword
        })
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || "Login failed")
        return
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      if (data.user.role === "admin") {
        window.location.href = "/"
      } else {
        window.location.href = "/employee"
      }

    } catch (error) {
      console.error("Login error:", error)
      alert("Something went wrong during login")
    }
  }

  return (
    <div className="login-page">

      <div className="login-card">

        <img
          src="/psfm-logo.gif"
          alt="PSFM Logo"
          className="login-brand-gif"
        />

        <h1>Tekture</h1>

        <h2 style={{ color: "#596579", marginBottom: "20px" }}>
          Workforce Management Made Easy
        </h2>

        <p style={{ marginBottom: "25px" }}>
          Sign in to continue
        </p>

        <form onSubmit={handleLogin} className="login-form">

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit" className="primary-btn">
            Login
          </button>

        </form>

      </div>

    </div>
  )
}

export default Login