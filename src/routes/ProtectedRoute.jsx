import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext)
    if (user === null) {
        return <div className="p-6">Loading...</div>
    }
    return user?.token ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute