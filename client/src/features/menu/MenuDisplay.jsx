import React, { useEffect, useState } from 'react';
import { fetchMenu } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { PlusCircle, UtensilsCrossed, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Static Height Description Component
 * Prevents the entire row from moving when text expands
 */
const TeaserDescription = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!text) return null;

  const words = text.split(' ');
  const isLong = words.length > 4;
  const teaser = words.slice(0, 4).join(' ');

  return (
    // Fixed height (h-16) ensures the card doesn't change size
    <div className="mb-4 h-16 flex flex-col justify-start">
      <div className={`text-gray-600 text-sm leading-relaxed ${isExpanded ? 'overflow-y-auto custom-scrollbar' : 'overflow-hidden'}`}>
        <p className="inline">
          {isExpanded ? text : `${teaser}...`}
        </p>
        
        {isLong && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }}
            className="text-orange-500 text-[10px] font-black hover:text-orange-600 ml-1 inline-flex items-center gap-0.5 transition-colors uppercase tracking-tighter"
          >
            {isExpanded ? (
              <>Less <ChevronUp size={10} /></>
            ) : (
              <>More <ChevronDown size={10} /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const MenuDisplay = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const getMenuData = async () => {
      try {
        setLoading(true);
        const res = await fetchMenu();
        setItems(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getMenuData();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
      {items.map((item) => (
        <div 
          key={item._id} 
          className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
        >
          {/* Image */}
          <div className="h-40 overflow-hidden relative shrink-0">
            <img 
              src={item.image || 'https://placehold.co/600x400?text=Food'} 
              alt={item.name} 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-5 flex flex-col flex-grow">
            {/* Name & Price */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-base font-bold text-gray-800 leading-tight h-10 overflow-hidden">{item.name}</h3>
              <span className="text-orange-600 font-black text-sm ml-2">
                ₹{item.price.toLocaleString('en-IN')}
              </span>
            </div>

            {/* DESCRIPTION LOGIC - FIXED HEIGHT */}
            <TeaserDescription text={item.description} />

            {/* Add to Cart Button */}
            <button 
              onClick={() => addToCart(item)}
              className="mt-auto flex items-center justify-center gap-2 w-full bg-orange-500 text-white py-3 rounded-xl font-black text-xs hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-orange-100"
            >
              <PlusCircle size={16} />
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuDisplay;