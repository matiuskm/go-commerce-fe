// src/pages/AdminOrderDetailPage.jsx
import { useEffect, useState, useContext } from "react"
import { useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import BASE_URL from "../api/config"

function AdminOrderDetailPage() {
  const { user } = useContext(AuthContext)
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [status, setStatus] = useState("")

  useEffect(() => {
    fetch(`${BASE_URL}/admin/orders/${id}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => {
        setOrder(data.order)
        setStatus(data.order.status)
      })
      .catch(err => console.error("Failed to fetch admin order detail:", err))
  }, [user, id])

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    return new Date(dateString.replace(" ", "T")).toLocaleString()
  }

  const handleStatusChange = async () => {
    try {
      await fetch(`${BASE_URL}/admin/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ status })
      })
      alert("Order status updated!")
    } catch (err) {
      console.error("Failed to update order status", err)
    }
  }

  if (!order) return <div className="p-6">Loading order details...</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin: Order #{order.orderNum}</h1>
      <p className="text-gray-700 mb-1">User: {order.user?.name}</p>
      <p className="text-gray-700 mb-1">Created: {formatDate(order.createdAt)}</p>
      <p className="text-gray-700 mb-4">Current Status: <span className="font-semibold">{order.status}</span></p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="canceled">Canceled</option>
        </select>
        <button
          onClick={handleStatusChange}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Status
        </button>
      </div>

      <h2 className="text-lg font-semibold mb-2">Items:</h2>
      <ul className="space-y-2">
        {order.items.map((item, idx) => {
          const subtotal = item.quantity * item.product.price
          return (
            <li key={idx} className="border p-3 rounded">
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              <p className="text-sm text-green-600">Price: Rp {item.product.price.toLocaleString()}</p>
              <div className="flex justify-between mt-2">
                <p className="text-sm font-semibold">Subtotal</p>
                <p className="text-sm font-semibold">Rp {subtotal.toLocaleString()}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default AdminOrderDetailPage;
