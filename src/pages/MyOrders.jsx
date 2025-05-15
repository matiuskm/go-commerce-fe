// src/pages/MyOrdersPage.jsx
import { useEffect, useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Link } from "react-router-dom"

function MyOrdersPage() {
  const { user } = useContext(AuthContext)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetch("http://localhost:8080/my/orders", {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => setOrders(data.orders || []))
      .catch(err => console.error("Failed to fetch orders:", err))
  }, [user])

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    return new Date(dateString.replace(" ", "T")).toLocaleString()
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="border p-4 rounded shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Order #{order.orderNum}</p>
                  <p className="text-sm text-gray-600">Status: {order.status}</p>
                  <p className="text-sm text-gray-600">Created: {formatDate(order.createdAt)}</p>
                </div>
                <Link to={`/my/orders/${order.id}`} className="text-blue-600 hover:underline">Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyOrdersPage;
