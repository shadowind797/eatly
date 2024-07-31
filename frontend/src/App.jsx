import react from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import Home from "./pages/Home.jsx"
import SearchFood from "./pages/SearchFood.jsx"
import NotFound from "./pages/404.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Cart from "./pages/Cart.jsx";
import Forbidden from "./pages/403.jsx";

function Logout() {
  localStorage.clear()
  return <Navigate to="/login/" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route
              path="menu/"
              element={
                  <ProtectedRoute>
                      <SearchFood />
                  </ProtectedRoute>
              }
          />
          <Route
              path="cart/"
              element={
                  <ProtectedRoute>
                      <Cart />
                  </ProtectedRoute>
              }
          />
          <Route
              path="/"
              element={
                  <ProtectedRoute>
                      <Home />
                  </ProtectedRoute>
              }
          />
        <Route path="login/" element={<Login />} />
        <Route path="register/" element={<RegisterAndLogout />} />
        <Route path="logout/" element={<Logout />} />
        <Route path="/banned" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
