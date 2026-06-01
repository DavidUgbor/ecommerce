import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal, X, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../lib/api';
import ProductCard, { Product } from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Breadcrumb from '../components/Breadcrumb';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');
  const featured = searchParams.get('featured') || '';
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [localSearch, setLocalSearch] = useState(search);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((r) => r.data),
  });

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: '12',
    ...(category && { category }),
    ...(search && { search }),
    ...(sort && { sort }),
    ...(featured && { featured }),
    ...(minPrice && { minPrice }),
    ...(maxPrice && { maxPrice }),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products', category, search, sort, page, minPrice, maxPrice, featured],
    queryFn: () => api.get(`/products?${queryParams}`).then((r) => r.data),
  });

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    setSearchParams(params);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('search', localSearch);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchParams({});
    setMinPrice('');
    setMaxPrice('');
    setPriceRange([0, 1000]);
    setLocalSearch('');
  };

  const hasFilters = category || search || minPrice || maxPrice || featured;

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'Name A-Z' },
  ];

  const FilterPanel: React.FC = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-display font-semibold text-primary-900 mb-3">Category</h3>
        <div className="space-y-2">
          <button
            onClick={() => updateParam('category', '')}
            className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
              !category ? 'bg-primary-900 text-white' : 'text-gray-700 hover:bg-cream-DEFAULT'
            }`}
          >
            All Products
          </button>
          {(categories || []).map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => updateParam('category', cat.slug)}
              className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                category === cat.slug
                  ? 'bg-primary-900 text-white'
                  : 'text-gray-700 hover:bg-cream-DEFAULT'
              }`}
            >
              <span>{cat.name}</span>
              <span className="float-right text-xs opacity-70">{cat._count?.products || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-display font-semibold text-primary-900 mb-3">Price Range</h3>
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={1000}
            step={10}
            value={priceRange[1]}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setPriceRange([priceRange[0], val]);
              setMaxPrice(val < 1000 ? val.toString() : '');
            }}
            className="w-full"
          />
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              onBlur={() => updateParam('minPrice', minPrice)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <span className="text-gray-400">–</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              onBlur={() => updateParam('maxPrice', maxPrice)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <button
            onClick={() => {
              updateParam('minPrice', minPrice);
              updateParam('maxPrice', maxPrice);
            }}
            className="w-full py-2 bg-primary-900 text-white rounded text-sm hover:bg-primary-800 transition-colors"
          >
            Apply Price Filter
          </button>
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full py-2 border border-red-200 text-red-600 rounded text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
        >
          <X className="w-4 h-4" />
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-cream-DEFAULT">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: category ? (categories?.find((c: any) => c.slug === category)?.name || 'Products') : 'All Products' }]} />

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-primary-900">
              {category ? categories?.find((c: any) => c.slug === category)?.name || 'Products' : featured ? 'Featured Products' : search ? `Search: "${search}"` : 'All Products'}
            </h1>
            {data?.pagination && (
              <p className="text-sm text-gray-500 mt-1">
                {data.pagination.total} {data.pagination.total === 1 ? 'product' : 'products'} found
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white"
              />
            </form>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white text-gray-700 hidden sm:block"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Mobile filter button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 rounded bg-white text-sm text-gray-700 hover:border-accent transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasFilters && (
                <span className="w-4 h-4 bg-accent text-white text-xs rounded-full flex items-center justify-center">!</span>
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters (desktop) */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="bg-white rounded-xl p-5 shadow-luxury sticky top-24">
              <FilterPanel />
            </div>
          </aside>

          {/* Mobile filters */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
              <div className="absolute right-0 top-0 h-full w-72 bg-white p-5 overflow-y-auto shadow-luxury-lg animate-slide-in-right">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="font-display font-semibold text-primary-900 text-lg">Filters</h2>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <FilterPanel />
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {/* Mobile sort */}
            <div className="sm:hidden mb-4">
              <select
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            ) : !data?.products?.length ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="font-display text-xl font-semibold text-primary-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5">
                  {data.products.map((product: Product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {data.pagination && data.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="p-2 rounded border border-gray-200 hover:border-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={`w-9 h-9 rounded border text-sm font-medium transition-colors ${
                          p === page
                            ? 'bg-primary-900 text-white border-primary-900'
                            : 'border-gray-200 text-gray-700 hover:border-accent hover:text-accent'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === data.pagination.totalPages}
                      className="p-2 rounded border border-gray-200 hover:border-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
