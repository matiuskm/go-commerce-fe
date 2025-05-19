import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import BASE_URL from "../api/config";
import toast from "react-hot-toast";

function ProductDetail() {
    const { id } = useParams()
    const { user } = useContext(AuthContext)
    const [product, setProduct] = useState(null)
    const [qty, setQty] = useState(1)

    useEffect(() => {
        fetch(`${BASE_URL}/products/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data.product))
            .catch(err => console.error("Failed to fetch product", err))
    }, [id])

    const handleAddToCart = () => {
        console.log("product", product)
        const item = { productId: product.ID, quantity: qty }
        if (user) {
            fetch(`${BASE_URL}/my/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify({ items: [item] })
            })
                .then(res => res.json())
                .then(() => toast.success('Item added to cart'))
        } else {
            const existing = JSON.parse(localStorage.getItem("items") || "[]")

            if (!item?.productId) {
                console.warn("Invalid product, cannot add to guest cart")
                return
            }

            const prev = existing.find(i => i.productId === item.productId)
            const mergedQty = prev ? prev.quantity + item.quantity : item.quantity

            const updated = [
                ...existing.filter(i => i.productId !== item.productId),
                { productId: item.productId, quantity: mergedQty }
            ]

            localStorage.setItem("items", JSON.stringify(updated))
            toast.success("Item added to cart")
        }
    }

    if (!product) return <div className="p-6">Loading...</div>

    return (
        <div className="max-w-5xl mx-auto p-6">
            {/* Back link */}
            <Link to="/" className="text-blue-600 hover:underline block mb-6">
                &larr; Back to Home
            </Link>

            {/* Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Image */}
                <div className="relative">
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className={`w-full h-auto max-h-[500px] object-contain rounded-3xl ${product.stock <= 0 ? "grayscale brightness-80" : ""}`}
                    />
                    {product.stock <= 0 && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded shadow">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Info panel */}
                <div className="p-6 border rounded shadow">
                    <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
                    <p className="text-gray-700 mb-4">{product.description}</p>
                    <p className="text-xl text-green-700 font-bold mb-4">
                        Rp {product.price.toLocaleString()}
                    </p>
                    {product.stock === 0 ? (
                        <p className="text-red-600 font-medium mb-4">Out of stock</p>
                    ) : (
                        <>
                            <div className="flex items-center gap-3 mb-4">
                                <button
                                    onClick={() => setQty(Math.max(1, qty - 1))}
                                    className="px-3 py-1 bg-gray-300 rounded"
                                >
                                    -
                                </button>
                                <span className="font-medium">{qty}</span>
                                <button
                                    onClick={() => setQty(qty + 1)}
                                    className="px-3 py-1 bg-gray-300 rounded"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                disabled={!product}
                                onClick={handleAddToCart}
                                className={`px-5 py-2 rounded text-white ${product ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                                    }`}
                            >
                                Add to Cart
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductDetail