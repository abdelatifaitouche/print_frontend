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
import CompaniesPage from "./Pages/CRM/CompaniesPage";
import CreateCompany from "./Pages/CRM/CreateCompany";
import UsersPageList from "./Pages/Users/UsersPageList";
import CompanyDetailPage from "./Pages/CRM/CompanyDetailPage";
import CreateUserPage from "./Pages/Users/CreateUserPage";
import EditUserPage from "./Pages/Users/EditUserPage";
import UserDetailPage from "./Pages/Users/UserDetailPage";
import DriveListPage from "./Pages/Drive/DriveListPage";
import DriveFolderDetailPage from "./Pages/Drive/DriveFolderDetail";
import ProductsPage from "./Pages/Products/productPage";
import RawMaterialsPage from "./Pages/Stock/stockPage";
import RawMaterialDetailPage from "./Pages/Stock/rawMaterialDetailPage";
import RawMaterialCreatePage from "./Pages/Stock/rawMaterialCreatePage";
import ProductDetailPage from "./Pages/Products/productDetailPage";
import ProductCreatePage from "./Pages/Products/productCreatePage";

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
          <Route
            path="/companies"
            element={
              <PrivateRoute>
                <CompaniesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/companies/create"
            element={
              <PrivateRoute>
                <CreateCompany />
              </PrivateRoute>
            }
          />
          <Route
            path="/companies/companyDetails/:id"
            element={
              <PrivateRoute>
                <CompanyDetailPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/users"
            element={
              <PrivateRoute>
                <UsersPageList />
              </PrivateRoute>
            }
          />

          <Route
            path="/users/create"
            element={
              <PrivateRoute>
                <CreateUserPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/users/:id"
            element={
              <PrivateRoute>
                <UserDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/users/edit/:id"
            element={
              <PrivateRoute>
                <EditUserPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/drive"
            element={
              <PrivateRoute>
                <DriveListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/drive/:folderId"
            element={
              <PrivateRoute>
                <DriveFolderDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/products"
            element={
              <PrivateRoute>
                <ProductsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <PrivateRoute>
                <ProductDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/products/new"
            element={
              <PrivateRoute>
                <ProductCreatePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/stock"
            element={
              <PrivateRoute>
                <RawMaterialsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/stock/:id"
            element={
              <PrivateRoute>
                <RawMaterialDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/stock/create"
            element={
              <PrivateRoute>
                <RawMaterialCreatePage />
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
