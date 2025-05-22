import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import BASE_URL from "../api/config"
import toast from "react-hot-toast"
import axios from "../api/axios"

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { login } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(`/auth/login`, { username, password })
            const { token } = res.data
            const decoded = parseJwt(token)
            login({token, ...decoded})
            syncCartToBackend(token)
            navigate('/')
        } catch (err) {
            toast.error("Invalid username or password")
            console.error(err)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Login</h2>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mb-4 p-2 border rounded" />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mb-6 p-2 border rounded" />
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-4">Login</button>
                <p>Belum punya akun? Bikin akun dulu <Link to={"/register"} className="text-blue-600 hover:underline">disini</Link></p>
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

export default Login