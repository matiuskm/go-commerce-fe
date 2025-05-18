// src/components/ProductList.jsx
import { useEffect, useState, useContext, useRef, useCallback } from "react"
import { AuthContext } from "../context/AuthContext"
import BASE_URL from "../api/config"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"

function ProductList() {
  const CART_KEY = "items"
  const { user } = useContext(AuthContext)

  // products + pagination state
  const [products, setProducts]   = useState([])
  const [page, setPage]           = useState(1)
  const [hasMore, setHasMore]     = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [errorProducts, setErrorProducts]     = useState(false)

  // cart state
  const [cart, setCart] = useState([])

  // fetch one page of products
  const loadProducts = useCallback(async () => {
    if (loadingProducts || !hasMore) return

    setLoadingProducts(true)
    setErrorProducts(false)
    try {
      const res  = await fetch(`${BASE_URL}/products?page=${page}&limit=10`)
      const data = await res.json()
      setProducts(prev => {
        // only add items whose id isn't already in prev
        const newOnes = data.products.filter(item => 
          !prev.some(p => p.ID === item.ID)
        )
        return [...prev, ...newOnes]
      })
      setHasMore(data.products.length === 10)
    } catch (err) {
      console.error("Failed to fetch products:", err)
      setErrorProducts(true)
    } finally {
      setLoadingProducts(false)
    }
  }, [page])

  // initial + on-page change
  useEffect(() => {
    loadProducts()
  }, [page])

  // intersection observer: when last item scrolls into view, load next page
  const observer = useRef()
  const lastRef = useCallback(node => {
    if (loadingProducts) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loadingProducts, hasMore])

  // load cart (user or guest)
  useEffect(() => {
    if (user) {
      fetch(`${BASE_URL}/my/cart`, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
        .then(res => res.json())
        .then(data => {
          const raw = data.cart?.items || []
          const normalized = raw.map(item => ({
            productId: Number(item.product?.id),
            quantity: item.quantity
          }))
          setCart(normalized)
        })
        .catch(err => console.error("Failed to fetch cart:", err))
    } else {
      const guestCart = JSON.parse(localStorage.getItem(CART_KEY) || "[]")
      setCart(guestCart)
    }
  }, [user])

  // sync cart (POST for user, localStorage for guest)
  const updateCart = async newCart => {
    setCart(newCart)
    if (user) {
      const payload = { items: newCart.map(i => ({
        productId: Number(i.productId),
        quantity: i.quantity
      })) }
      try {
        await fetch(`${BASE_URL}/my/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify(payload)
        })
        toast.success("Product added to cart!")
      } catch (err) {
        toast.error("Failed to add product to cart")
        console.error(err)
      }
    } else {
      localStorage.setItem(CART_KEY, JSON.stringify(newCart))
      toast.success("Product added to cart!")
    }
  }

  const handleQtyChange = (productId, newQty) => {
    const updated = cart
      .map(item =>
        Number(item.productId) === Number(productId)
          ? { ...item, quantity: newQty }
          : item
      )
      .filter(i => i.quantity > 0)

    if (!updated.find(i => Number(i.productId) === Number(productId)) && newQty > 0) {
      updated.push({ productId: Number(productId), quantity: newQty })
    }

    updateCart(updated)
  }

  const getQty = productId =>
    cart.find(i => Number(i.productId) === Number(productId))?.quantity || 0

  // render loading / error states
  if (errorProducts && products.length === 0) {
    return (
      <div className="p-6 text-center text-red-600">
        <p className="mb-4">Gagal memuat katalog produk.</p>
        <button
          onClick={() => { setPage(1); setProducts([]); setHasMore(true) }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Coba Lagi
        </button>
      </div>
    )
  }

  if (products.length === 0 && loadingProducts) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg font-semibold mb-2">Loading katalog…</p>
        <p className="text-sm text-gray-600 mb-4">
          Kalau katalog belum keluar, coba lagi setelah 1–3 menit
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {products.map((product, idx) => {
          const qty = getQty(product.ID)
          const isLast = idx === products.length - 1

          return (
            <div
              key={product.ID}
              ref={isLast ? lastRef : null}
              className="border p-4 rounded shadow"
            >
              <Link to={`/products/${product.ID}`}>
                <img
                  src={product.image_url || "https://placehold.co/500x500"}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-xl mb-2"
                />
                <h2 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h2>
              </Link>
              <p className="text-sm text-gray-600 line-clamp-2">
                {product.description}
              </p>
              <p className="font-bold text-green-600 mt-1">
                Rp {Number(product.price).toLocaleString()}
              </p>

              <div className="mt-4 flex items-center gap-2">
                {qty > 0 ? (
                  <>
                    <button
                      onClick={() => handleQtyChange(product.ID, qty - 1)}
                      className="px-2 py-1 bg-gray-300 rounded"
                    >
                      -
                    </button>
                    <span className="px-2">{qty}</span>
                    <button
                      onClick={() => handleQtyChange(product.ID, qty + 1)}
                      className="px-2 py-1 bg-gray-300 rounded"
                    >
                      +
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleQtyChange(product.ID, 1)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {loadingProducts && (
        <div className="col-span-full text-center p-6 text-gray-600">
          Loading more…
        </div>
      )}
    </>
  )
}

export default ProductList
