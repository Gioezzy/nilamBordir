'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { CartItem, OrderCustomization } from '@/lib/types';
import isEqual from 'lodash.isequal';

interface CartContentType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContent = createContext<CartContentType | undefined>(undefined);

const CART_STORAGE_KEY = 'shopping_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart: ', error);
      }
    }
    setMounted(true);
  }, []);

  // save cart to local storage on items change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, mounted]);

  const addItem = (item: Omit<CartItem, 'id'>) => {
    setItems(prev => {
      // Check if an item with the same product ID and identical customization already exists
      const existingItemIndex = prev.findIndex(
        i =>
          i.productId === item.productId &&
          isEqual(i.customization, item.customization)
      );

      if (existingItemIndex > -1) {
        // If it exists, update the quantity
        const updated = [...prev];
        updated[existingItemIndex].quantity += item.quantity;
        return updated;
      }

      // Otherwise, add it as a new item
      return [...prev, { ...item, id: Date.now().toString() }];
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContent.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContent.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContent);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
