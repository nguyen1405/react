import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';
import useDebounce from '../hooks/useDebounce';
import usePagination from '../hooks/usePagination';

const ITEMS_PER_PAGE = 4;

const ProductGallery = () => {
  const { isLoggedIn } = useAuth();
  const { totalItems } = useCart();
  const { products } = useProducts();

  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    sortBy: 'default',
  });

  const debouncedSearch = useDebounce(filters.search, 500);
  const isSearching = !!filters.search && filters.search !== debouncedSearch;

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))];
    return ['all', ...cats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower),
      );
    }

    if (filters.category !== 'all') {
      result = result.filter((p) => p.category === filters.category);
    }

    if (filters.sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'name_asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, debouncedSearch, filters.category, filters.sortBy]);

  const {
    currentData,
    currentPage,
    totalPages,
    goNext,
    goToPage,
    goPrev,
    reset: resetPagination,
    canGoNext,
    canGoPrev,
  } = usePagination(filteredProducts, ITEMS_PER_PAGE);

  useEffect(() => {
    resetPagination();
  }, [debouncedSearch, filters.category, filters.sortBy, resetPagination]);

  const stats = useMemo(
    () => ({
      total: filteredProducts.length,
      totalPages,
      itemsPerPage: ITEMS_PER_PAGE,
    }),
    [filteredProducts.length, totalPages],
  );

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Cua hang
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {stats.total} san pham - Trang {currentPage}/{stats.totalPages}
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm">
            {!isLoggedIn && (
              <span className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-medium">
                Dang nhap de them vao gio hang
              </span>
            )}
            {isLoggedIn && totalItems > 0 && (
              <span className="px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-xs font-medium">
                🛒 {totalItems} san pham trong gio
              </span>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Tim kiem san pham..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Spinner size="sm" />
                </div>
              )}
            </div>

            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Tat ca danh muc' : cat}
                </option>
              ))}
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="default">Mac dinh</option>
              <option value="price_asc">Gia: Thap - Cao</option>
              <option value="price_desc">Gia: Cao - Thap</option>
              <option value="name_asc">Ten: A - Z</option>
            </select>
          </div>
        </div>

        {filters.search || filters.category !== 'all' ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Tim thay{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{stats.total}</span> san
            pham
          </p>
        ) : null}

        {currentData.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {currentData.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  onClick={goPrev}
                  disabled={!canGoPrev}
                  className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    canGoPrev
                      ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      : 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 border border-gray-200 cursor-not-allowed'
                  }`}
                >
                  ← Truoc
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-9 h-9 text-sm font-semibold rounded-xl transition-all duration-200 ${
                        page === currentPage
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={goNext}
                  disabled={!canGoNext}
                  className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    canGoNext
                      ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      : 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 border border-gray-200 cursor-not-allowed'
                  }`}
                >
                  Sau →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 dark:text-gray-500">Khong tim thay san pham nao</p>
            <button
              onClick={() => setFilters({ search: '', category: 'all', sortBy: 'default' })}
              className="mt-4 text-sm text-primary-600 hover:underline"
            >
              Xoa bo loc
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGallery;
