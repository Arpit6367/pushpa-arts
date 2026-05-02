'use client';
import { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, ShoppingBag, Search, Filter, ChevronRight, UserPlus, X, MapPin, Package } from 'lucide-react';
import Link from 'next/link';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPatron, setSelectedPatron] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/admin/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const viewPatronDetails = async (patronId) => {
    setFetchingDetails(true);
    try {
      const res = await fetch(`/api/admin/customers/${patronId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedPatron(data);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingDetails(false);
    }
  };

  const filteredCustomers = customers.filter(c =>
    (c.first_name + ' ' + c.last_name).toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone && c.phone.includes(search))
  );

  return (
    <div className="bg-[#fbfbfd] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-12 py-10 sticky top-0 z-40 bg-[#fbfbfd]/90 backdrop-blur-md gap-6">
        <div>
          <p className="text-[0.75rem] uppercase tracking-wider text-[#86868b] font-semibold mb-1">Curation / CRM</p>
          <h1 className="text-3xl font-heading text-[#1d1d1f]">Patron Directory</h1>
        </div>
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="relative group flex-1 md:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b] transition-colors group-focus-within:text-[#0071e3]" />
            <input
              type="text"
              placeholder="Search patrons..."
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
                  <th className="px-8 py-5 text-[0.7rem] uppercase tracking-widest text-[#86868b] font-bold">Patron Info</th>
                  <th className="px-8 py-5 text-[0.7rem] uppercase tracking-widest text-[#86868b] font-bold">Contact</th>
                  <th className="px-8 py-5 text-[0.7rem] uppercase tracking-widest text-[#86868b] font-bold">Loyalty</th>
                  <th className="px-8 py-5 text-[0.7rem] uppercase tracking-widest text-[#86868b] font-bold">Investment</th>
                  <th className="px-8 py-5 text-[0.7rem] uppercase tracking-widest text-[#86868b] font-bold">Registry Date</th>
                  <th className="px-8 py-5 text-[0.7rem] uppercase tracking-widest text-[#86868b] font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-8 py-20 text-center">
                      <div className="w-8 h-8 rounded-full border-4 border-[#0071e3]/20 border-t-[#0071e3] animate-spin mx-auto"></div>
                      <p className="text-[0.85rem] text-[#86868b] mt-4 font-medium">Reading customer registry...</p>
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-8 py-20 text-center">
                      <div className="text-4xl mb-4 opacity-20">👥</div>
                      <p className="text-[0.95rem] text-[#1d1d1f] font-bold">No patrons found</p>
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((patron) => (
                    <tr key={patron.id} className="hover:bg-[#fbfbfd] transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[var(--color-accent)] font-bold">
                            {patron.first_name[0]}{patron.last_name[0] || ''}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.9rem] font-bold text-[#1d1d1f]">{patron.first_name} {patron.last_name}</span>
                            <span className="text-[0.7rem] text-[#86868b] uppercase tracking-wider font-semibold">ID: #{patron.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-[0.85rem] text-[#1d1d1f]">
                            <Mail className="w-3 h-3 text-[#86868b]" /> {patron.email}
                          </div>
                          {patron.phone && (
                            <div className="flex items-center gap-2 text-[0.85rem] text-[#86868b]">
                              <Phone className="w-3 h-3" /> {patron.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-[#86868b]" />
                          <span className="text-[0.9rem] font-bold text-[#1d1d1f]">{patron.order_count} Reservations</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[0.9rem] font-bold text-[#1d1d1f]">₹{parseFloat(patron.total_spend || 0).toLocaleString()}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-[0.85rem] text-[#86868b]">
                          <Calendar className="w-3 h-3" /> {new Date(patron.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={() => viewPatronDetails(patron.id)}
                          disabled={fetchingDetails}
                          className="p-2.5 rounded-xl bg-[#f5f5f7] text-[#1d1d1f] hover:bg-black hover:text-white transition-all shadow-sm disabled:opacity-50"
                        >
                          <ChevronRight className={`w-4 h-4 ${fetchingDetails ? 'animate-pulse' : ''}`} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Patron Detail Modal */}
      {isModalOpen && selectedPatron && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in zoom-in duration-300 no-scrollbar">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-10 py-8 border-b border-black/5 flex justify-between items-center z-10">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-[#f5f5f7] flex items-center justify-center text-2xl text-[var(--color-accent)] font-bold shadow-inner">
                  {selectedPatron.first_name[0]}{selectedPatron.last_name[0] || ''}
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-heading text-[#1d1d1f]">{selectedPatron.first_name} {selectedPatron.last_name}</h2>
                  <p className="text-[0.85rem] text-[#86868b] font-medium uppercase tracking-widest">Patron Registry Key: #{selectedPatron.id}</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-black/5 hover:bg-black hover:text-white rounded-full transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-10 space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
                  <section>
                    <h3 className="text-[0.7rem] uppercase tracking-widest font-bold text-[#86868b] mb-6 border-b border-black/5 pb-2">Primary Contact</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-[0.9rem]">
                        <Mail className="w-4 h-4 text-[#86868b]" />
                        <span className="font-medium">{selectedPatron.email}</span>
                      </div>
                      {selectedPatron.phone && (
                        <div className="flex items-center gap-3 text-[0.9rem]">
                          <Phone className="w-4 h-4 text-[#86868b]" />
                          <span className="font-medium">{selectedPatron.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-[0.8rem] text-[#86868b]">
                        <Calendar className="w-4 h-4" />
                        <span>Member since {new Date(selectedPatron.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-[0.7rem] uppercase tracking-widest font-bold text-[#86868b] mb-6 border-b border-black/5 pb-2">Logistics Profile</h3>
                    <div className="space-y-6">
                      {selectedPatron.addresses?.map(addr => (
                        <div key={addr.id} className="flex gap-4">
                          <MapPin className="w-5 h-5 text-[var(--color-accent)] shrink-0" />
                          <div className="text-[0.85rem] leading-relaxed">
                            <p className="font-bold uppercase tracking-wider text-[0.6rem] text-black/40 mb-1">{addr.address_type} Protocol</p>
                            <p className="font-medium text-[#1d1d1f]">{addr.address_line}</p>
                            <p className="text-[#86868b]">{addr.city}, {addr.state} {addr.zip}</p>
                          </div>
                        </div>
                      ))}
                      {(!selectedPatron.addresses || selectedPatron.addresses.length === 0) && (
                        <p className="text-[0.85rem] italic text-[#86868b]">No logistics protocols recorded.</p>
                      )}
                    </div>
                  </section>
                </div>

                {/* Reservation History */}
                <div className="lg:col-span-2 space-y-8">
                  <h3 className="text-[0.7rem] uppercase tracking-widest font-bold text-[#86868b] mb-6 border-b border-black/5 pb-2">Patronage History</h3>

                  {selectedPatron.orders?.length === 0 ? (
                    <div className="py-20 text-center bg-[#f5f5f7] rounded-3xl">
                      <Package className="w-10 h-10 mx-auto mb-4 opacity-10" />
                      <p className="text-[0.85rem] text-[#86868b]">No masterpiece reservations recorded yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedPatron.orders?.map(order => (
                        <div key={order.id} className="bg-[#f5f5f7]/50 border border-black/5 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 group hover:bg-white hover:shadow-xl transition-all duration-500">
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-xl bg-white border border-black/5 flex items-center justify-center font-mono font-bold text-[0.8rem]">
                              #{order.id}
                            </div>
                            <div>
                              <p className="text-[0.9rem] font-bold text-[#1d1d1f]">{order.order_number}</p>
                              <p className="text-[0.75rem] text-[#86868b]">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-10">
                            <div className="text-center">
                              <p className="text-[0.6rem] uppercase tracking-widest font-bold text-black/40 mb-1">Status</p>
                              <span className={`text-[0.65rem] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${order.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                                order.status === 'processing' ? 'bg-blue-100 text-blue-600' :
                                  order.status === 'shipped' ? 'bg-purple-100 text-purple-600' :
                                    order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                                      'bg-red-100 text-red-600'
                                }`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-[0.6rem] uppercase tracking-widest font-bold text-black/40 mb-1">Investment</p>
                              <p className="text-[0.95rem] font-bold text-[#1d1d1f]">₹{parseFloat(order.total_amount).toLocaleString()}</p>
                            </div>
                            <Link href={`/admin/orders?search=${order.order_number}`} className="p-2 bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-all">
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
