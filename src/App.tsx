/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { NotificationProvider } from './context/NotificationContext';

// Lazy load components for better performance
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Subscriptions = lazy(() => import('./pages/Subscriptions'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const OwnerDashboard = lazy(() => import('./pages/OwnerDashboard'));

// Placeholders for layout components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

function AppContent() {
  const { currentUser } = useStore();

  return (
    <div className="flex flex-col min-h-screen bg-gris text-secondary overflow-x-hidden">
      <Header isAuthenticated={!!currentUser} role={currentUser?.role || null} />
      
      <main className="flex-grow">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            
            {/* Protected Routes */}
            <Route 
              path="/admin/*" 
              element={currentUser?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/dashboard/*" 
              element={currentUser?.role === 'owner' ? <OwnerDashboard /> : <Navigate to="/login" />} 
            />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <NotificationProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </NotificationProvider>
    </StoreProvider>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}

