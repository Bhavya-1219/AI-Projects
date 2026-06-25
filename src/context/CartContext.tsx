'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  isVeg: boolean;
  restaurantId: string;
  restaurantName: string;
}

interface CartContextType {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('gourmetgo_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart from localStorage:', e);
      }
    }
    setMounted(true);
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('gourmetgo_cart', JSON.stringify(items));
    }
  }, [items, mounted]);

  const restaurantId = items.length > 0 ? items[0].restaurantId : null;
  const restaurantName = items.length > 0 ? items[0].restaurantName : null;

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems((prevItems) => {
      // If cart is not empty and adding an item from a different restaurant, clear it first
      if (prevItems.length > 0 && prevItems[0].restaurantId !== newItem.restaurantId) {
        return [{ ...newItem, quantity: 1 }];
      }

      // Check if item already exists
      const existingItemIndex = prevItems.findIndex(
        (item) => item.menuItemId === newItem.menuItemId
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        return updatedItems;
      }

      return [...prevItems, { ...newItem, quantity: 1 }];
    });
  };

  const removeItem = (menuItemId: string) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.menuItemId === menuItemId);
      if (existingItemIndex === -1) return prevItems;

      const updatedItems = [...prevItems];
      const currentQty = updatedItems[existingItemIndex].quantity;

      if (currentQty <= 1) {
        updatedItems.splice(existingItemIndex, 1);
      } else {
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: currentQty - 1,
        };
      }
      return updatedItems;
    });
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.menuItemId === menuItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  // Avoid hydration mismatch by rendering children only after mounting
  return (
    <CartContext.Provider
      value={{
        items: mounted ? items : [],
        restaurantId: mounted ? restaurantId : null,
        restaurantName: mounted ? restaurantName : null,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        cartCount: mounted ? cartCount : 0,
        cartTotal: mounted ? cartTotal : 0,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
