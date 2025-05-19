// src/pages/PaymentFailurePage.jsx
import { Link } from "react-router-dom"

export default function PaymentFailurePage() {
  return (
    <div className="max-w-md mx-auto p-6 space-y-4 text-center">
      <h1 className="text-2xl font-bold text-red-600">❌ Payment Failed</h1>
      <p>Sorry, we couldn’t process your payment. Please try again.</p>
      <Link
        to="/checkout"
        className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Retry Checkout
      </Link>
      <Link to="/" className="block text-gray-600 hover:underline mt-4">
        Back to Home
      </Link>
    </div>
  )
}
