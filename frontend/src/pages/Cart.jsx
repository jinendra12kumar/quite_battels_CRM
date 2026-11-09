import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } = useCart();
  const [checkoutStep, setCheckoutStep] = useState('review'); // 'review' | 'details' | 'success'
  const [shippingAddress, setShippingAddress] = useState({
    name: 'Aiden Vance',
    email: 'client@quietbattles.com',
    address: '42 Obsidian Boulevard, High-Rise 7',
    city: 'Mumbai',
    postalCode: '400001',
    phone: '+91 98765 43210',
  });
  const [orderId, setOrderId] = useState('');

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const generatedId = 'QB-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(generatedId);
    setCheckoutStep('success');
    clearCart();
  };

  if (checkoutStep === 'success') {
    return (
      <div className="bg-[#F3EFE7] text-[#171717] pt-32 pb-40">
        <div className="max-w-2xl mx-auto px-6 text-center space-y-6">
          <div className="w-16 h-16 rounded-full border-2 border-[#B49A70] flex items-center justify-center mx-auto text-[#B49A70] bg-[#E8E1D6]">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase tracking-[0.4em] text-[#B49A70] font-semibold">
            CONFIRMATION PROTOCOL
          </span>
          <h1 className="font-brand text-3xl sm:text-4xl text-[#171717] uppercase tracking-[0.2em] font-bold">
            ORDER RECORDED
          </h1>
          <p className="font-mono text-sm text-[#B49A70] font-bold">
            ALLOCATION CODE: {orderId}
          </p>
          <p className="text-sm text-[#77736C] font-light leading-relaxed max-w-md mx-auto">
            Your acquisition has been registered with the atelier. Your garments are currently being inspected and hand-packaged into signature matte archival boxing.
          </p>
          <div className="border border-[#D8D0C3] p-6 bg-[#E8E1D6] text-left text-xs space-y-2 font-mono text-[#77736C] shadow-sm">
            <div className="text-[#171717] uppercase tracking-wider font-sans text-xs pb-1 border-b border-[#D8D0C3] font-semibold">
              DISPATCH DESTINATION:
            </div>
            <p className="text-[#171717] font-medium">{shippingAddress.name}</p>
            <p>{shippingAddress.address}, {shippingAddress.city} - {shippingAddress.postalCode}</p>
            <p>Contact: {shippingAddress.phone}</p>
          </div>
          <div className="pt-4">
            <Link
              to="/archive"
              className="px-8 py-4 bg-[#171717] text-[#F3EFE7] hover:bg-[#B49A70] hover:text-[#171717] text-xs uppercase tracking-[0.25em] font-medium transition-colors inline-flex items-center space-x-2"
            >
              <span>RETURN TO ARCHIVE</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F3EFE7] text-[#171717] pt-28 pb-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="mb-12 border-b border-[#D8D0C3] pb-6 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.35em] text-[#B49A70] block mb-1 font-semibold">
              ARCHIVE CHECKOUT
            </span>
            <h1 className="font-brand text-3xl sm:text-5xl text-[#171717] uppercase tracking-[0.2em] font-bold">
              YOUR BAG
            </h1>
          </div>
          <span className="text-xs font-mono text-[#77736C]">
            {totalItems} {totalItems === 1 ? 'ITEM' : 'ITEMS'} RESERVED
          </span>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-24 space-y-6 border border-[#D8D0C3] bg-[#E8E1D6] max-w-2xl mx-auto p-12 shadow-sm">
            <p className="font-serif text-2xl text-[#171717]">
              Your bag holds no armor yet.
            </p>
            <p className="text-xs text-[#77736C] font-light max-w-md mx-auto">
              Explore Series 01 – The Gentle Armor™ to discover architectural silhouettes designed for resilience.
            </p>
            <div className="pt-4">
              <Link
                to="/shop"
                className="px-8 py-4 bg-[#171717] text-[#F3EFE7] hover:bg-[#B49A70] hover:text-[#171717] text-xs uppercase tracking-[0.25em] font-medium transition-all inline-block"
              >
                DISCOVER THE COLLECTION
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* LEFT: Items List or Shipping form */}
            <div className="lg:col-span-8 space-y-6">
              {checkoutStep === 'review' ? (
                <div className="border border-[#D8D0C3] bg-[#E8E1D6] divide-y divide-[#D8D0C3] shadow-sm">
                  {cartItems.map((item) => (
                    <div
                      key={`${item.id}-${item.selectedSize}`}
                      className="p-6 flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6"
                    >
                      <div className="w-24 h-32 bg-[#171717] overflow-hidden flex-shrink-0 border border-[#D8D0C3]">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>

                      <div className="flex-1 space-y-2">
                        <h3 className="font-brand text-sm sm:text-base text-[#171717] uppercase tracking-wider font-semibold">
                          {item.name}
                        </h3>
                        <p className="text-xs text-[#B49A70] tracking-widest font-mono uppercase font-semibold">
                          SIZE: {item.selectedSize}
                        </p>
                        <p className="font-serif text-sm text-[#77736C]">
                          Unit: ₹{item.price.toLocaleString('en-IN')}
                        </p>
                      </div>

                      {/* Quantity & Actions */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:space-y-4">
                        <div className="flex items-center border border-[#D8D0C3] bg-[#F3EFE7]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                            className="p-2 text-[#77736C] hover:text-[#171717] transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-mono text-[#171717] font-bold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                            className="p-2 text-[#77736C] hover:text-[#171717] transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center space-x-4">
                          <span className="font-mono text-sm text-[#171717] font-semibold">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id, item.selectedSize)}
                            className="text-[#77736C] hover:text-red-600 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="p-4 flex items-center justify-between text-xs text-[#77736C] bg-[#E8E1D6]">
                    <Link
                      to="/shop"
                      className="hover:text-[#171717] transition-colors flex items-center space-x-2 uppercase tracking-widest font-medium"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>CONTINUE SHOPPING</span>
                    </Link>
                    <button
                      type="button"
                      onClick={clearCart}
                      className="text-[#77736C] hover:text-[#171717] uppercase tracking-widest cursor-pointer"
                    >
                      CLEAR BAG
                    </button>
                  </div>
                </div>
              ) : (
                /* Step 2: Client Delivery Form */
                <form id="shipping-form" onSubmit={handlePlaceOrder} className="border border-[#D8D0C3] bg-[#E8E1D6] p-8 space-y-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#D8D0C3] pb-4">
                    <h3 className="font-brand text-lg text-[#171717] uppercase tracking-wider font-semibold">
                      CONCIERGE DISPATCH ADDRESS
                    </h3>
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('review')}
                      className="text-xs text-[#B49A70] uppercase tracking-widest hover:underline font-semibold"
                    >
                      BACK TO REVIEW
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-[#77736C] font-semibold">
                        FULL NAME
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.name}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                        className="w-full bg-[#F3EFE7] border border-[#D8D0C3] px-3 py-2 text-xs text-[#171717] focus:border-[#171717] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-[#77736C] font-semibold">
                        EMAIL
                      </label>
                      <input
                        type="email"
                        required
                        value={shippingAddress.email}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                        className="w-full bg-[#F3EFE7] border border-[#D8D0C3] px-3 py-2 text-xs text-[#171717] focus:border-[#171717] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-[#77736C] font-semibold">
                      DELIVERY ADDRESS
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                      className="w-full bg-[#F3EFE7] border border-[#D8D0C3] px-3 py-2 text-xs text-[#171717] focus:border-[#171717] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-[#77736C] font-semibold">
                        CITY
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        className="w-full bg-[#F3EFE7] border border-[#D8D0C3] px-3 py-2 text-xs text-[#171717] focus:border-[#171717] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-[#77736C] font-semibold">
                        POSTAL CODE
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.postalCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                        className="w-full bg-[#F3EFE7] border border-[#D8D0C3] px-3 py-2 text-xs text-[#171717] focus:border-[#171717] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-[#77736C] font-semibold">
                        PHONE
                      </label>
                      <input
                        type="tel"
                        required
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                        className="w-full bg-[#F3EFE7] border border-[#D8D0C3] px-3 py-2 text-xs text-[#171717] focus:border-[#171717] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-4 border border-[#D8D0C3] bg-[#F3EFE7] text-xs text-[#77736C] space-y-1">
                    <p className="text-[#171717] font-semibold uppercase tracking-wider">
                      PAYMENT METHOD: DEMO ORDER CONFIRMATION
                    </p>
                    <p className="text-[11px] font-light">
                      Technical evaluation mode: Real payment processing simulated without third-party gateway overhead.
                    </p>
                  </div>
                </form>
              )}
            </div>

            {/* RIGHT: Order Summary Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="border border-[#D8D0C3] bg-[#E8E1D6] p-8 space-y-6 shadow-sm">
                <h3 className="font-brand text-base uppercase tracking-[0.2em] text-[#171717] border-b border-[#D8D0C3] pb-4 font-semibold">
                  ACQUISITION SUMMARY
                </h3>

                <div className="space-y-3 text-xs tracking-wider">
                  <div className="flex justify-between text-[#77736C]">
                    <span className="uppercase font-medium">SUBTOTAL</span>
                    <span className="font-mono text-[#171717] font-bold">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#77736C]">
                    <span className="uppercase font-medium">ARCHIVAL PACKAGING</span>
                    <span className="text-emerald-700 font-mono font-semibold">
                      COMPLIMENTARY
                    </span>
                  </div>
                  <div className="flex justify-between text-[#77736C]">
                    <span className="uppercase font-medium">DOMESTIC EXPRESS FREIGHT</span>
                    <span className="text-emerald-700 font-mono font-semibold">
                      FREE
                    </span>
                  </div>
                  <div className="border-t border-[#D8D0C3] pt-4 flex justify-between items-baseline text-sm">
                    <span className="font-brand uppercase tracking-[0.2em] text-[#171717] font-bold">
                      TOTAL
                    </span>
                    <span className="font-mono text-xl text-[#171717] font-bold">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {checkoutStep === 'review' ? (
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('details')}
                    className="w-full py-4 bg-[#171717] text-[#F3EFE7] hover:bg-[#B49A70] hover:text-[#171717] text-xs uppercase tracking-[0.25em] font-medium transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                  >
                    <span>ENTER DISPATCH DETAILS</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    form="shipping-form"
                    className="w-full py-4 bg-[#171717] text-[#F3EFE7] hover:bg-[#B49A70] hover:text-[#171717] text-xs uppercase tracking-[0.25em] font-medium transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                  >
                    <span>CONFIRM & ALLOCATE ORDER</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <div className="border-t border-[#D8D0C3] pt-4 flex items-center space-x-2 text-[10px] text-[#77736C] uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4 text-[#B49A70]" />
                  <span>AUTHENTICATED LIMITED SERIES ALLOCATION</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
