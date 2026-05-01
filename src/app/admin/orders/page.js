'use client';
import { useState, useEffect } from 'react';
import { Eye, Package, Clock, CheckCircle, Truck, XCircle, Search, Filter, Trash2, X, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o.id !== orderId));
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedOrder(data);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'processing': return <Package className="w-4 h-4 text-blue-500" />;
      case 'shipped': return <Truck className="w-4 h-4 text-purple-500" />;
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const filteredOrders = orders.filter(o => 
    o.order_number.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#fbfbfd] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-12 py-10 sticky top-0 z-40 bg-[#fbfbfd]/90 backdrop-blur-md gap-6">
        <div>
          <p className="text-[0.75rem] uppercase tracking-wider text-[#86868b] font-semibold mb-1">Commerce / Logistics</p>
          <h1 className="text-3xl font-heading text-[#1d1d1f]">Masterpiece Registry</h1>
        </div>
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="relative group flex-1 md:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b] transition-colors group-focus-within:text-[#0071e3]" />
            <input 
              type="text" 
              placeholder="Search registry..." 
              className="bg-white border border-black/10 px-12 py-2.5 rounded-full text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 w-full md:w-[300px] transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="bg-white border border-black/10 text-[#1d1d1f] px-6 py-2.5 rounded-full text-[0.85rem] font-semibold hover:bg-black/5 transition-all flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-12 pb-20">
        <div className="bg-white border border-black/10 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f5f5f7] border-b border-black/10">
                  <th className="px-8 py-5 text-[0.7rem] uppercase tracking-widest text-[#86868b] font-bold">Order #</th>
                  <th className="px-8 py-5 text-[0.7rem] uppercase tracking-widest text-[#86868b] font-bold">Consignee</th>
                  <th className="px-8 py-5 text-[0.7rem] uppercase tracking-widest text-[#86868b] font-bold">Investment</th>
                  <th className="px-8 py-5 text-[0.7rem] uppercase tracking-widest text-[#86868b] font-bold">Status</th>
                  <th className="px-8 py-5 text-[0.7rem] uppercase tracking-widest text-[#86868b] font-bold">Date</th>
                  <th className="px-8 py-5 text-[0.7rem] uppercase tracking-widest text-[#86868b] font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-8 py-20 text-center">
                      <div className="w-8 h-8 rounded-full border-4 border-[#0071e3]/20 border-t-[#0071e3] animate-spin mx-auto"></div>
                      <p className="text-[0.85rem] text-[#86868b] mt-4 font-medium">Scanning the registry...</p>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-8 py-20 text-center">
                      <div className="text-4xl mb-4 opacity-20">📦</div>
                      <p className="text-[0.95rem] text-[#1d1d1f] font-bold">No reservations found</p>
                      <p className="text-[0.85rem] text-[#86868b] mt-1">The commerce gallery is awaiting its first patron.</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#fbfbfd] transition-colors group">
                      <td className="px-8 py-6">
                        <span className="text-[0.9rem] font-mono font-bold text-[#1d1d1f]">{order.order_number}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-[0.9rem] font-bold text-[#1d1d1f]">{order.customer_name}</span>
                          <span className="text-[0.75rem] text-[#86868b]">{order.customer_email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[0.9rem] font-bold text-[#1d1d1f]">₹{parseFloat(order.total_amount).toLocaleString()}</span>
                      </td>
                      <td className="px-8 py-6">
                        <select 
                          value={order.status}
                          disabled={updating}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          className={`text-[0.7rem] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full border-none focus:ring-2 focus:ring-[#0071e3]/20 transition-all cursor-pointer ${
                            order.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-600' :
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-600' :
                            order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                            'bg-red-100 text-red-600'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[0.85rem] text-[#86868b]">{new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => viewOrderDetails(order.id)}
                            className="p-2.5 rounded-xl bg-[#f5f5f7] text-[#1d1d1f] hover:bg-black hover:text-white transition-all shadow-sm"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-2.5 rounded-xl bg-[#fff2f2] text-[#ff3b30] hover:bg-[#ff3b30] hover:text-white transition-all shadow-sm"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in zoom-in duration-300 no-scrollbar">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-10 py-8 border-b border-black/5 flex justify-between items-center z-10">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h2 className="text-2xl font-bold font-heading text-[#1d1d1f]">Reservation {selectedOrder.order_number}</h2>
                  <div className={`text-[0.65rem] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full ${
                    selectedOrder.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                    selectedOrder.status === 'processing' ? 'bg-blue-100 text-blue-600' :
                    selectedOrder.status === 'shipped' ? 'bg-purple-100 text-purple-600' :
                    selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {selectedOrder.status}
                  </div>
                </div>
                <p className="text-[0.85rem] text-[#86868b] font-medium">Logged on {new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-black/5 hover:bg-black hover:text-white rounded-full transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-10 space-y-12">
              {/* Client & Shipping Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-[0.7rem] uppercase tracking-widest font-bold text-[#86868b] mb-6">Consignee Profile</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[0.8rem] text-[#86868b] mb-0.5">Legal Name</p>
                      <p className="text-[1rem] font-bold text-[#1d1d1f]">{selectedOrder.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-[0.8rem] text-[#86868b] mb-0.5">Email Address</p>
                      <p className="text-[1rem] font-bold text-[#1d1d1f]">{selectedOrder.customer_email}</p>
                    </div>
                    <div>
                      <p className="text-[0.8rem] text-[#86868b] mb-0.5">Direct Line</p>
                      <p className="text-[1rem] font-bold text-[#1d1d1f]">{selectedOrder.customer_phone}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-[0.7rem] uppercase tracking-widest font-bold text-[#86868b] mb-6">Destination Protocol</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[0.8rem] text-[#86868b] mb-0.5">Street Address</p>
                      <p className="text-[1rem] font-bold text-[#1d1d1f]">{selectedOrder.shipping_address}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[0.8rem] text-[#86868b] mb-0.5">City</p>
                        <p className="text-[1rem] font-bold text-[#1d1d1f]">{selectedOrder.shipping_city}</p>
                      </div>
                      <div>
                        <p className="text-[0.8rem] text-[#86868b] mb-0.5">State/ZIP</p>
                        <p className="text-[1rem] font-bold text-[#1d1d1f]">{selectedOrder.shipping_state}, {selectedOrder.shipping_zip}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-[0.7rem] uppercase tracking-widest font-bold text-[#86868b] mb-6">Masterpiece Manifest</h3>
                <div className="border border-black/5 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full">
                    <thead className="bg-[#f5f5f7]">
                      <tr>
                        <th className="px-6 py-4 text-[0.65rem] uppercase tracking-widest font-bold text-[#86868b]">Product</th>
                        <th className="px-6 py-4 text-[0.65rem] uppercase tracking-widest font-bold text-[#86868b] text-center">Unit Price</th>
                        <th className="px-6 py-4 text-[0.65rem] uppercase tracking-widest font-bold text-[#86868b] text-center">Qty</th>
                        <th className="px-6 py-4 text-[0.65rem] uppercase tracking-widest font-bold text-[#86868b] text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {selectedOrder.items?.map((item) => (
                        <tr key={item.id} className="hover:bg-[#fbfbfd]">
                          <td className="px-6 py-4 font-bold text-[0.9rem] text-[#1d1d1f]">{item.product_name}</td>
                          <td className="px-6 py-4 text-center font-medium">₹{parseFloat(item.price).toLocaleString()}</td>
                          <td className="px-6 py-4 text-center font-bold">{item.quantity}</td>
                          <td className="px-6 py-4 text-right font-bold">₹{parseFloat(item.total).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-[#f5f5f7]/50">
                      {selectedOrder.coupon_code && parseFloat(selectedOrder.discount_amount) > 0 && (
                        <>
                          <tr className="border-t border-black/5">
                            <td colSpan="3" className="px-6 py-3 text-[0.7rem] uppercase tracking-widest font-bold text-[#86868b] text-right">Subtotal</td>
                            <td className="px-6 py-3 text-right text-[0.95rem] font-bold text-[#1d1d1f]">
                              ₹{(parseFloat(selectedOrder.total_amount) + parseFloat(selectedOrder.discount_amount)).toLocaleString()}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="3" className="px-6 py-3 text-right">
                              <div className="flex items-center justify-end gap-3">
                                <span className="text-[0.7rem] uppercase tracking-widest font-bold text-green-600">Coupon Discount</span>
                                <span className="font-mono font-bold text-[0.75rem] text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg">🎫 {selectedOrder.coupon_code}</span>
                              </div>
                            </td>
                            <td className="px-6 py-3 text-right text-[0.95rem] font-bold text-green-600">
                              - ₹{parseFloat(selectedOrder.discount_amount).toLocaleString()}
                            </td>
                          </tr>
                        </>
                      )}
                      <tr className="border-t border-black/10">
                        <td colSpan="3" className="px-6 py-5 text-[0.7rem] uppercase tracking-widest font-bold text-[#86868b] text-right">Total Charged</td>
                        <td className="px-6 py-5 text-right text-xl font-heading font-bold text-[var(--color-accent)]">₹{parseFloat(selectedOrder.total_amount).toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-6 border-t border-black/5">
                <div className="flex items-center gap-3">
                  <span className="text-[0.75rem] font-bold text-[#86868b] uppercase tracking-widest">Update Lifecycle:</span>
                  <div className="flex bg-[#f5f5f7] rounded-full p-1 border border-black/5">
                    {['pending', 'processing', 'shipped', 'delivered'].map(s => (
                      <button 
                        key={s}
                        onClick={() => handleUpdateStatus(selectedOrder.id, s)}
                        className={`px-4 py-1.5 rounded-full text-[0.6rem] uppercase tracking-[0.2em] font-bold transition-all ${selectedOrder.status === s ? 'bg-black text-white shadow-md' : 'text-[#86868b] hover:text-black'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteOrder(selectedOrder.id)}
                  className="px-6 py-3 bg-[#fff2f2] text-[#ff3b30] text-[0.7rem] uppercase tracking-[0.3em] font-bold rounded-xl hover:bg-[#ff3b30] hover:text-white transition-all shadow-sm flex items-center gap-3"
                >
                  <Trash2 className="w-4 h-4" /> Purge Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
