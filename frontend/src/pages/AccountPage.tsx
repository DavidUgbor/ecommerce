import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User, MapPin, Plus, Pencil, Trash2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import Breadcrumb from '../components/Breadcrumb';

const AccountPage: React.FC = () => {
  const { user, fetchMe, updateProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
  });

  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    country: 'Nigeria',
    zipCode: '',
    isDefault: false,
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm);
      toast.success('Profile updated!');
      setIsEditing(false);
      setProfileForm({ ...profileForm, currentPassword: '', newPassword: '' });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Update failed');
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await api.put(`/auth/addresses/${editingAddress}`, addressForm);
        toast.success('Address updated!');
      } else {
        await api.post('/auth/addresses', addressForm);
        toast.success('Address added!');
      }
      await fetchMe();
      setIsAddingAddress(false);
      setEditingAddress(null);
      setAddressForm({ fullName: '', phone: '', street: '', city: '', state: '', country: 'Nigeria', zipCode: '', isDefault: false });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Delete this address?')) return;
    try {
      await api.delete(`/auth/addresses/${id}`);
      await fetchMe();
      toast.success('Address deleted');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed');
    }
  };

  const startEditAddress = (addr: any) => {
    setAddressForm({
      fullName: addr.fullName,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      country: addr.country,
      zipCode: addr.zipCode,
      isDefault: addr.isDefault,
    });
    setEditingAddress(addr.id);
    setIsAddingAddress(true);
  };

  return (
    <div className="min-h-screen bg-cream-DEFAULT">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'My Account' }]} />

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-primary-900 rounded-full flex items-center justify-center">
            <span className="text-cream-DEFAULT font-display font-bold text-2xl">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-primary-900">{user?.name}</h1>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-lg p-1 shadow-luxury mb-6 w-fit">
          {(['profile', 'addresses'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded text-sm font-medium transition-all capitalize ${
                activeTab === tab
                  ? 'bg-primary-900 text-white shadow-sm'
                  : 'text-gray-600 hover:text-primary-900'
              }`}
            >
              {tab === 'profile' ? <><User className="w-4 h-4 inline mr-1.5" />Profile</> : <><MapPin className="w-4 h-4 inline mr-1.5" />Addresses</>}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-luxury p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-display text-xl font-semibold text-primary-900">Profile Details</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm text-accent hover:text-accent-dark flex items-center gap-1.5 font-medium"
              >
                <Pencil className="w-4 h-4" />
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-900 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-900 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-sm font-semibold text-primary-900 mb-3">Change Password (optional)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-primary-900 mb-1">Current Password</label>
                      <input
                        type="password"
                        value={profileForm.currentPassword}
                        onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })}
                        className="input-field"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-900 mb-1">New Password</label>
                      <input
                        type="password"
                        value={profileForm.newPassword}
                        onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                        className="input-field"
                        placeholder="Enter new password"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="submit" className="btn-primary">
                    <Check className="w-4 h-4" />
                    Save Changes
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { label: 'Full Name', value: user?.name },
                  { label: 'Email', value: user?.email },
                  { label: 'Phone', value: user?.phone || 'Not set' },
                  { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '' },
                  { label: 'Account Type', value: user?.role === 'ADMIN' ? 'Administrator' : 'Customer' },
                ].map((field) => (
                  <div key={field.label}>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{field.label}</p>
                    <p className="font-medium text-primary-900 mt-0.5">{field.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-display text-xl font-semibold text-primary-900">Saved Addresses</h2>
              <button
                onClick={() => {
                  setEditingAddress(null);
                  setAddressForm({ fullName: '', phone: '', street: '', city: '', state: '', country: 'Nigeria', zipCode: '', isDefault: false });
                  setIsAddingAddress(!isAddingAddress);
                }}
                className="btn-primary text-sm py-2"
              >
                <Plus className="w-4 h-4" />
                Add Address
              </button>
            </div>

            {/* Add/Edit address form */}
            {isAddingAddress && (
              <div className="bg-white rounded-xl shadow-luxury p-6 mb-5">
                <h3 className="font-semibold text-primary-900 mb-4">
                  {editingAddress ? 'Edit Address' : 'New Address'}
                </h3>
                <form onSubmit={handleAddAddress}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { key: 'fullName', label: 'Full Name' },
                      { key: 'phone', label: 'Phone' },
                      { key: 'street', label: 'Street Address', full: true },
                      { key: 'city', label: 'City' },
                      { key: 'state', label: 'State' },
                      { key: 'country', label: 'Country' },
                      { key: 'zipCode', label: 'Zip Code' },
                    ].map((field) => (
                      <div key={field.key} className={field.full ? 'sm:col-span-2' : ''}>
                        <label className="block text-sm font-medium text-primary-900 mb-1">{field.label}</label>
                        <input
                          type="text"
                          value={(addressForm as any)[field.key]}
                          onChange={(e) => setAddressForm({ ...addressForm, [field.key]: e.target.value })}
                          className="input-field"
                          required
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <input
                      type="checkbox"
                      id="isDefaultNew"
                      checked={addressForm.isDefault}
                      onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                      className="accent-accent"
                    />
                    <label htmlFor="isDefaultNew" className="text-sm text-gray-600">Set as default address</label>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button type="submit" className="btn-primary">
                      {editingAddress ? 'Save Changes' : 'Add Address'}
                    </button>
                    <button type="button" onClick={() => { setIsAddingAddress(false); setEditingAddress(null); }} className="btn-secondary">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {!user?.addresses?.length ? (
              <div className="bg-white rounded-xl shadow-luxury p-8 text-center">
                <MapPin className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500">No saved addresses yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.addresses.map((addr: any) => (
                  <div key={addr.id} className="bg-white rounded-xl shadow-luxury p-5 relative">
                    {addr.isDefault && (
                      <span className="badge bg-accent/10 text-accent mb-2 inline-block">Default</span>
                    )}
                    <div className="text-sm space-y-0.5">
                      <p className="font-semibold text-primary-900">{addr.fullName}</p>
                      <p className="text-gray-600">{addr.street}</p>
                      <p className="text-gray-600">{addr.city}, {addr.state} {addr.zipCode}</p>
                      <p className="text-gray-600">{addr.country}</p>
                      <p className="text-gray-400">{addr.phone}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => startEditAddress(addr)}
                        className="flex items-center gap-1 text-xs text-accent hover:text-accent-dark transition-colors font-medium"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
