import { Route, Routes } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import DashboardUser from "./pages/DashboardUser";
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

function App() {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        <Route path='/cart' element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path='/my/orders' element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
        <Route path='/my/orders/:id' element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
        <Route path='/checkout' element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path='/dashboard' element={<ProtectedRoute><DashboardUser /></ProtectedRoute>} />

        <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
        <Route path="/admin/orders/:id" element={<AdminRoute><AdminOrderDetailPage /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
        <Route path="/admin/products/new" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
        <Route path="/admin/products/:id" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
      </Routes>
      <Footer />
    </AuthProvider>
  )
}

export default App;