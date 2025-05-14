import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Cart() {
    const { user } = useContext(AuthContext)
    const [items, setItems] = useState([])

    useEffect(() => {
        if (user) {
            fetch("http://localhost:8080/my/cart", {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    setItems(data.cart?.items || [])
                })
                .catch(err => {
                    console.error("Failed to fetch cart:", err)
                })
        } else {
            const existing = JSON.parse(localStorage.getItem('items') || "[]")
            setItems(existing)
        }
    }, [user])

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">My Cart</h1>
            {items.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="space-y-4">
                    {items.map((item, i) => (
                        <div key={i} className="border p-4 rounded shadow">
                            <h2 className="text-lg font-semibold">{item.product?.name || `Product #${item.ProductID}`}</h2>
                            <p className="text-gray-600">Qty: {item.Qty || item.quantity}</p>
                            <p className="text-green-600 font-bold">
                                Rp {(item.product?.price || item.price || 0).toLocaleString()}
                            </p>
                        </div>
                    ))}
                    <div className="mt-6 text-right">
                        <Link
                            to="/checkout"
                            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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