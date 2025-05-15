import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import BASE_URL from "../api/config";

function AdminProductsPage() {
    const { user } = useContext(AuthContext)
    const [products, setProducts] = useState([])

    const fetchProducts = () => {
        fetch(`${BASE_URL}/admin/products`, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        })
            .then(res => res.json())
            .then(data => setProducts(data.products || []))
            .catch(err => console.error("Failed to fetch products:", err))
    }

    useEffect(() => {
        fetchProducts()
    }, [user])

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this product?")) return
        try {
            await fetch(`${BASE_URL}/admin/products/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${user.token}` }
            })
            fetchProducts()
        } catch (err) {
            console.error("Failed to delete product:", err)
        }
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Admin: Products</h1>
                <Link
                    to="/admin/products/new"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    + New Product
                </Link>
            </div>
            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <table className="w-full border mt-4">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-3 py-2 text-left">Name</th>
                            <th className="px-3 py-2 text-left">Price</th>
                            <th className="px-3 py-2 text-left">Stock</th>
                            <th className="px-3 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.ID} className="border-t">
                                <td className="px-3 py-2">{product.name}</td>
                                <td className="px-3 py-2">Rp {Number(product.price).toLocaleString()}</td>
                                <td className="px-3 py-2">{product.stock}</td>
                                <td className="px-3 py-2 space-x-2">
                                    <Link
                                        to={`/admin/products/${product.ID}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product.ID)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default AdminProductsPage