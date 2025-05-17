// src/pages/AdminUserDetailPage.jsx
import { useEffect, useState, useContext } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import BASE_URL from "../api/config"
import { AuthContext } from "../context/AuthContext"
import toast from "react-hot-toast"

export default function AdminUserDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const [form, setForm] = useState({ name: "", email: "", role: "user", username: "" })
  const [originalRole, setOriginalRole] = useState("user")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${BASE_URL}/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch")
        return res.json()
      })
      .then(data => {
        const u = data.user
        setForm({ name: u.name, email: u.email, role: u.role, username: u.username })
        setOriginalRole(u.role)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        toast.error("Gagal memuat data user")
        setLoading(false)
      })
  }, [id, user])

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      // update name & email
      const res1 = await fetch(`${BASE_URL}/admin/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name: form.name, email: form.email }),
      })
      if (!res1.ok) throw new Error("Failed updating user")

      // update role if changed
      if (form.role !== originalRole) {
        const res2 = await fetch(`${BASE_URL}/admin/users/${id}/role`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ role: form.role }),
        })
        if (!res2.ok) throw new Error("Failed updating role")
      }

      toast.success("User berhasil diupdate")
      navigate("/admin/users")
    } catch (err) {
      console.error(err)
      toast.error("Gagal menyimpan perubahan")
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/admin/users" className="text-blue-600 hover:underline mb-4 block">
        &larr; Back to Users
      </Link>

      <h1 className="text-2xl font-bold mb-6">Edit User {form.username}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            name="username"
            value={form.username}
            className="mt-1 block w-full border rounded-md px-3 py-2"
            required
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md px-3 py-2"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}
