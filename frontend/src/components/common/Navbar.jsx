import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, ArrowUpRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'THE ARCHIVE', path: '/archive' },
    { name: 'ABOUT', path: '/about' },
    { name: 'SHOP', path: '/shop' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-[ #171717]/90 backdrop-blur-md border-b border-[ #F3EFE7]/10 py-4 shadow-lg shadow-black/20'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Brand Logo & Tagline */}
          <Link
            to="/"
            className="group flex flex-col items-start tracking-[0.28em] uppercase transition-opacity"
          >
            <span className={`font-brand text-base sm:text-lg font-bold tracking-[0.32em] transition-colors ${
  isScrolled ? 'text-[#B49A70]' : 'text-[#F3EFE7]'
}`}>
              QUIET BATTLES™
            </span>
            {/* <span className="text-[9px] tracking-[0.35em] text-[#77736C] group-hover:text-[#B49A70] transition-colors -mt-0.5 hidden sm:block">
              WEAR YOUR BATTLES.
            </span> */}
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-xs tracking-[0.25em] transition-all duration-300 relative py-1 ${
                    isActive
                      ? 'text-[#B49A70] font-medium'
                      : 'text-[#77736C] hover:text-[#B49A70]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#B49A70]"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Bag Icon & Mobile Menu Toggle */}
          <div className="flex items-center space-x-6">
            {/* Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Open Cart"
              className="relative p-2 text-[#F3EFE7] hover:text-[#B49A70] transition-transform active:scale-95 flex items-center space-x-2 group cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 stroke-[1.5] group-hover:stroke-[2] transition-all" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2 bg-[#B49A70] text-[#171717] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center tracking-tighter"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </div>
              <span className="hidden lg:inline text-[11px] tracking-[0.2em] text-[#77736C] group-hover:text-[#F3EFE7] uppercase">
                BAG {totalItems > 0 ? `(${totalItems})` : ''}
              </span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="md:hidden p-2 text-[#F3EFE7] hover:text-[#B49A70] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Editorial Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-30 bg-[#171717]/98 backdrop-blur-2xl flex flex-col justify-between px-8 pt-28 pb-12 md:hidden"
          >
            <div className="flex flex-col space-y-8">
              <span className="text-[10px] tracking-[0.35em] text-[#77736C] uppercase border-b border-[#F3EFE7]/10 pb-3">
                NAVIGATION ARCHIVE
              </span>
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * idx, duration: 0.4 }}
                >
                  <Link
                    to={link.path}
                    className="group flex items-center justify-between text-2xl font-serif tracking-[0.1em] text-[#F3EFE7] hover:text-[#B49A70]"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-5 h-5 text-[#77736C] group-hover:text-[#B49A70] transition-colors" />
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="pt-6 border-t border-[#F3EFE7]/10"
              >
                <Link
                  to="/admin"
                  className="text-xs tracking-[0.25em] text-[#77736C] hover:text-[#B49A70] uppercase flex items-center justify-between"
                >
                  <span>CMS / CREATIVE PORTAL</span>
                  <span className="text-[10px] px-2 py-0.5 border border-[#B49A70]/30 text-[#B49A70] rounded">RESTRICTED</span>
                </Link>
              </motion.div>
            </div>

            <div className="flex flex-col space-y-2 border-t border-[#F3EFE7]/10 pt-6">
              <span className="font-brand text-xs tracking-[0.28em] text-[#F3EFE7]">
                QUIET BATTLES™
              </span>
              <p className="text-xs text-[#77736C] tracking-wider font-light">
                WEAR YOUR BATTLES. Armor is woven from intention, memory, and silence.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}