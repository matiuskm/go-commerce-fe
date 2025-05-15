// src/pages/OrderDetailPage.jsx
import { useEffect, useState, useContext } from "react"
import { useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import BASE_URL from "../api/config"

function OrderDetailPage() {
  const { user } = useContext(AuthContext)
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    fetch(`${BASE_URL}/my/orders/${id}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => setOrder(data.order))
      .catch(err => console.error("Failed to fetch order detail:", err))
  }, [user, id])

  if (!order) return <div className="p-6">Loading order details...</div>

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    return new Date(dateString.replace(" ", "T")).toLocaleString()
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Order #{order.orderNum}</h1>
      <p className="text-gray-700 mb-2">Status: {order.status}</p>
      <p className="text-gray-700 mb-4">Created: {formatDate(order.createdAt)}</p>

      <h2 className="text-lg font-semibold mb-2">Items:</h2>
      <ul className="space-y-2">
        {order.items.map((item, idx) => {
          const subtotal = item.product.price * item.quantity
          return (
          <li key={idx} className="border p-3 rounded">
            <p className="font-medium">{item.product.name}</p>
            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
            <p className="text-sm text-green-600">Price: Rp {Number(item.product.price).toLocaleString()}</p>
            <div className="flex justify-between mt-2">
                <p className="text-sm font-semibold">Subtotal</p>
                <p className="text-sm font-semibold">Rp {subtotal.toLocaleString()}</p>
            </div>
          </li>
        )})}
      </ul>
      <h2 className="text-lg font-semibold mt-4 mb-2">Total:</h2>
      <p className="font-medium">Total: Rp {Number(order.total).toLocaleString()}</p>
    </div>
  )
}

export default OrderDetailPage;
