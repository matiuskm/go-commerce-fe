import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import BASE_URL from "../api/config";
import toast from "react-hot-toast";

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
                const raw = data.cart?.items || []
                setItems(raw)
                setTotal(calculateTotal(raw))
            })
            .catch(err => console.error("Failed to fetch cart:", err))
    }

    useEffect(() => {
        if (user) {
            console.log("User cart")
            fetchCart()
        } else {
            console.log("Guest cart")
            const guestCart = JSON.parse(localStorage.getItem("items") || "[]")
            Promise.all(
                guestCart.map(async (item) => {
                  const res = await fetch(`${BASE_URL}/products/${item.productId}`)
                  const data = await res.json()
                  return {
                    product: data.product,
                    quantity: item.quantity,
                  }
                })
              ).then((fullCart) => {
                setItems(fullCart)
                setTotal(calculateTotal(fullCart))
              })
              .catch((err) => console.error("Failed to fetch cart:", err))
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
            toast.error("Failed to update cart")
        }
    }

    const handleRemove = (productId) => {
        const updated = items.filter(item => (item.product?.id || item.productId) !== productId)
        setItems(updated)
        setTotal(calculateTotal(updated))
        syncCartToBackend(updated)
        toast.success("Product removed from cart!")
    }

    const handleQtyChange = (productId, newQty) => {
        if (newQty <= 0) {
            handleRemove(productId)
            return
        }

        const updated = items.map(item => {
            const id = item.product?.id || item.productId
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
                        const productId = item.productId ?? item.product?.id
                        return (
                            <div key={i} className="flex gap-4 border p-4 rounded shadow">
                                {item.product?.image_url && (
                                    <img
                                        src={item.product.image_url}
                                        alt={item.product?.name}
                                        className="w-24 h-24 object-cover rounded"
                                    />
                                )}

                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-lg font-semibold">
                                                {item.product?.name || `Product #${item.productId}`}
                                            </h2>
                                            <p className="text-green-600 font-bold mt-1">
                                                Rp {(item.product?.price || item.price || 0).toLocaleString()}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => handleRemove(item.product?.id || item.productId)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 mt-3">
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
                                </div>
                            </div>
                        )
                    })}
                    <div className="text-right mt-4">
                        <p className="text-xl font-semibold">Total: Rp {total.toLocaleString()}</p>
                        {user ? (
                            <Link to="/checkout" className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                                Proceed to Checkout
                            </Link>
                        ) : (
                            <p className="text-center text-sm text-red-600 font-medium">
                                Silakan <Link to="/login" className="underline text-blue-600">login</Link> atau{" "}
                                <Link to="/register" className="underline text-blue-600">register</Link> untuk melanjutkan checkout.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Cart