'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  ShoppingBag,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Package,
  ExternalLink,
  X,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';

export default function MyAccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [isLogin, setIsLogin] = useState(true);

  // Auth Form State
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: ''
  });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Modal & Detail State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    address_type: 'shipping',
    address_line: '',
    city: '',
    state: '',
    zip: '',
    is_default: false
  });
  const [addressLoading, setAddressLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/customer/me');
      if (res.ok) {
        const data = await res.json();
        setCustomer(data);
        fetchOrders();
      } else {
        setCustomer(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/customer/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const openAddressModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setAddressForm({
        address_type: address.address_type,
        address_line: address.address_line,
        city: address.city,
        state: address.state,
        zip: address.zip,
        is_default: address.is_default
      });
    } else {
      setEditingAddress(null);
      setAddressForm({
        address_type: 'shipping',
        address_line: '',
        city: '',
        state: '',
        zip: '',
        is_default: false
      });
    }
    setIsAddressModalOpen(true);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setAddressLoading(true);
    try {
      const method = editingAddress ? 'PUT' : 'POST';
      const body = editingAddress ? { ...addressForm, id: editingAddress.id } : addressForm;

      const res = await fetch('/api/customer/addresses', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setIsAddressModalOpen(false);
        fetchProfile(); // Refresh profile to get updated addresses
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save address');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setAddressLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!confirm('Are you sure you want to remove this address?')) return;
    try {
      const res = await fetch(`/api/customer/addresses?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProfile();
      } else {
        alert('Failed to delete address');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/customer/logout', { method: 'POST' });
    window.location.href = '/my-account';
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    const endpoint = isLogin ? '/api/customer/login' : '/api/customer/register';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      const data = await res.json();
      if (res.ok) {
        window.location.reload();
      } else {
        setAuthError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setAuthError('An error occurred. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 rounded-full border-4 border-[var(--color-accent)]/20 border-t-[var(--color-accent)] animate-spin"></div>
      </div>
    );
  }

  // Guest View: Login / Register
  if (!customer) {
    return (
      <div className="min-h-screen pt-16 pb-16 bg-[#FBFBFD] px-6">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-heading mb-4 italic">The Heritage Registry</h1>
            <p className="text-[var(--color-text-secondary)] uppercase tracking-[0.3em] text-[0.65rem] font-bold">Access your exclusive collection and preferences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            {/* Login */}
            <div className="bg-white p-10 md:p-12 border border-black/5 shadow-sm rounded-sm">
              <h2 className="text-2xl font-heading mb-8 italic">Sign In</h2>
              <form onSubmit={handleAuthSubmit} className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-black/40">Email Address</label>
                  <input
                    type="email"
                    required
                    className="bg-[#f5f5f7] border-none px-5 py-4 rounded-sm text-[0.9rem] focus:bg-white focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none"
                    value={authForm.email}
                    onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-black/40">Password</label>
                  <input
                    type="password"
                    required
                    className="bg-[#f5f5f7] border-none px-5 py-4 rounded-sm text-[0.9rem] focus:bg-white focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none"
                    value={authForm.password}
                    onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                  />
                </div>
                {isLogin && authError && <p className="text-red-500 text-xs font-medium">{authError}</p>}
                <button
                  type="submit"
                  disabled={authLoading}
                  onClick={() => setIsLogin(true)}
                  className="w-full py-5 bg-black text-white text-[0.7rem] uppercase tracking-[0.4em] font-bold hover:bg-[var(--color-accent)] transition-all disabled:opacity-50"
                >
                  {authLoading && isLogin ? 'Identifying...' : 'Establish Connection'}
                </button>
              </form>
            </div>

            {/* Register */}
            <div className="bg-white p-10 md:p-12 border border-black/5 shadow-sm rounded-sm">
              <h2 className="text-2xl font-heading mb-8 italic">New Patron</h2>
              <form onSubmit={handleAuthSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-black/40">First Name</label>
                    <input
                      type="text"
                      required
                      className="bg-[#f5f5f7] border-none px-5 py-4 rounded-sm text-[0.9rem] focus:bg-white focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none"
                      value={authForm.first_name}
                      onChange={e => setAuthForm({ ...authForm, first_name: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-black/40">Last Name</label>
                    <input
                      type="text"
                      className="bg-[#f5f5f7] border-none px-5 py-4 rounded-sm text-[0.9rem] focus:bg-white focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none"
                      value={authForm.last_name}
                      onChange={e => setAuthForm({ ...authForm, last_name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-black/40">Email Address</label>
                  <input
                    type="email"
                    required
                    className="bg-[#f5f5f7] border-none px-5 py-4 rounded-sm text-[0.9rem] focus:bg-white focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none"
                    value={authForm.email}
                    onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-black/40">Choose Password</label>
                  <input
                    type="password"
                    required
                    className="bg-[#f5f5f7] border-none px-5 py-4 rounded-sm text-[0.9rem] focus:bg-white focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none"
                    value={authForm.password}
                    onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                  />
                </div>
                {!isLogin && authError && <p className="text-red-500 text-xs font-medium">{authError}</p>}
                <button
                  type="submit"
                  disabled={authLoading}
                  onClick={() => setIsLogin(false)}
                  className="w-full py-5 bg-white text-black border border-black/10 text-[0.7rem] uppercase tracking-[0.4em] font-bold hover:bg-black hover:text-white transition-all disabled:opacity-50"
                >
                  {authLoading && !isLogin ? 'Registering...' : 'Become a Patron'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged In View
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: User },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'account', label: 'Account Details', icon: Settings },
  ];

  return (
    <>
      <div className="min-h-screen pt-16 pb-16 bg-[#FBFBFD] px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-16">

            {/* Sidebar Navigation */}
            <aside className="lg:w-80 space-y-2">
              <div className="mb-10 px-4">
                <p className="text-[var(--color-text-secondary)] uppercase tracking-[0.3em] text-[0.6rem] font-bold mb-2">Welcome Back,</p>
                <h1 className="text-3xl font-heading italic truncate">{customer.first_name} {customer.last_name}</h1>
              </div>

              <nav className="flex flex-col">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center cursor-pointer gap-4 px-6 py-5 text-[0.75rem] uppercase tracking-[0.2em] font-bold transition-all border-l-2 text-left ${activeTab === tab.id
                      ? 'bg-white border-black text-black'
                      : 'border-transparent text-black/30 hover:text-black hover:bg-black/5'
                      }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex cursor-pointer items-center gap-4 px-6 py-5 text-[0.75rem] uppercase tracking-[0.2em] font-bold text-[#ff3b30] hover:bg-[#ff3b30]/5 transition-all border-l-2 border-transparent text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 bg-white p-8 md:p-12 border border-black/5 shadow-sm rounded-sm min-h-[600px]">
              {activeTab === 'dashboard' && (
                <div className="space-y-10 animate-in fade-in duration-500">
                  <div className="max-w-2xl">
                    <h2 className="text-3xl font-heading mb-6 italic">Heritage Dashboard</h2>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed mb-8">
                      Hello <span className="font-bold text-black">{customer.first_name}</span> (not you? <button onClick={handleLogout} className="text-[var(--color-accent)] font-bold underline cursor-pointer">Logout</button>)
                    </p>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                      From your account dashboard you can view your <button onClick={() => setActiveTab('orders')} className="text-[var(--color-accent)] font-bold cursor-pointer">recent orders</button>, manage your <button onClick={() => setActiveTab('addresses')} className="text-[var(--color-accent)] font-bold cursor-pointer">shipping and billing addresses</button>, and <button onClick={() => setActiveTab('account')} className="text-[var(--color-accent)] font-bold cursor-pointer">edit your password and account details</button>.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-black/5">
                    <div className="p-6 bg-[#f5f5f7] rounded-sm flex flex-col gap-4 group cursor-pointer hover:bg-black hover:text-white transition-all" onClick={() => setActiveTab('orders')}>
                      <ShoppingBag className="w-8 h-8 opacity-20" />
                      <div className="flex items-center justify-between">
                        <span className="text-[0.65rem] uppercase tracking-[0.2em] font-bold">Recent Orders</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="p-6 bg-[#f5f5f7] rounded-sm flex flex-col gap-4 group cursor-pointer hover:bg-black hover:text-white transition-all" onClick={() => setActiveTab('addresses')}>
                      <MapPin className="w-8 h-8 opacity-20" />
                      <div className="flex items-center justify-between">
                        <span className="text-[0.65rem] uppercase tracking-[0.2em] font-bold">Manage Addresses</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="p-6 bg-[#f5f5f7] rounded-sm flex flex-col gap-4 group cursor-pointer hover:bg-black hover:text-white transition-all" onClick={() => setActiveTab('account')}>
                      <Settings className="w-8 h-8 opacity-20" />
                      <div className="flex items-center justify-between">
                        <span className="text-[0.65rem] uppercase tracking-[0.2em] font-bold">Profile Settings</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <h2 className="text-3xl font-heading mb-8 italic">Order History</h2>
                  {orders.length === 0 ? (
                    <div className="py-20 text-center bg-[#f5f5f7] rounded-sm">
                      <Package className="w-12 h-12 mx-auto mb-4 opacity-10" />
                      <p className="text-[var(--color-text-secondary)] text-[0.8rem] mb-6">No orders have been placed yet.</p>
                      <Link href="/product-category" className="inline-block bg-black text-white px-8 py-4 text-[0.6rem] uppercase tracking-[0.3em] font-bold hover:bg-[var(--color-accent)] transition-all">
                        Browse Masterpieces
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-black/10">
                            <th className="py-4 text-[0.65rem] uppercase tracking-widest font-bold text-black/40">Order</th>
                            <th className="py-4 text-[0.65rem] uppercase tracking-widest font-bold text-black/40">Date</th>
                            <th className="py-4 text-[0.65rem] uppercase tracking-widest font-bold text-black/40">Status</th>
                            <th className="py-4 text-[0.65rem] uppercase tracking-widest font-bold text-black/40">Total</th>
                            <th className="py-4 text-right text-[0.65rem] uppercase tracking-widest font-bold text-black/40">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                          {orders.map(order => (
                            <tr key={order.id} className="group">
                              <td className="py-6 font-bold text-[0.9rem]">#{order.order_number}</td>
                              <td className="py-6 text-[0.85rem] text-black/60">{new Date(order.created_at).toLocaleDateString()}</td>
                              <td className="py-6">
                                <span className={`text-[0.6rem] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${order.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                                  order.status === 'processing' ? 'bg-blue-100 text-blue-600' :
                                    order.status === 'shipped' ? 'bg-purple-100 text-purple-600' :
                                      order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                                        'bg-red-100 text-red-600'
                                  }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="py-6 font-bold text-[0.9rem]">₹{parseFloat(order.total_amount).toLocaleString()}</td>
                              <td className="py-6 text-right">
                                <button
                                  onClick={() => handleViewOrder(order)}
                                  className="text-[var(--color-accent)] font-bold text-[0.7rem] uppercase tracking-widest flex items-center justify-end gap-2 hover:opacity-70 ml-auto cursor-pointer"
                                >
                                  View <ExternalLink className="w-3 h-3" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="space-y-10 animate-in fade-in duration-500">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-heading italic">Shipping Addresses</h2>
                    <button
                      onClick={() => openAddressModal()}
                      className="flex cursor-pointer items-center gap-2 bg-black text-white px-6 py-3 text-[0.6rem] uppercase tracking-[0.2em] font-bold hover:bg-[var(--color-accent)] transition-all"
                    >
                      <Plus className="w-4 h-4" /> Add Protocol
                    </button>
                  </div>
                  <p className="text-[var(--color-text-secondary)] leading-relaxed">
                    The following addresses will be used on the checkout page by default.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6">
                    {customer.addresses?.map(addr => (
                      <div key={addr.id} className="space-y-6 bg-[#f5f5f7]/50 p-8 border border-black/5 rounded-sm group hover:bg-white hover:shadow-lg transition-all duration-500">
                        <div className="flex items-center justify-between pb-4 border-b border-black/5">
                          <div className="flex items-center gap-3">
                            <h3 className="text-[0.75rem] uppercase tracking-widest font-bold text-black">{addr.address_type} Protocol</h3>
                            {addr.is_default && <span className="text-[0.5rem] bg-black text-white px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">Default</span>}
                          </div>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => openAddressModal(addr)}
                              className="text-[#86868b] cursor-pointer hover:text-black transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="text-[#86868b] cursor-pointer hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-[0.9rem] leading-relaxed text-black/60 space-y-1 italic">
                          <p className="font-bold text-black not-italic">{customer.first_name} {customer.last_name}</p>
                          <p>{addr.address_line}</p>
                          <p>{addr.city}, {addr.state} {addr.zip}</p>
                          <p className="pt-2">India</p>
                        </div>
                      </div>
                    ))}

                    {(!customer.addresses || customer.addresses.length === 0) && (
                      <div className="col-span-2 py-20 text-center bg-[#f5f5f7] rounded-sm">
                        <MapPin className="w-12 h-12 mx-auto mb-4 opacity-10" />
                        <p className="text-[0.8rem] italic text-black/40">No shipping addresses recorded in the registry.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'account' && (
                <div className="space-y-10 animate-in fade-in duration-500">
                  <h2 className="text-3xl font-heading mb-8 italic">Account Integrity</h2>

                  <form className="space-y-8 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex flex-col gap-2">
                        <label className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-black/40">First Name</label>
                        <input
                          type="text"
                          defaultValue={customer.first_name}
                          className="bg-[#f5f5f7] border-none px-5 py-4 rounded-sm text-[0.9rem] focus:bg-white focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-black/40">Last Name</label>
                        <input
                          type="text"
                          defaultValue={customer.last_name}
                          className="bg-[#f5f5f7] border-none px-5 py-4 rounded-sm text-[0.9rem] focus:bg-white focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-black/40">Email Address (Registry Key)</label>
                      <input
                        type="email"
                        defaultValue={customer.email}
                        disabled
                        className="bg-[#f5f5f7] border-none px-5 py-4 rounded-sm text-[0.9rem] opacity-50 cursor-not-allowed outline-none"
                      />
                    </div>

                    <div className="pt-10 border-t border-black/5 space-y-8">
                      <h3 className="text-[0.75rem] uppercase tracking-widest font-bold text-black">Password Evolution</h3>

                      <div className="flex flex-col gap-2">
                        <label className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-black/40">Current Cipher</label>
                        <input
                          type="password"
                          className="bg-[#f5f5f7] border-none px-5 py-4 rounded-sm text-[0.9rem] focus:bg-white focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-black/40">New Cipher</label>
                        <input
                          type="password"
                          className="bg-[#f5f5f7] border-none px-5 py-4 rounded-sm text-[0.9rem] focus:bg-white focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-black/40">Confirm New Cipher</label>
                        <input
                          type="password"
                          className="bg-[#f5f5f7] border-none px-5 py-4 rounded-sm text-[0.9rem] focus:bg-white focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="cursor-pointer bg-black text-white px-12 py-5 text-[0.7rem] uppercase tracking-[0.4em] font-bold hover:bg-[var(--color-accent)] transition-all shadow-xl"
                    >
                      Commit Changes
                    </button>
                  </form>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {isOrderModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setIsOrderModalOpen(false)} />
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in zoom-in duration-300 no-scrollbar">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-10 py-8 border-b border-black/5 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold font-heading text-[#1d1d1f]">Reservation Detail</h2>
                <p className="text-[0.85rem] text-[#86868b] font-medium uppercase tracking-widest">Order Number: {selectedOrder.order_number}</p>
              </div>
              <button onClick={() => setIsOrderModalOpen(false)} className="p-3 bg-black/5 hover:bg-black hover:text-white rounded-full transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="space-y-6">
                  <h3 className="text-[0.7rem] uppercase tracking-widest font-bold text-[#86868b] border-b border-black/5 pb-2">Consignee Information</h3>
                  <div className="text-[0.9rem] leading-relaxed text-black/60 italic">
                    <p className="font-bold text-black not-italic">{selectedOrder.customer_name}</p>
                    <p>{selectedOrder.customer_email}</p>
                    {selectedOrder.customer_phone && <p>{selectedOrder.customer_phone}</p>}
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-[0.7rem] uppercase tracking-widest font-bold text-[#86868b] border-b border-black/5 pb-2">Logistics Destination</h3>
                  <div className="text-[0.9rem] leading-relaxed text-black/60 italic">
                    <p>{selectedOrder.shipping_address}</p>
                    <p>{selectedOrder.shipping_city}, {selectedOrder.shipping_state} {selectedOrder.shipping_zip}</p>
                    <p className="pt-2 text-[0.8rem]">India</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-[0.7rem] uppercase tracking-widest font-bold text-[#86868b] border-b border-black/5 pb-2">Reservation Status</h3>
                  <div className="flex flex-col gap-3">
                    <span className={`text-[0.65rem] uppercase tracking-widest font-bold px-4 py-2 rounded-full w-fit ${selectedOrder.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                      selectedOrder.status === 'processing' ? 'bg-blue-100 text-blue-600' :
                        selectedOrder.status === 'shipped' ? 'bg-purple-100 text-purple-600' :
                          selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-600' :
                            'bg-red-100 text-red-600'
                      }`}>
                      {selectedOrder.status}
                    </span>
                    <p className="text-[0.75rem] text-[#86868b] font-medium italic">Protocol initiated on {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[0.7rem] uppercase tracking-widest font-bold text-[#86868b] border-b border-black/5 pb-2">Masterpiece Manifest</h3>
                <div className="space-y-6">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#f5f5f7] rounded-sm flex items-center justify-center font-bold text-[0.6rem] text-black/20">ART</div>
                        <div>
                          <p className="text-[0.85rem] font-bold text-[#1d1d1f] uppercase tracking-wider">{item.product_name}</p>
                          <p className="text-[0.75rem] text-[#86868b]">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-bold text-[0.9rem]">₹{parseFloat(item.total).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t border-black/5 space-y-2">
                  <div className="flex justify-between text-[0.9rem]">
                    <span className="text-[#86868b]">Subtotal</span>
                    <span>₹{(parseFloat(selectedOrder.total_amount) + parseFloat(selectedOrder.discount_amount || 0)).toLocaleString()}</span>
                  </div>
                  {selectedOrder.discount_amount > 0 && (
                    <div className="flex justify-between text-[0.9rem] text-green-600">
                      <span>Coupon Discount ({selectedOrder.coupon_code})</span>
                      <span>- ₹{parseFloat(selectedOrder.discount_amount).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold pt-4 border-t border-black/5">
                    <span className="font-heading italic">Total Investment</span>
                    <span>₹{parseFloat(selectedOrder.total_amount).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Address Edit/Add Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setIsAddressModalOpen(false)} />
          <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
            <div className="px-10 py-8 border-b border-black/5 flex justify-between items-center">
              <h2 className="text-xl font-bold font-heading text-[#1d1d1f]">{editingAddress ? 'Edit Protocol' : 'New Destination Protocol'}</h2>
              <button onClick={() => setIsAddressModalOpen(false)} className="p-2 hover:bg-black/5 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddressSubmit} className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.6rem] uppercase tracking-widest font-bold text-black/40">Protocol Type</label>
                  <select
                    className="bg-[#f5f5f7] border-none px-4 py-3 rounded-lg text-[0.85rem] outline-none focus:ring-1 focus:ring-black"
                    value={addressForm.address_type}
                    onChange={e => setAddressForm({ ...addressForm, address_type: e.target.value })}
                  >
                    <option value="shipping">Shipping</option>
                    <option value="billing">Billing</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[0.6rem] uppercase tracking-widest font-bold text-black/40">ZIP / Postal</label>
                  <input
                    type="text" required
                    className="bg-[#f5f5f7] border-none px-4 py-3 rounded-lg text-[0.85rem] outline-none focus:ring-1 focus:ring-black"
                    value={addressForm.zip}
                    onChange={e => setAddressForm({ ...addressForm, zip: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[0.6rem] uppercase tracking-widest font-bold text-black/40">Street Address</label>
                <input
                  type="text" required
                  className="bg-[#f5f5f7] border-none px-4 py-3 rounded-lg text-[0.85rem] outline-none focus:ring-1 focus:ring-black"
                  value={addressForm.address_line}
                  onChange={e => setAddressForm({ ...addressForm, address_line: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.6rem] uppercase tracking-widest font-bold text-black/40">City</label>
                  <input
                    type="text" required
                    className="bg-[#f5f5f7] border-none px-4 py-3 rounded-lg text-[0.85rem] outline-none focus:ring-1 focus:ring-black"
                    value={addressForm.city}
                    onChange={e => setAddressForm({ ...addressForm, city: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[0.6rem] uppercase tracking-widest font-bold text-black/40">State</label>
                  <input
                    type="text" required
                    className="bg-[#f5f5f7] border-none px-4 py-3 rounded-lg text-[0.85rem] outline-none focus:ring-1 focus:ring-black"
                    value={addressForm.state}
                    onChange={e => setAddressForm({ ...addressForm, state: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="is_default"
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                  checked={addressForm.is_default}
                  onChange={e => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                />
                <label htmlFor="is_default" className="text-[0.75rem] font-medium text-black/60 cursor-pointer">Set as primary protocol</label>
              </div>

              <button
                type="submit"
                disabled={addressLoading}
                className="cursor-pointer w-full py-4 bg-black text-white text-[0.7rem] uppercase tracking-[0.3em] font-bold hover:bg-[var(--color-accent)] transition-all rounded-lg mt-4 disabled:opacity-50"
              >
                {addressLoading ? 'Syncing...' : (editingAddress ? 'Update Protocol' : 'Record Protocol')}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

