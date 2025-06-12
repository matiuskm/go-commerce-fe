import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import Header from "./components/Header";
import Cart from "./pages/Cart";
import CheckoutPage from "./pages/Checkout";
import MyOrdersPage from "./pages/MyOrders";
import OrderDetailPage from "./pages/OrderDetail";
import AdminRoute from "./components/AdminRoute";
import AdminOrdersPage from "./pages/AdminOrders";
import AdminOrderDetailPage from "./pages/AdminOrderDetail";
import AdminProductsPage from "./pages/AdminProducts";
import AdminProductForm from "./pages/AdminProductForm";
import Footer from "./components/Footer";
import ProductDetail from "./pages/ProductDetail";
import AdminUserListPage from "./pages/AdminUserList";
import AdminUserDetailPage from "./pages/AdminUserDetail";
import MyProfilePage from "./pages/MyProfile";
import PaymentSuccessPage from "./pages/PaymentSuccess";
import PaymentFailurePage from "./pages/PaymentFailed";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/products/:id' element={<ProductDetail />} />

            <Route path='/cart' element={<Cart />} />
            <Route path='/my/orders' element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
            <Route path='/my/orders/:id' element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
            <Route path='/checkout' element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path='/my/profile' element={<ProtectedRoute><MyProfilePage /></ProtectedRoute>} />
            
            <Route path='/payment-success' element={<ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>} />
            <Route path='/payment-failed' element={<ProtectedRoute><PaymentFailurePage /></ProtectedRoute>} />

            <Route path="/admin/users" element={<AdminRoute><AdminUserListPage /></AdminRoute>} />
            <Route path="/admin/users/:id" element={<AdminRoute><AdminUserDetailPage /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
            <Route path="/admin/orders/:id" element={<AdminRoute><AdminOrderDetailPage /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
            <Route path="/admin/products/new" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
            <Route path="/admin/products/:id" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
          </Routes>
        </main>
        <Footer />
    </div>
  )
}

export default App;