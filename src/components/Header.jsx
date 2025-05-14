import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Header() {
    const { user, logout } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    return (
        <header className="bg-blue-700 text-white px-6 py-3 shadow">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold">GoCommerce</Link>
                <nav>
                    {!user ? (
                        <div className="space-x-4">
                            <Link to="/login" className="hover:underline">Login</Link>
                            <Link to="/register" className="hover:underline">Register</Link>
                        </div>
                    ) : (
                        <div className="relative group">
                            <button className="hover:underline">{user.name}</button>
                            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-50">
                                <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">My Profile</Link>
                                <Link to="/cart" className="block px-4 py-2 hover:bg-gray-100">My Cart</Link>
                                <Link to="/my/orders" className="block px-4 py-2 hover:bg-gray-100">My Orders</Link>
                                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                            </div>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Header