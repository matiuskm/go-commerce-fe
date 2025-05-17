// src/pages/AdminOrderDetailPage.jsx
import { useEffect, useState, useContext } from "react"
import { useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import BASE_URL from "../api/config"
import toast from "react-hot-toast"

function AdminOrderDetailPage() {
  const { user } = useContext(AuthContext)
  const { id } = useParams()

  const [order, setOrder] = useState(null)
  const [status, setStatus] = useState("")
  const [placing, setPlacing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${BASE_URL}/admin/orders/${id}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => {
        setOrder(data.order)
        setStatus(data.order.status)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch admin order detail:", err)
        toast.error("Failed to fetch admin order detail. Please try again.")
        setLoading(false)
      })
  }, [user, id])

  const formatDate = d =>
    d ? new Date(d.replace(" ", "T")).toLocaleString() : "-"

  const statusClasses = {
    pending: "bg-gray-300 text-gray-800",
    paid: "bg-yellow-200 text-yellow-800",
    shipped: "bg-blue-200 text-blue-800",
    delivered: "bg-green-200 text-green-800",
    canceled: "bg-red-200 text-red-800"
  }

  const handleStatusChange = async () => {
    setPlacing(true)
    try {
      await fetch(`${BASE_URL}/admin/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ status })
      })
      toast.success("Order status updated!")
      setOrder(o => ({ ...o, status }))
    } catch (err) {
      toast.error("Failed to update order status", err)
    } finally {
      setPlacing(false)
    }
  }

  if (loading) {
    return <div className="p-6">Loading order details…</div>
  }
  if (!order) return <div className="p-6">Loading order details...</div>

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Title */}
      <h1 className="text-2xl font-bold">Admin: Order #{order.orderNum}</h1>

      {/* Header Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order & Status */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span
              className={`uppercase inline-block text-sm px-3 py-1 rounded font-medium ${statusClasses[order.status] || ""
                }`}
            >
              {order.status}
            </span>
            <span className="text-gray-600 text-sm">
              Created: {formatDate(order.createdAt)}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Update Status
            </label>
            <div className="flex space-x-2">
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="flex-1 border rounded px-3 py-2"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="canceled">Canceled</option>
              </select>
              <button
                onClick={handleStatusChange}
                disabled={placing}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {placing ? "Updating…" : "Update"}
              </button>
            </div>
          </div>
        </div>

        {/* User Info & Shipping Address */}
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">User Info</h2>
            <p className="text-sm">
              <span className="font-medium">Name:</span> {order.user.name}
            </p>
            <p className="text-sm">
              <span className="font-medium">Email:</span> {order.user.email}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
            <p className="text-sm">
              <span className="font-medium">Label:</span> {order.address.label}
            </p>
            <p className="text-sm">
              <span className="font-medium">Recipient:</span> {order.address.recipientName}
            </p>
            <p className="text-sm">
              <span className="font-medium">Phone:</span> {order.address.phone}
            </p>
            <p className="text-sm">
              <span className="font-medium">Street:</span> {order.address.street}
            </p>
            {/* Extend if more address fields */}
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Items</h2>
        <div className="space-y-3">
          {order.items.map((item, idx) => {
            const subtotal = item.quantity * item.product.price
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
      </div>

      {/* Order Total */}
      <div className="text-right">
        <p className="text-2xl font-semibold">
          Total: Rp {order.total.toLocaleString()}
        </p>
      </div>
    </div>
  )
}

export default AdminOrderDetailPage;
