import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext()

function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user")
        return stored ? JSON.parse(stored) : null
    })

    const checkTokenValidity = () => {
        const token = localStorage.getItem('token');
        if (!token) return false;
        try {
            const decoded = jwt_decode(token);
            const now = Date.now() / 1000;
            if (decoded.exp < now) {
                setUser(null);
                localStorage.clear(); // bersihin token & user
                window.location.href = "/login"; // redirect paksa ke login
                return false;
            }
            return true;
        } catch (err) {
            setUser(null);
            localStorage.clear();
            window.location.href = "/login";
            return false;
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
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider