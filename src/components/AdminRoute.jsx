import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Navigate } from "react-router-dom"

const AdminRoute = ({children}) => {
    const {user} = useContext(AuthContext)
    if (!user || !user.token) return <Navigate to="/login" replace />
    if (user.role !== "admin") return <Navigate to="/" replace />

    return children
}

export default AdminRoute