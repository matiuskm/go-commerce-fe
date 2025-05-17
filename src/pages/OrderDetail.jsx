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
      <span className={`uppercase inline-block text-sm px-3 py-1 rounded mb-2 font-medium
  ${order.status === "pending" ? "bg-gray-300 text-gray-800" :
          order.status === "paid" ? "bg-yellow-200 text-yellow-800" :
            order.status === "shipped" ? "bg-blue-200 text-blue-800" :
              order.status === "delivered" ? "bg-green-200 text-green-800" :
                order.status === "canceled" ? "bg-red-200 text-red-800" : ""}`
      }>
        {order.status}
      </span>
      <p className="text-gray-700 mb-4">Created: {formatDate(order.createdAt)}</p>

      <h2 className="text-lg font-semibold mb-2">Items:</h2>
      <ul className="space-y-2">
        {order.items.map((item, idx) => {
          console.log('item: ', item)
          const subtotal = item.product.price * item.quantity
          return (
            <li key={idx} className="flex gap-4 border p-4 rounded shadow">
              {item.product?.image_url && (
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded"
                />
              )}

              <div className="flex-1">
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                <p className="text-sm text-green-600">
                  Price: Rp {item.product.price.toLocaleString()}
                </p>
                <div className="flex justify-between mt-2">
                  <span className="text-sm font-semibold text-gray-700">Subtotal</span>
                  <span className="text-sm font-semibold">
                    Rp {(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      <h2 className="text-lg font-semibold mt-4 mb-2">Total:</h2>
      <p className="font-medium">Total: Rp {Number(order.total).toLocaleString()}</p>
    </div>
  )
}

export default OrderDetailPage;
