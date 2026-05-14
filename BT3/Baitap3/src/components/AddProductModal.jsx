import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useProduct } from '../context/ProductContext';
import '../css/AddProductModal.css';

const AddProductModal = ({ isOpen, onClose, editProduct = null }) => {
  const { addProduct, updateProduct } = useProduct();
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    image: '',
    description: '',
    quantity: 0,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: editProduct?.name || '',
        price: editProduct?.price || '',
        category: editProduct?.category || '',
        image: editProduct?.image || '',
        description: editProduct?.description || '',
        quantity: editProduct?.quantity ?? 0,
      });
    }
  }, [isOpen, editProduct]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
    };

    if (editProduct) {
      updateProduct(editProduct.id, productData);
    } else {
      addProduct(productData);
    }
    onClose();
    setFormData({ name: '', price: '', category: '', image: '', description: '', quantity: 0 });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    onClose();
    setFormData({ name: '', price: '', category: '', image: '', description: '', quantity: 0 });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {editProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h2>
          <button onClick={handleClose} className="modal-close-btn">
            <X className="modal-close-icon" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Tên sản phẩm</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Nhập tên sản phẩm"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Giá (VNĐ)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              className="form-input"
              placeholder="Nhập giá sản phẩm"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Danh mục</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Chọn danh mục</option>
              <option value="Laptop">Laptop</option>
              <option value="Phone">Phone</option>
              <option value="Tablet">Tablet</option>
              <option value="Accessories">Accessories</option>
              <option value="Đồ ăn">Đồ ăn</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Link ảnh</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="form-input"
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="form-textarea"
              placeholder="Nhập mô tả sản phẩm"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Số lượng trong kho</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="0"
              className="form-input"
              placeholder="Nhập số lượng"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleClose} className="form-btn form-btn-cancel">
              Hủy
            </button>
            <button type="submit" className="form-btn form-btn-submit">
              {editProduct ? 'Cập nhật' : 'Thêm sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;