// src/pages/MyProfilePage.jsx
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import BASE_URL from "../api/config"
import toast from "react-hot-toast"

export default function MyProfilePage() {
  const { user, setUser } = useContext(AuthContext)
  const [form, setForm] = useState({ name: "", email: "", username: "" })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${BASE_URL}/my/profile`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(res => res.json())
      .then(data => {
        setForm({ name: data.name, email: data.email, username: data.username })
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        toast.error("Gagal memuat profil")
        setLoading(false)
      })
  }, [user.token])

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await fetch(`${BASE_URL}/my/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Update gagal")
      toast.success("Profil berhasil diperbarui")
      // update context so header etc. show new name/email
      setUser(prev => ({ ...prev, name: form.name, email: form.email }))
    } catch (err) {
      console.error(err)
      toast.error(err.message || "Gagal update profil")
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-md">
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
            readOnly
            disabled
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
