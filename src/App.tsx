import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AssetsPage from './pages/AssetsPage';
import HomePage from './pages/HomePage';
import UsersPage from './pages/UsersPage';
import OrdersPage from './pages/OrdersPage';
import InventoryPage from './pages/InventoryPage';
import LoginPage from './components/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated } = useAuth();
  const version = "1.0.2"; // Incrémentez cette version selon vos mises à jour

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        } />
        <Route path="/assets" element={
          <PrivateRoute>
            <AssetsPage />
          </PrivateRoute>
        } />
        <Route path="/users" element={
          <PrivateRoute>
            <UsersPage />
          </PrivateRoute>
        } />
        <Route path="/orders" element={
          <PrivateRoute>
            <OrdersPage />
          </PrivateRoute>
        } />
        <Route path="/inventory" element={
          <PrivateRoute>
            <InventoryPage />
          </PrivateRoute>
        } />
      </Routes>
      {isAuthenticated && (
        <div className="fixed bottom-4 left-4 text-xs text-gray-500 dark:text-gray-400">
          Version {version}
        </div>
      )}
    </div>
  );
}

export default App;