import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate, useParams } from "react-router-dom"
import BASE_URL from "../api/config"

function AdminProductForm() {
    const { user } = useContext(AuthContext)
    const { id } = useParams()
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState('')
    const [stock, setStock] = useState(0)

    useEffect(() => {
        if (id) {
            fetch(`${BASE_URL}/admin/products/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            })
                .then(res => res.json())
                .then(data => {
                    const product = data.product
                    setName(product.name)
                    setPrice(product.price)
                    setDescription(product.description)
                    setStock(product.stock)
                })
                .catch(err => console.error('Failed to fetch product detail', err))
        }
    }, [id, user])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const method = id ? 'PATCH' : 'POST'
        const url = id ? `/admin/products/${id}` : '/admin/products'

        try {
            await fetch(`${BASE_URL}${url}`, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ name, price, description, stock })
            })
            navigate('/admin/products')
        } catch (err) {
            console.error('Failed to save product', err)
        }
    }

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">{id ? "Edit Product" : "New Product"}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Stock</label>
                    <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(Number(e.target.value))}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {id ? "Update" : "Create"}
                </button>
            </form>
        </div>
    )
}


export default AdminProductForm;