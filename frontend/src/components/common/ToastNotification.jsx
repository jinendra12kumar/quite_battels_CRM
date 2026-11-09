import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function ToastNotification() {
  const { notification, triggerNotification } = useCart();

  if (!notification) return null;

  const isError = notification.type === 'error';
  const isInfo = notification.type === 'info';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 bg-[#222222] border border-[#B49A70]/40 px-5 py-4 shadow-2xl text-[#F3EFE7] max-w-md rounded-none"
      >
        {isError ? (
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
        ) : isInfo ? (
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-[#B49A70] flex-shrink-0" />
        )}
        <div className="flex-1 pr-2">
          <p className="text-xs tracking-wider uppercase font-medium">
            {notification.message}
          </p>
        </div>
        <button
          onClick={() => triggerNotification(null)}
          className="text-[#77736C] hover:text-[#F3EFE7] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
