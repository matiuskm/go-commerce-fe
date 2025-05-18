// src/components/ProductList.jsx
import { useEffect, useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import BASE_URL from "../api/config"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"

function ProductList() {
    const CART_KEY = "items"
    const { user } = useContext(AuthContext)
    const [products, setProducts] = useState([])
    const [cart, setCart] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const fetchProducts = async () => {
        setLoading(true)
        setError(false)
        try {
            const res = await fetch(`${BASE_URL}/products`)
            const data = await res.json()
            setProducts(data.products || [])
        } catch (err) {
            console.error("Failed to fetch products:", err)
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    useEffect(() => {
        if (user) {
            fetch(`${BASE_URL}/my/cart`, {
                headers: { Authorization: `Bearer ${user.token}` }
            })
                .then(res => res.json())
                .then(data => {
                    const raw = data.cart?.items || []
                    const normalized = raw.map(item => {
                        return {
                            productId: Number(item.product?.id),
                            quantity: item.quantity
                        }
                    })
                    setCart(normalized)
                })
                .catch(err => console.error("Failed to fetch cart:", err))
        } else {
            const guestCart = JSON.parse(localStorage.getItem(CART_KEY) || "[]")
            setCart(guestCart)
        }
    }, [user])

    const updateCart = async (newCart) => {
        setCart(newCart)
        if (user) {
            const payload = {
                items: newCart.map(item => ({
                    productId: Number(item.productId),
                    quantity: item.quantity
                }))
            }
            try {
                await fetch(`${BASE_URL}/my/cart`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    },
                    body: JSON.stringify(payload)
                })
                toast.success("Product added to cart!")
            } catch (err) {
                toast.error("Failed to add product to cart")
                console.error("Failed to sync cart", err)
            }
        } else {
            localStorage.setItem(CART_KEY, JSON.stringify(newCart))
            toast.success("Product added to cart!")
        }
    }

    const handleQtyChange = (productId, newQty) => {
        const updated = cart.map(item =>
            Number(item.productId) === Number(productId) ? { ...item, quantity: newQty } : item
        )
            .filter(item => item.quantity > 0)

        if (!updated.find(item => Number(item.productId) === Number(productId)) && newQty > 0) {
            updated.push({ productId: Number(productId), quantity: newQty })
        }

        updateCart(updated)
    }

    const getQty = (productId) => {
        return cart.find(item => Number(item.productId) === Number(productId))?.quantity || 0
    }

    if (loading) {
        return (
            <div className="p-6 text-center">
                <p className="text-lg font-semibold mb-2">Loading katalog…</p>
                <p className="text-sm text-gray-600 mb-4">
                    Kalau katalog belum keluar, coba lagi setelah 1–3 menit
                </p>
                <button
                    onClick={fetchProducts}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Muat Ulang
                </button>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-6 text-center text-red-600">
                <p className="mb-4">Gagal memuat katalog produk.</p>
                <button
                    onClick={fetchProducts}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Coba Lagi
                </button>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
            {products.map(product => {
                const qty = getQty(product.ID)
                return (
                    <div key={product.ID} className="border p-4 rounded shadow">
                        <Link to={`/products/${product.ID}`}>
                            <img
                                src={product.image_url ? `${product.image_url}` : "https://placehold.co/500x500"}
                                alt={product.name}
                                className="w-full h-40 object-cover rounded-xl mb-2"
                            />
                            <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                        </Link>
                        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                        <p className="font-bold text-green-600 mt-1">Rp {Number(product.price).toLocaleString()}</p>

                        <div className="mt-4 flex items-center gap-2">
                            {qty > 0 ? (
                                <>
                                    <button onClick={() => handleQtyChange(product.ID, qty - 1)} className="px-2 py-1 bg-gray-300 rounded">-</button>
                                    <span className="px-2">{qty}</span>
                                    <button onClick={() => handleQtyChange(product.ID, qty + 1)} className="px-2 py-1 bg-gray-300 rounded">+</button>
                                </>
                            ) : (
                                <button
                                    onClick={() => handleQtyChange(product.ID, 1)}
                                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                >
                                    Add to Cart
                                </button>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default ProductList;
