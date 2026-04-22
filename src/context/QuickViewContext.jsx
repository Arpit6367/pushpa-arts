'use client';
import { createContext, useContext, useState } from 'react';
import QuickViewModal from '@/components/QuickViewModal';

const QuickViewContext = createContext();

export function QuickViewProvider({ children }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openQuickView = (product) => setSelectedProduct(product);
  const closeQuickView = () => setSelectedProduct(null);

  return (
    <QuickViewContext.Provider value={{ openQuickView }}>
      {children}
      {selectedProduct && (
        <QuickViewModal product={selectedProduct} onClose={closeQuickView} />
      )}
    </QuickViewContext.Provider>
  );
}

export const useQuickView = () => useContext(QuickViewContext);
