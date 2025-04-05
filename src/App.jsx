import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Pages/Home";
import Commandes from "./Pages/Commandes";
import CreateOrderPage from "./Pages/CreateOrderPage";
import LoginPage from "./Pages/LoginPage";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "sonner";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/Commandes" element={<Commandes />} />
          <Route path="/Commandes/creer" element={<CreateOrderPage />} />
        </Route>
      </Routes>
      <Toaster/>

    </AuthProvider>
  );
}

export default App;
