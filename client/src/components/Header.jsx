import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Utensils, History } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { cartCount } = useCart();
  const location = useLocation();

  // Helper to highlight active links
  const isActive = (path) => location.pathname === path ? 'text-orange-500' : 'text-gray-600';

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* Branding */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-orange-500 p-2 rounded-lg group-hover:bg-orange-600 transition-all duration-200 shadow-lg shadow-orange-100">
            <Utensils className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black text-gray-900 tracking-tight">
            Flash<span className="text-orange-500">Feast</span>
          </span>
        </Link>

        {/* Cleaned Navigation Links */}
        <nav className="flex items-center gap-8 text-sm font-bold">
          <Link 
            to="/" 
            className={`${isActive('/')} hover:text-orange-500 transition-colors flex items-center gap-1.5`}
          >
            Menu
          </Link>
          <Link 
            to="/orders" 
            className={`${isActive('/orders')} hover:text-orange-500 transition-colors flex items-center gap-1.5`}
          >
            
            Orders
          </Link>
        </nav>

        {/* Cart Action Section */}
        <div className="flex items-center gap-4">
          <Link to="/" className="relative p-2 hover:bg-gray-50 rounded-full transition-colors cursor-pointer group">
            <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-orange-500 transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;