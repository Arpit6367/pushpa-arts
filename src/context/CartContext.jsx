'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Persistence: Load from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('pushpa_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    const savedCoupon = localStorage.getItem('pushpa_coupon');
    if (savedCoupon) {
      try {
        const parsed = JSON.parse(savedCoupon);
        setAppliedCoupon(parsed.coupon);
        setDiscountAmount(parsed.discountAmount);
      } catch (e) {
        console.error('Failed to parse coupon', e);
      }
    }
    setIsMounted(true);
  }, []);

  // Persistence: Save to localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('pushpa_cart', JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  // Persist coupon to localStorage
  useEffect(() => {
    if (isMounted) {
      if (appliedCoupon) {
        localStorage.setItem('pushpa_coupon', JSON.stringify({ coupon: appliedCoupon, discountAmount }));
      } else {
        localStorage.removeItem('pushpa_coupon');
      }
    }
  }, [appliedCoupon, discountAmount, isMounted]);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, {
        id: product.id,
        name: product.name,
        price: product.sale_price || product.price || 0,
        image: product.primary_image || product.first_image || product.images?.[0]?.file_path,
        slug: product.slug,
        category_slug_path: product.category_slug_path,
        quantity
      }];
    });
    setIsCartOpen(true); // Open mini-cart on add
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart(prevCart => prevCart.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
    removeCoupon();
  };

  // Coupon functions
  const applyCoupon = async (code) => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const res = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, cart_total: total }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Invalid coupon code.');
    }

    setAppliedCoupon(data.coupon);
    setDiscountAmount(data.discount_amount);
    return data;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  // Recalculate discount when cart changes with an applied coupon
  useEffect(() => {
    if (appliedCoupon && isMounted && cart.length > 0) {
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      let newDiscount = 0;
      if (appliedCoupon.discount_type === 'percentage') {
        newDiscount = (total * appliedCoupon.discount_value) / 100;
        if (appliedCoupon.max_discount_amount && newDiscount > appliedCoupon.max_discount_amount) {
          newDiscount = appliedCoupon.max_discount_amount;
        }
      } else {
        newDiscount = appliedCoupon.discount_value;
      }
      if (newDiscount > total) newDiscount = total;
      setDiscountAmount(Math.round(newDiscount * 100) / 100);
    } else if (cart.length === 0 && appliedCoupon) {
      removeCoupon();
    }
  }, [cart, appliedCoupon, isMounted]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
      isCartOpen,
      setIsCartOpen,
      // Coupon
      appliedCoupon,
      discountAmount,
      finalTotal,
      applyCoupon,
      removeCoupon,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
