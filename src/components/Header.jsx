import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

function Header() {
    const { user, logout } = useContext(AuthContext)
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    return (
        <header className="bg-blue-700 text-white shadow">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
                <Link to="/" className="text-2xl font-bold">GoCommerce</Link>

                {/* desktop nav */}
                <nav className="hidden md:flex items-center space-x-6">
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
                        <>
                            <Link to="/login" className="hover:underline">Login</Link>
                            <Link to="/register" className="hover:underline">Register</Link>
                        </>
                    ) : (
                        <>
                            <div className="relative group">
                                <button className="hover:underline">{user.name}</button>
                                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-md invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all z-50">
                                    <Link to="/my/profile" className="block px-4 py-2 hover:bg-gray-100">My Profile</Link>
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

                {/* mobile burger button */}
                <button
                    onClick={() => setOpen(o => !o)}
                    className="md:hidden focus:outline-none"
                >
                    {open
                        ? <XMarkIcon className="w-6 h-6" />
                        : <Bars3Icon className="w-6 h-6" />
                    }
                </button>
            </div>

            {/* mobile menu */}
            {open && (
                <nav className="md:hidden bg-blue-600 px-4 pb-4 space-y-2">
                    {user?.role === "admin" && (
                        <>
                            <Link to="/admin/orders" className="block px-2 py-2 hover:bg-blue-500 rounded">Admin Orders</Link>
                            <Link to="/admin/products" className="block px-2 py-2 hover:bg-blue-500 rounded">Admin Products</Link>
                            <Link to="/admin/users" className="block px-2 py-2 hover:bg-blue-500 rounded">Admin Users</Link>
                        </>
                    )}

                    {!user ? (
                        <>
                            <Link to="/login" className="block px-2 py-2 hover:bg-blue-500 rounded">Login</Link>
                            <Link to="/register" className="block px-2 py-2 hover:bg-blue-500 rounded">Register</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/my/profile" className="block px-2 py-2 hover:bg-blue-500 rounded">My Profile</Link>
                            <Link to="/my/orders" className="block px-2 py-2 hover:bg-blue-500 rounded">My Orders</Link>
                            <button onClick={handleLogout} className="w-full text-left px-2 py-2 hover:bg-blue-500 rounded">Logout</button>
                            <Link to="/cart" className="block px-2 py-2 hover:bg-blue-500 rounded flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437m0 0L6.75 12.75m0 0h10.5m-10.5 0L5.106 5.272m12.144 7.478L18.75 6H6.75m12 6.75a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-9 1.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                </svg>
                                Cart
                            </Link>
                        </>
                    )}
                </nav>
            )}
        </header>
    )
}

export default Header