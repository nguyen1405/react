import { createContext, useContext, useState, useEffect } from "react";
import { products as initialProducts } from "../data/products";

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : initialProducts;
  });

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  // CRUD Operations
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
    };
    setProducts((prev) => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (id, updates) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const getProduct = (id) => {
    return products.find((p) => p.id === id);
  };

  // Reset ve data ban dau
  const resetProducts = () => {
    setProducts(initialProducts);
  };

  const value = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    resetProducts,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts phai duoc dung ben trong ProductProvider");
  }
  return context;
};
