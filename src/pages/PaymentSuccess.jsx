// src/pages/PaymentSuccessPage.jsx
import { useContext, useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import BASE_URL from "../api/config"
import toast from "react-hot-toast"

export default function PaymentSuccessPage() {
  const { user } = useContext(AuthContext)
  const [searchParams] = useSearchParams()
  const orderNum = searchParams.get("external_id")
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !orderNum) return
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${BASE_URL}/my/orders`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        const data = await res.json()
        // find by orderNum
        const found = (data.orders || []).find(o => o.orderNum === orderNum)
        if (found) {
          setOrder(found)
        } else {
          toast.error("Order not found")
        }
      } catch (err) {
        console.error(err)
        toast.error("Gagal memuat order")
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [user, orderNum])

  if (loading) {
    return <div className="p-6 text-center">Loading your order…</div>
  }
  if (!order) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Order not found.</p>
        <Link to="/" className="underline text-blue-600">Back to Home</Link>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4 text-center">
      <h1 className="text-2xl font-bold">🎉 Payment Successful!</h1>
      <p>Your payment for order <strong>{order.orderNum}</strong> has been received.</p>
      <p className="text-green-600 font-semibold">Status: {order.status.toUpperCase()}</p>
      <Link
        to={`/my/orders/${order.id}`}
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        View Order Details
      </Link>
    </div>
  )
}
