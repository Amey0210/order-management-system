import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getOrderStatus } from '../../services/api'; // Ensure this is imported
import MenuDisplay from './MenuDisplay';
import CheckoutForm from '../cart/CheckoutForm';
import { 
  ShoppingCart, 
  UtensilsCrossed, 
  Trash2, 
  Plus, 
  Minus, 
  ExternalLink, 
  History 
} from 'lucide-react';

const MenuPage = () => {
  const { cart, cartTotal, removeFromCart, updateQuantity, cartCount } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [recentOrderId, setRecentOrderId] = useState(null);
  const navigate = useNavigate();

  // Load and validate the most recent order from localStorage
  useEffect(() => {
    const validateRecentOrder = async () => {
      const savedId = localStorage.getItem('latestOrderId');
      if (!savedId) {
        setRecentOrderId(null);
        return;
      }

      try {
        // VALIDATION LOGIC: Check if the order is still "In Progress"
        const res = await getOrderStatus(savedId);
        
        if (res.data.status === 'Delivered') {
          // If delivered, we no longer need the "Live" shortcut
          localStorage.removeItem('latestOrderId');
          setRecentOrderId(null);
        } else {
          setRecentOrderId(savedId);
        }
      } catch (err) {
        // If order not found (expired/deleted), clear local storage
        console.error("Invalid or expired order ID found in storage");
        localStorage.removeItem('latestOrderId');
        setRecentOrderId(null);
      }
    };

    validateRecentOrder();
    
    // Sync across tabs if user orders in another window
    window.addEventListener('storage', validateRecentOrder);
    return () => window.removeEventListener('storage', validateRecentOrder);
  }, []);

  const handleOrderSuccess = (orderId) => {
    localStorage.setItem('latestOrderId', orderId);
    setRecentOrderId(orderId);
    navigate(`/track/${orderId}`);
  };

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Left Side: Menu Items Section */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-8">
            <UtensilsCrossed className="text-orange-500 w-8 h-8" />
            <h2 className="text-4xl font-extrabold text-gray-900">Our Menu</h2>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <MenuDisplay />
          </div>
        </div>

        {/* Right Side: Sticky Sidebar */}
        <div className="w-full lg:w-[450px]">
          <div className="sticky top-8 space-y-6">
            
            {/* FEATURE: PERSISTENT TRACKING BUTTON (Hides on 'Delivered') */}
            {recentOrderId && (
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-5 rounded-2xl shadow-lg shadow-orange-100 animate-in zoom-in duration-300">
                <div className="flex items-center gap-3 mb-3 text-white">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <History size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black opacity-80">Order in Progress</p>
                    <p className="text-sm font-bold">Track your live delivery</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/track/${recentOrderId}`)}
                  className="w-full bg-white text-orange-600 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-orange-50 transition-all shadow-sm active:scale-95"
                >
                  View Live Status <ExternalLink size={16} />
                </button>
              </div>
            )}

            {/* CART CONTAINER */}
            <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="text-orange-500 w-6 h-6" />
                  <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
                </div>
                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-bold">
                  {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
                </span>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-xl">
                  <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <ShoppingCart className="text-gray-300 w-8 h-8" />
                  </div>
                  <p className="text-gray-400 italic text-sm px-4">Your cart is empty. Time to add some delicious treats!</p>
                </div>
              ) : (
                <>
                  <ul className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map(item => (
                      <li key={item._id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 group transition-all hover:border-orange-200">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800 text-lg leading-tight">{item.name}</span>
                            <span className="text-orange-600 font-semibold">₹{item.price.toLocaleString('en-IN')} each</span>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item._id)}
                            className="text-gray-300 hover:text-red-500 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
                            <button 
                              onClick={() => updateQuantity(item._id, -1)} 
                              className="p-1.5 hover:bg-orange-50 rounded text-gray-400 hover:text-orange-500 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-4 font-black text-gray-700 text-sm">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item._id, 1)} 
                              className="p-1.5 hover:bg-orange-50 rounded text-gray-400 hover:text-orange-500 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="font-black text-gray-900">
                            {/* Updated to local currency symbol */}
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-dashed border-gray-200 pt-5 mb-8">
                    <div className="flex justify-between font-black text-3xl text-gray-900 tracking-tight">
                      <span>Total:</span>
                      <span className="text-orange-500">₹{cartTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {!showCheckout ? (
                    <button 
                      onClick={() => setShowCheckout(true)}
                      className="w-full bg-orange-500 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-orange-100 hover:bg-orange-600 hover:-translate-y-1 transition-all active:scale-95"
                    >
                      Checkout Now
                    </button>
                  ) : (
                    <div className="mt-4 animate-in fade-in slide-in-from-right-4 duration-300">
                      <button 
                        onClick={() => setShowCheckout(false)}
                        className="text-gray-400 font-bold text-xs mb-5 hover:text-orange-500 flex items-center gap-1 group transition-colors"
                      >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Cart
                      </button>
                      <CheckoutForm onOrderSuccess={handleOrderSuccess} />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;