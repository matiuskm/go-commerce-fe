// src/pages/OrderDetailPage.jsx
import { useEffect, useState, useContext } from "react"
import { useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import BASE_URL from "../api/config"
import toast from "react-hot-toast"

function OrderDetailPage() {
  const { user } = useContext(AuthContext)
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${BASE_URL}/my/orders/${id}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => {
        setOrder(data.order)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch order detail:", err)
        toast.error("Failed to fetch order detail. Please try again.")
        setLoading(false)
      })
  }, [user, id])

  if (!order) return <div className="p-6">Loading order details...</div>

  const formatDate = (d) =>
    d ? new Date(d.replace(" ", "T")).toLocaleString() : "-"

  const statusClasses = {
    pending: "bg-gray-300 text-gray-800",
    paid: "bg-yellow-200 text-yellow-800",
    shipped: "bg-blue-200 text-blue-800",
    delivered: "bg-green-200 text-green-800",
    canceled: "bg-red-200 text-red-800"
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header: Order Info + Shipping Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Info */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Order #{order.orderNum}</h1>
          <span
            className={`uppercase inline-block text-sm px-3 py-1 rounded font-medium ${statusClasses[order.status] || ""
              }`}
          >
            {order.status}
          </span>
          <p className="text-gray-600 text-sm">
            Created: {formatDate(order.createdAt)}
          </p>
        </div>

        {/* Shipping Address */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
          <p className="font-medium">{order.address?.label}</p>
          <p className="text-sm">{order.address?.recipientName}</p>
          <p className="text-sm">{order.address?.phone}</p>
          <p className="text-sm">{order.address?.street}</p>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {order.items.map((item, idx) => {
          const subtotal = item.product.price * item.quantity
          return (
            <div
              key={idx}
              className="flex flex-col sm:flex-row gap-4 border p-4 rounded-lg shadow-sm"
            >
              {item.product.image_url && (
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="w-full sm:w-32 h-32 object-cover rounded-lg"
                />
              )}
              <div className="flex-1 space-y-1">
                <p className="font-medium text-lg">{item.product.name}</p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {item.product.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <span className="text-sm">Qty: {item.quantity}</span>
                  <span className="text-sm text-green-600">
                    Price: Rp {item.product.price.toLocaleString()}
                  </span>
                  <span className="ml-auto font-semibold">
                    Subtotal: Rp {subtotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Order Total */}
      <div className="text-right">
        <p className="text-xl font-semibold">
          Total: Rp {order.total.toLocaleString()}
        </p>
      </div>
    </div>
  )
}

export default OrderDetailPage;
