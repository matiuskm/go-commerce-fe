import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api/config";

function CheckoutPage() {
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleCheckout = async () => {
        try {
            const res = await fetch(`${BASE_URL}/checkout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
            })
            const data = await res.json()
            console.log("Checkout successful:", data)
            alert(`Checkout successful! Your order number is: ${data.order}`)
            navigate("/my/orders")
        } catch (err) {
            console.log("Failed to checkout:", err)
            alert("Failed to checkout. Please try again.")
        }
    }

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Checkout</h1>
            <p className="mb-4">Ready to place your order?</p>
            <button onClick={handleCheckout} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Confirm & Checkout
            </button>
        </div>
    )
}

export default CheckoutPage