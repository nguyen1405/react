import { createContext, useContext, useState, useEffect } from 'react';
import { initialProducts } from '../data/products';

const ProductContext = createContext();

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      rating: 0,
      quantity: product.quantity || 0,
      inStock: product.quantity > 0,
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id, updatedProduct) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        const newQuantity = updatedProduct.quantity !== undefined ? updatedProduct.quantity : p.quantity;
        return { ...p, ...updatedProduct, quantity: newQuantity, inStock: newQuantity > 0 };
      }
      return p;
    }));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <ProductContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
    }}>
      {children}
    </ProductContext.Provider>
  );
};