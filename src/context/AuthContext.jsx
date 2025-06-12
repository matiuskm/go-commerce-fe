import { createContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import { useLocation } from "react-router-dom";

export const AuthContext = createContext()

function AuthProvider({ children }) {
    const [user, setUser] = useState(undefined)

    const location = useLocation()
    
    useEffect(() => {
        const savedUser = localStorage.getItem("user")
        if (savedUser) {
            const parsed = JSON.parse(savedUser)
            const isValid = checkTokenValidity(parsed.token)
            if (isValid) {
                setUser(parsed)
            } else {
                localStorage.clear()
                setUser(null)
            }
        } else {
            setUser(null)
        }
    }, [location.pathname])

    const checkTokenValidity = (token) => {
        try {
            const decoded = jwtDecode(token)
            const now = Date.now() / 1000
            return decoded.exp >= now
        } catch {
            return false
        }
    }

    useEffect(() => {
        checkTokenValidity()
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            setUser(JSON.parse(savedUser))
        }
    }, [])

    const login = (userData) => {
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {user === undefined ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    )
}

export default AuthProvider