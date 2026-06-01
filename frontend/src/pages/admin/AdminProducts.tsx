import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Search, Package, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import LoadingSpinner from '../../components/LoadingSpinner';

interface ProductForm {
  name: string;
  description: string;
  price: string;
  comparePrice: string;
  stock: string;
  sku: string;
  categoryId: string;
  tags: string;
  featured: boolean;
  active: boolean;
}

const AdminProducts: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<ProductForm>({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    stock: '',
    sku: '',
    categoryId: '',
    tags: '',
    featured: false,
    active: true,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page, search],
    queryFn: () =>
      api.get(`/products?page=${page}&limit=20${search ? `&search=${search}` : ''}&active=`).then((r) => r.data),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: ProductForm) => api.post('/products', data),
    onSuccess: () => {
      toast.success('Product created!');
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || 'Failed');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductForm> }) =>
      api.put(`/products/${id}`, data),
    onSuccess: () => {
      toast.success('Product updated!');
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => {
      toast.success('Product deactivated');
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed');
    },
  });

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', comparePrice: '', stock: '', sku: '', categoryId: '', tags: '', featured: false, active: true });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (product: any) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      comparePrice: product.comparePrice?.toString() || '',
      stock: product.stock.toString(),
      sku: product.sku || '',
      categoryId: product.categoryId,
      tags: product.tags || '',
      featured: product.featured,
      active: product.active,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const products = data?.products || [];

  return (
    <div className="min-h-screen bg-cream-DEFAULT">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Nav */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { label: 'Dashboard', href: '/admin' },
            { label: 'Products', href: '/admin/products', active: true },
            { label: 'Orders', href: '/admin/orders' },
            { label: 'Users', href: '/admin/users' },
          ].map((item) => (
            <Link key={item.href} to={item.href} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${item.active ? 'bg-primary-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'}`}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-bold text-primary-900">Products</h1>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary text-sm">
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-luxury-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                <h2 className="font-display font-semibold text-primary-900 text-lg">
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-primary-900 mb-1">Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-primary-900 mb-1">Description *</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3}
                      className="input-field resize-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-900 mb-1">Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-900 mb-1">Compare Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.comparePrice}
                      onChange={(e) => setForm({ ...form, comparePrice: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-900 mb-1">Stock *</label>
                    <input
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-900 mb-1">SKU</label>
                    <input
                      type="text"
                      value={form.sku}
                      onChange={(e) => setForm({ ...form, sku: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-900 mb-1">Category *</label>
                    <select
                      value={form.categoryId}
                      onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                      className="input-field"
                      required
                    >
                      <option value="">Select category</option>
                      {(categories || []).map((cat: any) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-900 mb-1">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      className="input-field"
                      placeholder="leather,handmade,premium"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="accent-accent w-4 h-4"
                    />
                    <span className="text-sm font-medium text-primary-900">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={(e) => setForm({ ...form, active: e.target.checked })}
                      className="accent-accent w-4 h-4"
                    />
                    <span className="text-sm font-medium text-primary-900">Active</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="btn-primary"
                  >
                    <Check className="w-4 h-4" />
                    {editingId ? 'Update Product' : 'Create Product'}
                  </button>
                  <button type="button" onClick={resetForm} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-xl shadow-luxury p-5 mb-5">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
        </div>

        {/* Products table */}
        <div className="bg-white rounded-xl shadow-luxury overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-12"><LoadingSpinner /></div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500">No products found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((product: any) => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {product.images?.[0]?.url ? (
                              <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-4 h-4 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-primary-900 text-sm">{product.name}</p>
                            <p className="text-xs text-gray-400">{product.sku || 'No SKU'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600">{product.category?.name}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm font-semibold text-primary-900">${product.price.toFixed(2)}</p>
                          {product.comparePrice && (
                            <p className="text-xs text-gray-400 line-through">${product.comparePrice.toFixed(2)}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-sm font-medium ${product.stock === 0 ? 'text-red-600' : product.stock <= 10 ? 'text-orange-600' : 'text-green-600'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`badge text-xs ${product.active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {product.active ? 'Active' : 'Inactive'}
                          </span>
                          {product.featured && (
                            <span className="badge bg-accent/10 text-accent text-xs">Featured</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-1.5 text-gray-400 hover:text-accent transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Deactivate this product?')) {
                                deleteMutation.mutate(product.id);
                              }
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-5">
            {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded border text-sm font-medium transition-colors ${p === page ? 'bg-primary-900 text-white border-primary-900' : 'border-gray-200 text-gray-700 hover:border-accent'}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
