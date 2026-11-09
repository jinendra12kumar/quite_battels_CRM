import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();
  const navigate = useNavigate();

  const handleCheckoutNav = () => {
    setIsCartOpen(false);
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-md bg-[#171717] border-l border-[#F3EFE7]/10 text-[#F3EFE7] flex flex-col h-full shadow-2xl z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#F3EFE7]/10 bg-[#222222]">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="w-4 h-4 text-[#B49A70]" />
                <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#F3EFE7]">
                  YOUR BAG ({totalItems})
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-[#77736C] hover:text-[#F3EFE7] transition-colors cursor-pointer"
                aria-label="Close Bag"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bag Items Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 divide-y divide-[#F3EFE7]/10">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-5 py-16">
                  <div className="w-16 h-16 rounded-full border border-[#F3EFE7]/15 flex items-center justify-center text-[#77736C]">
                    <ShoppingBag className="w-7 h-7 stroke-[1]" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-serif text-xl tracking-wide text-[#F3EFE7]">
                      Your bag is empty
                    </p>
                    <p className="text-xs text-[#77736C] max-w-xs font-light">
                      Equip yourself with Series 01. The Gentle Armor™ is waiting.
                    </p>
                  </div>
                  <Link
                    to="/shop"
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 px-6 py-3 border border-[#B49A70] text-[#B49A70] hover:bg-[#B49A70] hover:text-[#171717] text-xs uppercase tracking-[0.25em] transition-all inline-block font-medium"
                  >
                    DISCOVER PIECES
                  </Link>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="py-5 flex space-x-4">
                    {/* Item Thumbnail */}
                    <div className="w-20 h-24 bg-[#222222] overflow-hidden flex-shrink-0 border border-[#F3EFE7]/10">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs uppercase tracking-wider font-semibold text-[#F3EFE7] line-clamp-1">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id, item.selectedSize)}
                            className="text-[#77736C] hover:text-red-400 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-[#B49A70] tracking-widest uppercase mt-0.5 font-bold">
                          SIZE: {item.selectedSize}
                        </p>
                        <p className="text-xs text-[#F3EFE7] mt-1 font-serif tracking-wider font-semibold">
                          ₹{item.price.toLocaleString('en-IN')}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3 mt-3">
                        <div className="flex items-center border border-[#F3EFE7]/15 rounded-sm bg-[#222222]">
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                            className="p-1 px-2 text-[#77736C] hover:text-[#F3EFE7] transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs px-2 text-[#F3EFE7] font-mono font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                            className="p-1 px-2 text-[#77736C] hover:text-[#F3EFE7] transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-[11px] text-[#B49A70] font-mono ml-auto font-semibold">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-[#F3EFE7]/10 bg-[#222222] space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#77736C]">
                    <span className="tracking-widest uppercase font-medium">SUBTOTAL</span>
                    <span className="text-[#F3EFE7] font-mono tracking-wider font-bold">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#77736C]">
                    <span className="tracking-widest uppercase font-medium">SHIPPING</span>
                    <span className="text-emerald-400 text-[11px] tracking-wider font-semibold">
                      COMPLIMENTARY
                    </span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-[#F3EFE7]/10 font-medium">
                    <span className="tracking-[0.2em] uppercase text-[#F3EFE7] font-bold">TOTAL</span>
                    <span className="font-mono text-[#F3EFE7] text-base font-bold">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleCheckoutNav}
                    className="py-3 px-4 border border-[#F3EFE7]/20 text-xs uppercase tracking-[0.2em] text-[#F3EFE7] hover:border-[#B49A70] hover:text-[#B49A70] transition-colors text-center cursor-pointer"
                  >
                    VIEW BAG
                  </button>
                  <button
                    onClick={handleCheckoutNav}
                    className="py-3 px-4 bg-[#F3EFE7] text-[#171717] hover:bg-[#B49A70] text-xs uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center space-x-2 text-center cursor-pointer"
                  >
                    <span>CHECKOUT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[10px] text-center text-[#77736C] tracking-wider">
                  Orders shipped in signature matte archival packaging.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
