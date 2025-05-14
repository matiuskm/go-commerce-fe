import { Route, Routes } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import DashboardUser from "./pages/DashboardUser";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<ProtectedRoute><DashboardUser /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  )
}

export default App;