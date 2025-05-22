import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api/config";
import toast from "react-hot-toast";

const ADMIN_FEE = {
    VA: 4440,
    QRIS: 0.007
}

function CheckoutPage() {
    const [addresses, setAddresses] = useState([])
    const [selectedAddress, setSelectedAddress] = useState(null)
    const [showNew, setShowNew] = useState(false)
    const [newAddress, setNewAddress] = useState({
        label: "",
        street: "",
        phone: "",
        recipientName: "",
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [placing, setPlacing] = useState(false)
    const { user } = useContext(AuthContext)
    const [paymentMethod, setPaymentMethod] = useState("VA")
    const [cartItems, setCartItems] = useState([]);

    const subtotal = cartItems.reduce((sum, item) =>
        sum + (item.product?.price || item.price || 0) * (item.Qty || item.quantity || 1), 0
    );

    const adminFee = paymentMethod === "QRIS"
    ? Math.ceil(subtotal * ADMIN_FEE.QRIS)
    : ADMIN_FEE.VA;

    const total = subtotal + adminFee;

    const fetchCart = () => {
        fetch(`${BASE_URL}/my/cart`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
            .then(res => res.json())
            .then(data => setCartItems(data.cart?.items || []))
            .catch(err => console.error("Failed to fetch cart:", err))
    }

    // load existing addresses
    useEffect(() => {
        fetchCart()
        fetch(`${BASE_URL}/my/addresses`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
            .then(res => res.json())
            .then(data => {
                setAddresses(data.addresses || [])
                if (data.addresses?.length) {
                    setSelectedAddress(data.addresses[0])
                }
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                toast.error("Gagal memuat alamat")
                setLoading(false)
            })
    }, [user])

    const handleAddrChange = e => {
        const { name, value } = e.target
        setNewAddress(a => ({ ...a, [name]: value }))
    }

    // save new address
    const handleSaveAddress = async e => {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await fetch(`${BASE_URL}/my/addresses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify(newAddress)
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Save failed")
            setAddresses(a => [...a, data.address])
            setSelectedAddress(data.address)
            setShowNew(false)
            toast.success("Alamat baru tersimpan")
            // reset form
            setNewAddress({
                label: "",
                recipientName: "",
                phone: "",
                street: "",
            })
        } catch (err) {
            console.error(err)
            toast.error(err.message || "Gagal menyimpan alamat")
        } finally {
            setSaving(false)
        }
    }

    const handleCheckout = async () => {
        if (!selectedAddress) {
            toast.error("Pilih atau buat alamat kirim terlebih dulu")
            return
        }
        setPlacing(true)
        try {
            const res = await fetch(`${BASE_URL}/checkout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify({ 
                    addressId: selectedAddress.id,
                    paymentMethod
                })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Checkout gagal")
            const { paymentUrl } = data
            // full‐page redirect to Xendit’s checkout
            window.location.href = paymentUrl

            toast.success(`Checkout successful! Your order number is: ${data.order}`)
        } catch (err) {
            console.log("Failed to checkout:", err)
            toast.error("Failed to checkout. Please try again.")
        } finally {
            setPlacing(false)
        }
    }

    if (loading) return <div className="p-6">Loading addresses…</div>

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Checkout</h1>
            {/* Address selector */}
            <section className="border rounded-lg p-4">
                <h2 className="text-lg font-medium mb-2">Shipping Address</h2>

                {addresses.map(addr => (
                    <label
                        key={addr.id}
                        className="flex items-start space-x-3 mb-2 cursor-pointer"
                    >
                        <input
                            type="radio"
                            name="address"
                            value={addr.id}
                            checked={selectedAddress.id === addr.id}
                            onChange={() => setSelectedAddress(addr)}
                            className="mt-1"
                        />
                        <div>
                            <p className="font-semibold">{addr.label}</p>
                            <p className="text-sm">{addr.recipientName} • {addr.phone}</p>
                            <p className="text-sm">{addr.street}</p>
                        </div>
                    </label>
                ))}

                {/* toggle new address form */}
                <button
                    onClick={() => setShowNew(v => !v)}
                    className="text-blue-600 hover:underline text-sm mb-4"
                >
                    {showNew ? "‹ Batal Tambah Alamat" : "+ Tambah Alamat Baru"}
                </button>

                {showNew && (
                    <form onSubmit={handleSaveAddress} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                                name="label"
                                value={newAddress.label}
                                onChange={handleAddrChange}
                                placeholder="Label (Rumah/Kantor)"
                                required
                                className="border rounded px-3 py-2"
                            />
                            <input
                                name="recipientName"
                                value={newAddress.recipientName}
                                onChange={handleAddrChange}
                                placeholder="Nama Penerima"
                                required
                                className="border rounded px-3 py-2"
                            />
                            <input
                                name="phone"
                                value={newAddress.phone}
                                onChange={handleAddrChange}
                                placeholder="No. HP"
                                required
                                className="border rounded px-3 py-2"
                            />
                            <input
                                name="street"
                                value={newAddress.street}
                                onChange={handleAddrChange}
                                placeholder="Jalan / RT-RW"
                                className="border rounded px-3 py-2"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={saving}
                            className={`mt-2 bg-blue-600 text-white px-4 py-2 rounded ${saving ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
                        >
                            {saving ? "Menyimpan..." : "Simpan Alamat"}
                        </button>
                    </form>
                )}
            </section>

            {/* Payment Method Selector */}
            <section className="border rounded-lg p-4 mb-4">
                <h2 className="text-lg font-medium mb-2">Metode Pembayaran</h2>
                <div className="flex flex-col space-y-2">
                    <label className={`flex items-center cursor-pointer rounded-lg border px-3 py-2 ${paymentMethod === "VA" ? "border-green-600 bg-green-50" : "border-gray-300"}`}>
                        <input
                            type="radio"
                            name="payment"
                            value="VA"
                            checked={paymentMethod === "VA"}
                            onChange={() => setPaymentMethod("VA")}
                            className="mr-2 accent-green-600"
                        />
                        <div>
                            <span className="font-semibold">Virtual Account</span>
                        </div>
                    </label>
                    <label className={`flex items-center cursor-pointer rounded-lg border px-3 py-2 ${paymentMethod === "QRIS" ? "border-green-600 bg-green-50" : "border-gray-300"}`}>
                        <input
                            type="radio"
                            name="payment"
                            value="QRIS"
                            checked={paymentMethod === "QRIS"}
                            onChange={() => setPaymentMethod("QRIS")}
                            className="mr-2 accent-green-600"
                        />
                        <div>
                            <span className="font-semibold">QRIS</span>
                        </div>
                    </label>
                </div>
            </section>

            {/* ORDER SUMMARY */}
            <section className="border rounded-lg p-4">
                <h2 className="text-lg font-medium mb-2">Ringkasan Pesanan</h2>
                <div className="space-y-1">
                    <div className="flex justify-between">
                        <span>Total Harga Produk</span>
                        <span>Rp {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>
                            Admin Fee
                            <span title="Biaya admin tergantung metode pembayaran" className="ml-1 cursor-pointer text-gray-400">ℹ️</span>
                        </span>
                        <span>Rp {adminFee.toLocaleString()}</span>
                    </div>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                    <span>Total Tagihan</span>
                    <span>Rp {total.toLocaleString()}</span>
                </div>

                <button
                    onClick={handleCheckout}
                    disabled={placing}
                    className={`mt-4 w-full bg-green-600 text-white px-4 py-2 rounded ${placing ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"}`}
                >
                    {placing ? "Memproses..." : "Bayar Sekarang"}
                </button>
            </section>
        </div>
    )
}

export default CheckoutPage