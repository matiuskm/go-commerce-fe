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
        <>
            <header className="bg-blue-700 text-white px-6 py-3 shadow">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold">GoCommerce</Link>
                    <nav className="flex items-center gap-6">
                        {user?.role === "admin" && (
                            <div className="relative group">
                                <button className="hover:underline">Admin Dashboard</button>
                                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-md invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all z-50">
                                    <Link to="/admin/orders" className="block px-4 py-2 hover:bg-gray-100">Orders</Link>
                                    <Link to="/admin/products" className="block px-4 py-2 hover:bg-gray-100">Products</Link>
                                    <Link to="/admin/users" className="block px-4 py-2 hover:bg-gray-100">Users</Link>
                                </div>
                            </div>
                        )}
                        {!user ? (
                            <div className="space-x-4">
                                <Link to="/login" className="hover:underline">Login</Link>
                                <Link to="/register" className="hover:underline">Register</Link>
                            </div>
                        ) : (
                            <>
                                <div className="relative group">
                                    <button className="hover:underline">{user.name}</button>
                                    <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-md invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all z-50">
                                        <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">My Profile</Link>
                                        <Link to="/my/orders" className="block px-4 py-2 hover:bg-gray-100">My Orders</Link>
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                                    </div>
                                </div>
                                <Link to="/cart" className="hover:text-gray-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437m0 0L6.75 12.75m0 0h10.5m-10.5 0L5.106 5.272m12.144 7.478L18.75 6H6.75m12 6.75a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-9 1.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                    </svg>
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>
            <footer className="bg-gray-100 text-center text-gray-600 text-sm py-4">
                &copy; {new Date().getFullYear()} Arunika Digital
            </footer>
        </>
    )
}

export default Header