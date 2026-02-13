import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderStatus } from '../../services/api';
import { io } from 'socket.io-client';
import { CheckCircle, ChevronLeft, Home, Package } from 'lucide-react';

const OrderStatus = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch initial status from API
    const fetchOrder = async () => {
      try {
        const res = await getOrderStatus(orderId);
        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order details:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();

    // 2. Real-time updates via Socket.io
    const socket = io('http://localhost:5000');
    socket.emit('joinOrder', orderId);

    socket.on('statusUpdate', (updatedOrder) => {
      setOrder(updatedOrder);
    });

    // Cleanup socket on unmount
    return () => socket.disconnect();
  }, [orderId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      <p className="mt-4 font-bold text-orange-500">Loading tracking data...</p>
    </div>
  );

  if (!order) return (
    <div className="text-center py-20">
      <p className="text-red-500 font-bold mb-4">Order not found.</p>
      <button onClick={() => navigate('/')} className="text-orange-500 underline">Back to Menu</button>
    </div>
  );

  const steps = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];
  const currentStep = steps.indexOf(order.status);

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      
      {/* Navigation Headers */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-orange-500 font-bold transition-all"
        >
          <ChevronLeft size={20} /> Back
        </button>
        
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-all text-sm"
        >
          <Home size={18} /> Menu
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="text-orange-600" size={30} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-400 text-xs font-mono bg-gray-50 inline-block px-3 py-1 rounded-full border border-gray-100">
            Order ID: {orderId}
          </p>
        </div>

        {/* Real-time Status Timeline */}
        <div className="relative space-y-8">
          {steps.map((step, index) => (
            <div key={step} className="flex items-start gap-4">
              <div className="relative flex flex-col items-center">
                {/* Circle Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors duration-500 ${
                  index <= currentStep 
                    ? (order.status === 'Delivered' ? 'bg-green-500 text-white shadow-lg shadow-green-100' : 'bg-orange-500 text-white shadow-lg shadow-orange-100')
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {index < currentStep ? <CheckCircle size={18} /> : <span className="text-xs font-bold">{index + 1}</span>}
                </div>
                
                {/* Connector Line */}
                {index !== steps.length - 1 && (
                  <div className={`w-1 h-12 -mb-8 transition-colors duration-500 ${
                    index < currentStep ? (order.status === 'Delivered' ? 'bg-green-500' : 'bg-orange-500') : 'bg-gray-100'
                  }`} />
                )}
              </div>

              <div className="pt-1">
                <p className={`font-bold text-sm ${index <= currentStep ? 'text-gray-900' : 'text-gray-300'}`}>
                  {step}
                </p>
                
                {/* FIXED LOGIC: Pulse "In Progress" only if it's the current step AND NOT Delivered */}
                {index === currentStep && step !== 'Delivered' && (
                  <p className="text-orange-500 text-[10px] font-black uppercase tracking-tighter animate-pulse">
                    In Progress
                  </p>
                )}

                {/* Final State Message */}
                {index === currentStep && step === 'Delivered' && (
                  <p className="text-green-500 text-[10px] font-black uppercase tracking-tighter">
                    Enjoy your meal!
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Price Summary Section */}
        <div className="mt-12 pt-8 border-t border-dashed border-gray-200">
          <div className="flex justify-between items-center text-gray-800 font-bold">
            <span className="text-gray-400">Paid Total:</span>
            <span className="text-2xl font-black text-gray-900">
              ₹{order.totalPrice.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;