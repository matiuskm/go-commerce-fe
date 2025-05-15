import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import BASE_URL from "../api/config";

function Cart() {
    const { user } = useContext(AuthContext)
    const [items, setItems] = useState([])
    const [total, setTotal] = useState(0)

    const calculateTotal = (cartItems) => {
        return cartItems.reduce((sum, item) => sum + (item.product?.price || item.price || 0) * (item.Qty || item.quantity || 1), 0)
    }

    const fetchCart = () => {
        fetch(`${BASE_URL}/my/cart`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
            .then(res => res.json())
            .then(data => {
                const fetchedItems = data.cart?.items || []
                setItems(fetchedItems)
                setTotal(calculateTotal(fetchedItems))
            })
            .catch(err => console.error("Failed to fetch cart:", err))
    }

    useEffect(() => {
        if (user) {
            fetchCart()
        } else {
            const guestCart = JSON.parse(localStorage.getItem("items") || "[]")
            setItems(guestCart)
            setTotal(calculateTotal(guestCart))
        }
    }, [user])

    const syncCartToBackend = async (updatedItems) => {
        const payload = {
            items: updatedItems.map(item => ({
                productId: item.product?.id || item.productId,
                quantity: item.quantity || 1
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
        } catch (err) {
            console.error("Failed to sync cart", err)
        }
    }

    const handleRemove = (productId) => {
        const updated = items.filter(item => (item.product?.id || item.ProductID) !== productId)
        setItems(updated)
        setTotal(calculateTotal(updated))
        syncCartToBackend(updated)
    }

    const handleQtyChange = (productId, newQty) => {
        const updated = items.map(item => {
            const id = item.product?.id || item.ProductID
            if (id === productId) {
                return { ...item, quantity: newQty }
            }
            return item
        }).filter(item => (item.quantity || 1) > 0)

        setItems(updated)
        setTotal(calculateTotal(updated))
        syncCartToBackend(updated)
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">My Cart</h1>
            {items.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="space-y-4">
                    {items.map((item, i) => {
                        const qty = Number(item.quantity ?? item.Qty ?? 1)
                        const productId = item.ProductID ?? item.product?.id
                        return (
                            <div key={i} className="border p-4 rounded shadow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-lg font-semibold">{item.product?.name || `Product #${item.ProductID}`}</h2>
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => handleQtyChange(productId, qty - 1)}
                                                className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                            >
                                                -
                                            </button>
                                            <span className="px-3 font-medium">{qty}</span>
                                            <button
                                                onClick={() => handleQtyChange(productId, qty + 1)}
                                                className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <p className="text-green-600 font-bold">
                                            Rp {(item.product?.price || item.price || 0).toLocaleString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(item.product?.id || item.ProductID)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                    <div className="text-right mt-4">
                        <p className="text-xl font-semibold">Total: Rp {total.toLocaleString()}</p>
                        <Link
                            to="/checkout"
                            className="inline-block mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Cart