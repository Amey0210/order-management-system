import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrderStatus } from '../../services/api';
import { Package, Calendar, ChevronRight, Trash2, Clock } from 'lucide-react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    const savedIds = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    if (savedIds.length === 0) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      const orderData = await Promise.all(
        savedIds.map(id => getOrderStatus(id).then(res => res.data).catch(() => null))
      );
      setOrders(orderData.filter(order => order !== null));
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // NEW: Delete Functionality
  const handleDeleteOrder = (e, orderId) => {
    e.stopPropagation(); // Prevents navigating to the track page when clicking delete
    
    if (window.confirm("Are you sure you want to remove this order from your history?")) {
      // 1. Update localStorage
      const savedIds = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      const updatedIds = savedIds.filter(id => id !== orderId);
      localStorage.setItem('orderHistory', JSON.stringify(updatedIds));

      // 2. Clear latestOrderId if it was the one deleted
      if (localStorage.getItem('latestOrderId') === orderId) {
        localStorage.removeItem('latestOrderId');
      }

      // 3. Update UI state
      setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
    }
  };

  if (loading) return <div className="text-center py-20 font-bold text-orange-500">Loading your feast history...</div>;

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <Package className="text-orange-500 w-10 h-10" />
          <h1 className="text-4xl font-black text-gray-900">Order History</h1>
        </div>
        <span className="text-gray-400 font-bold text-sm bg-gray-100 px-4 py-2 rounded-full">
          {orders.length} Total
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center shadow-sm border border-gray-100">
          <p className="text-gray-400 text-lg italic">No orders found. Time to place your first one!</p>
          <button onClick={() => navigate('/')} className="mt-6 text-orange-500 font-bold hover:underline">Go to Menu →</button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div 
              key={order._id}
              onClick={() => navigate(`/track/${order._id}`)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {order.status}
                    </span>
                    <span className="text-gray-400 text-xs flex items-center gap-1 font-bold">
                      <Clock size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">
                    Order #{order._id.slice(-6)} • <span className="text-orange-500">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                  </h3>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* DELETE BUTTON */}
                  <button 
                    onClick={(e) => handleDeleteOrder(e, order._id)}
                    className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Delete from history"
                  >
                    <Trash2 size={20} />
                  </button>
                  <div className="text-gray-200 group-hover:text-orange-500 transition-colors">
                    <ChevronRight size={24} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;