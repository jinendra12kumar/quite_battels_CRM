import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'wear_your_battles_cart';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse cart from localStorage:', e);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cartItems]);

  // Show transient toast notification
  const triggerNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  /**
   * Add item to cart with size validation
   */
  const addToCart = (product, selectedSize, quantity = 1) => {
    if (!selectedSize) {
      triggerNotification('Please select a size to proceed.', 'error');
      return false;
    }

    if (quantity < 1) {
      triggerNotification('Quantity must be at least 1.', 'error');
      return false;
    }

    setCartItems((prevItems) => {
      // Find matching item by ID AND selectedSize
      const existingIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      } else {
        const newItem = {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: Number(product.price),
          image: product.images?.[0]?.image_url || product.cover_image || '',
          selectedSize,
          quantity,
          stock: product.stock || 50,
        };
        return [...prevItems, newItem];
      }
    });

    triggerNotification(`Added "${product.name}" (${selectedSize}) to bag.`);
    setIsCartOpen(true);
    return true;
  };

  /**
   * Update quantity of an item
   */
  const updateQuantity = (itemId, size, newQty) => {
    if (newQty <= 0) {
      removeFromCart(itemId, size);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId && item.selectedSize === size
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  /**
   * Remove item from cart
   */
  const removeFromCart = (itemId, size) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.id === itemId && item.selectedSize === size)
      )
    );
    triggerNotification('Item removed from your bag.', 'info');
  };

  /**
   * Clear all items
   */
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Calculations
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        notification,
        triggerNotification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

