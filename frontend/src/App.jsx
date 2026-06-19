// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import EquipmentList from './pages/Equipment/List';
import EquipmentDetails from './pages/Equipment/Details';
import RentalCreate from './pages/Rental/Create';
import RentalCheckout from './pages/Rental/Checkout';
import OrderSuccess from './pages/Rental/OrderSuccess';
import RentalHistory from './pages/Rental/History';
import Profile from './pages/Profile';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminEquipment from './pages/Admin/Equipment';
import AddEquipment from './pages/Admin/AddEquipment';
import EditEquipment from './pages/Admin/EditEquipment';
import AdminOrders from './pages/Admin/Orders';
import NotFound from './pages/NotFound';

// Protected Routes
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminRoute from './components/layout/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-neutral-50 flex flex-col">
          <Header />

          <main className="flex-grow pt-16">
            <AnimatePresence mode="wait">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/equipment" element={<EquipmentList />} />
                <Route path="/equipment/:id" element={<EquipmentDetails />} />

                {/* Rental routes */}
                <Route path="/rental/create" element={<RentalCreate />} />
                <Route path="/rental/checkout" element={<RentalCheckout />} />
                <Route path="/order-success" element={<OrderSuccess />} />

                {/* Protected routes */}
                <Route
                  path="/rental/history"
                  element={
                    <ProtectedRoute>
                      <RentalHistory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Admin routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route path="/admin/login" element={<AdminLogin />} />

                <Route
                  path="/admin/equipment"
                  element={
                    <AdminRoute>
                      <AdminEquipment />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/equipment/add"
                  element={
                    <AdminRoute>
                      <AddEquipment />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/equipment/edit/:id"
                  element={
                    <AdminRoute>
                      <EditEquipment />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <AdminRoute>
                      <AdminOrders />
                    </AdminRoute>
                  }
                />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;