import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import BASE_URL from "../api/config";
import toast from "react-hot-toast";

const Register = () => {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${BASE_URL}/auth/register`, { name, username, email, password })
      const { token } = res.data
      const decoded = parseJwt(token)
      login({token, ...decoded})
      syncCartToBackend(token)
      toast.success('Registration successful!')
      navigate('/dashboard')
    } catch (err) {
      toast.error("Registration failed: " + err.response?.data?.error || err.message)
      console.error(err)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">Register</h2>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full mb-4 p-2 border rounded"/>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full mb-4 p-2 border rounded"/>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full mb-4 p-2 border rounded"/>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full mb-6 p-2 border rounded"/>
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mb-4">Register</button>
        <p>Sudah punya akun? Langsung <Link to={"/login"} className="text-blue-600 hover:underline">login</Link> aja.</p>
      </form>
    </div>
  )
}

function parseJwt(token) {
  const base64 = token.split('.')[1]
  const decoded = atob(base64)
  return JSON.parse(decoded)
}

async function syncCartToBackend(token) {
  const cart = JSON.parse(localStorage.getItem("items") || "[]")

  if (cart.length > 0) {
      await fetch(`${BASE_URL}/my/cart`, {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ items: cart })
      })
      localStorage.removeItem("items") // biar gak dobel
  }
}

export default Register;