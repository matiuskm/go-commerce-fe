// src/pages/AdminUserListPage.jsx
import { useEffect, useState, useContext } from "react"
import { Link } from "react-router-dom"
import BASE_URL from "../api/config"
import { AuthContext } from "../context/AuthContext"
import toast from "react-hot-toast"

export default function AdminUserListPage() {
  const { user } = useContext(AuthContext)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data.users || [])
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch users", err)
        toast.error("Gagal memuat daftar user")
        setLoading(false)
      })
  }, [user])

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus user ini?")) return
    try {
      const res = await fetch(`${BASE_URL}/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      })
      if (!res.ok) throw new Error()
      setUsers(prev => prev.filter(u => u.id !== id))
      toast.success("User berhasil dihapus")
    } catch {
      console.error("Delete failed")
      toast.error("Gagal menghapus user")
    }
  }

  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await fetch(`${BASE_URL}/admin/users/${id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ role: newRole }),
      })
      if (!res.ok) throw new Error()
      setUsers(prev =>
        prev.map(u => (u.id === id ? { ...u, role: newRole } : u))
      )
      toast.success("Role berhasil diupdate")
    } catch {
      console.error("Role update failed")
      toast.error("Gagal update role")
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin: Manage Users</h1>
        <Link
          to="/admin/users/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New User
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">Username</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Role</th>
              <th className="py-2 px-4">Created At</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{u.username}</td>
                <td className="py-2 px-4">{u.name}</td>
                <td className="py-2 px-4">{u.email}</td>
                <td className="py-2 px-4">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="py-2 px-4 text-sm text-gray-600">
                  {new Date(u.createdAt).toLocaleString()}
                </td>
                <td className="py-2 px-4 space-x-2">
                  <Link
                    to={`/admin/users/${u.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="text-red-600 hover:underline text-sm"
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
