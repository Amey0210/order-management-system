import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MenuPage from './features/menu/MenuPage';
import OrderStatus from './features/orders/OrderStatus';
// MISSING IMPORT FIXED BELOW:
import OrderHistory from './features/orders/OrderHistory'; 

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* The Header stays visible across all navigation changes */}
      <Header /> 
      
      <main>
        <Routes>
          {/* Main Menu Page */}
          <Route path="/" element={<MenuPage />} />
          
          {/* Order History Page (Total Orders) */}
          <Route path="/orders" element={<OrderHistory />} />
          
          {/* Real-time Order Tracking Page */}
          <Route path="/track/:orderId" element={<OrderStatus />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;