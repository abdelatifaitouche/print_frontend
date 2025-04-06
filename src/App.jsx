import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Pages/Home";
import Commandes from "./Pages/Commandes";
import CreateOrderPage from "./Pages/CreateOrderPage";
import LoginPage from "./Pages/LoginPage";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "sonner";
import PrivateRoute from "./PrivateRoute";
import OrderDetails from "./Pages/OrderDetails";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/Commandes"
            element={
              <PrivateRoute>
                <Commandes />
              </PrivateRoute>
            }
          />
          <Route
            path="/Commandes/creer"
            element={
              <PrivateRoute>
                <CreateOrderPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/Commandes/OrderDetails/:id"
            element={
              <PrivateRoute>
                <OrderDetails />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
