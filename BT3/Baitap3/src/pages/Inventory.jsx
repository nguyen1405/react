import { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useProduct } from '../context/ProductContext';
import AddProductModal from '../components/AddProductModal';
import '../css/Inventory.css';

const Inventory = () => {
  const { products, deleteProduct } = useProduct();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditProduct(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${name}"?`)) {
      deleteProduct(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditProduct(null);
  };

  return (
    <div className="inventory-page">
      <div className="inventory-container">
        <div className="inventory-header">
          <h1 className="inventory-title">Kho sản phẩm</h1>
          <p className="inventory-subtitle">Quản lý danh sách sản phẩm của bạn</p>
        </div>

        <div className="inventory-toolbar">
          <div className="toolbar-row">
            <div className="search-box">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="category-select"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button onClick={handleAddNew} className="add-product-btn">
              <Plus className="w-5 h-5" />
              Thêm sản phẩm
            </button>
          </div>
        </div>

        <div className="inventory-list">
          {filteredProducts.length === 0 ? (
            <div className="inventory-empty">
              <p className="inventory-empty-text">Không tìm thấy sản phẩm nào</p>
            </div>
          ) : (
            filteredProducts.map(product => (
              <div key={product.id} className="product-item">
                <img
                  src={product.image || `https://picsum.photos/seed/${product.id}/100/100`}
                  alt={product.name}
                  className="product-item-image"
                />
                <div className="product-item-info">
                  <h3 className="product-item-name">{product.name}</h3>
                  <div className="product-item-details">
                    <span>Giá: <span className="product-item-price">{formatPrice(product.price)}</span></span>
                    {product.category && (
                      <span className="product-item-category">{product.category}</span>
                    )}
                  </div>
                  <p className="product-item-stock">
                    Tồn kho: <span className={product.quantity > 0 ? 'stock-available' : 'stock-out'}>Còn {product.quantity} sản phẩm</span>
                  </p>
                </div>
                <div className="product-item-actions">
                  <button onClick={() => handleEdit(product)} className="action-btn edit-btn">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(product.id, product.name)} className="action-btn delete-btn">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="inventory-footer">
          Tổng số: {filteredProducts.length} sản phẩm
        </div>
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editProduct={editProduct}
      />
    </div>
  );
};

export default Inventory;