import { useState } from "react";
import { useProducts } from "../contexts/ProductContext";
import Button from "../components/ui/Button";

const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: "",
  });

  const formatPrice = (price) => price.toLocaleString("vi-VN") + "đ";

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      image: product.image,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm("Ban muon xoa san pham nay?")) {
      deleteProduct(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseInt(formData.price),
    };
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
    setShowForm(false);
    setEditingProduct(null);
    setFormData({ name: "", price: "", category: "", description: "", image: "" });
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setFormData({ name: "", price: "", category: "", description: "", image: "" });
    setShowForm(true);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Quan ly san pham
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {products.length} san pham
            </p>
          </div>
          <Button variant="primary" onClick={openAddForm}>
            + Them san pham
          </Button>
        </div>

        {/* Product Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">San pham</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Danh muc</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Gia</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Thao tac</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100 dark:bg-gray-700" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-semibold text-gray-900 dark:text-white tabular-nums">
                    {formatPrice(product.price)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(product)}>
                        Sua
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(product.id)}>
                        Xoa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center py-20 text-gray-400 dark:text-gray-500">Chua co san pham nao</div>
          )}
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowForm(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editingProduct ? "Sua san pham" : "Them san pham"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ten san pham</label>
                  <input type="text" required value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gia (VND)</label>
                  <input type="number" required min={1} value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Danh muc</label>
                  <input type="text" required value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mo ta</label>
                  <textarea required rows={3} value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hinh anh (URL)</label>
                  <input type="url" required value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://picsum.photos/seed/..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"/>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowForm(false)}>
                    Huy
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1">
                    {editingProduct ? "Luu" : "Them"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminProducts;
