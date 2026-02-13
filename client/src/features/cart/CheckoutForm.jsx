import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { placeOrder } from '../../services/api';
import { Trash2, Plus, Minus, ShoppingCart, User, MapPin, Phone, CreditCard } from 'lucide-react';

const CheckoutForm = ({ onOrderSuccess }) => {
  const { cart, cartTotal, clearCart, updateQuantity, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState({ name: '', address: '', phone: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Your cart is empty!");

    setLoading(true);
    try {
      // 1. Data Cleaning for Backend Validation (Zod)
      const cleanedItems = cart.map(item => ({
        name: item.name,
        quantity: Number(item.quantity),
        price: Number(item.price)
      }));

      const orderData = {
        customerName: customer.name,
        address: customer.address,
        phone: String(customer.phone).trim(),
        items: cleanedItems,
        totalPrice: Number(cartTotal)
      };

      // 2. Submit to Backend
      const res = await placeOrder(orderData);
      const newOrderId = res.data._id;

      // 3. PERSISTENCE LOGIC (Fixes the "Blank Screen" and "Missing History" issues)
      
      // Update the full history array (for the Order History page)
      const history = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      if (!history.includes(newOrderId)) {
        const updatedHistory = [newOrderId, ...history];
        localStorage.setItem('orderHistory', JSON.stringify(updatedHistory));
      }

      // Update the legacy "myOrders" key (just in case your History page uses it)
      const legacyHistory = JSON.parse(localStorage.getItem('myOrders') || '[]');
      localStorage.setItem('myOrders', JSON.stringify([newOrderId, ...legacyHistory]));

      // Set the latest ID for the "Active Tracking" sidebar button
      localStorage.setItem('latestOrderId', newOrderId);

      // 4. Clean up and Navigate
      clearCart();
      onOrderSuccess(newOrderId); // Redirects to OrderStatus page

    } catch (err) {
      console.error("Submission Error:", err.response?.data);
      const errorMsg = err.response?.data?.message || "Validation failed.";
      alert(`${errorMsg} Please check your phone number and address.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-8 animate-in fade-in slide-in-from-right-4 duration-300">
      
      {/* SECTION 1: HEADER & REVIEW */}
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="text-orange-500" size={22} />
          <h2 className="text-xl font-bold text-gray-800">Review Order</h2>
        </div>
        <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
          {cart.length} {cart.length === 1 ? 'Type' : 'Types'}
        </span>
      </div>

      {/* SECTION 2: SCROLLABLE ITEM LIST */}
      <div className="max-h-64 overflow-y-auto mb-6 pr-2 custom-scrollbar">
        {cart.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl">
            <p className="text-gray-400 italic">Cart is empty.</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item._id} className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-xl border border-transparent hover:border-orange-100 transition-all shadow-sm">
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-base leading-tight">{item.name}</p>
                
                <div className="flex items-center gap-3 mt-3">
                  <button 
                    type="button"
                    onClick={() => updateQuantity(item._id, -1)}
                    className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-orange-50 hover:text-orange-500 transition-all active:scale-90"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-black text-gray-700 w-4 text-center">{item.quantity}</span>
                  <button 
                    type="button"
                    onClick={() => updateQuantity(item._id, 1)}
                    className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-orange-50 hover:text-orange-500 transition-all active:scale-90"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 ml-4">
                <span className="font-bold text-gray-900 text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                <button 
                  type="button"
                  onClick={() => removeFromCart(item._id)}
                  className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* SECTION 3: PRICE SUMMARY */}
      <div className="bg-gray-900 p-5 rounded-2xl mb-8 shadow-inner relative overflow-hidden">
        <div className="flex justify-between items-center text-white relative z-10">
          <div className="flex flex-col">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total to Pay</span>
            <span className="text-3xl font-black">₹{cartTotal.toFixed(0)}</span>
          </div>
          <CreditCard className="text-gray-700 absolute -right-4 -bottom-4 w-20 h-20 rotate-12" />
        </div>
      </div>

      {/* SECTION 4: DELIVERY FORM */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={16} className="text-gray-400" />
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Delivery Details</h3>
        </div>
        
        <div className="grid gap-4">
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Your Full Name"
              required
              className="w-full pl-10 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all text-sm"
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Complete Delivery Address"
              required
              className="w-full pl-10 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all text-sm"
              onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="tel"
              placeholder="Phone (e.g. 9876543210)"
              required
              pattern="[0-9]{10,}"
              className="w-full pl-10 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all text-sm"
              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
            />
          </div>
        </div>
        
        {/* SECTION 5: SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading || cart.length === 0}
          className="w-full group flex items-center justify-center gap-3 py-4 mt-4 bg-orange-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-100 hover:bg-orange-600 active:scale-[0.97] transition-all disabled:bg-gray-200 disabled:shadow-none"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Placing Order...</span>
            </div>
          ) : (
            <>
              <span>Place Order Now</span>
              <CreditCard size={20} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;