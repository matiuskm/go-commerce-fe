import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function ProductList() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useContext(AuthContext)

    useEffect(() => {
        fetch("http://localhost:8080/products")
        .then(res => res.json())
        .then(data => {
            setProducts(data.products || [])
            setLoading(false)
        })
        .catch(err => {
            console.log("Failed to fetch product:", err)
            setLoading(false)
        })
    }, [])

    const handleAddToCart = async (productId) => {
        if (!user) {
            // ⛔ Guest → LocalStorage
            const existing = JSON.parse(localStorage.getItem('items') || "[]")
            const updated = [...existing]
            const index = updated.findIndex(item => item.productId === productId)

            if (index !== -1) {
                updated[index].quantity += 1
            } else {
                updated.push({ productId, quantity: 1 })
            }

            localStorage.setItem('items', JSON.stringify(updated))
            alert("Product added to cart")
        } else {
            // ✅ Logged-in → API
            const payload = {
                items: [{productId, quantity: 1}],
            }

            try {
                await fetch("http://localhost:8080/my/cart", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user.token}`
                    },
                    body: JSON.stringify(payload)
                })
                alert("Product added to cart")
            } catch (err) {
                console.error("Failed to add product to cart:", err)
                alert("Failed to add product to cart")
            }
        }
    }

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="p-4 border rounded shadow animate-pulse space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
            {products.map(product => (
                <div key={product.ID} className="border p-3 rounded shadow">
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                    <p className="text-sm text-gray-600">{product.description}</p>
                    <p className="font-bold text-green-600">Rp {Number(product.price).toLocaleString()}</p>
                    <button onClick={() => handleAddToCart(product.ID)} className="mt-3 w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700">
                        Add to Cart
                    </button>
                </div>
            ))}
        </div>
    )
}

export default ProductList