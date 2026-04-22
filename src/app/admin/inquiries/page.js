'use client';
import { useState, useEffect } from 'react';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchInquiries = async (page = 1, status = activeFilter, search = searchTerm) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (status && status !== 'all') params.set('status', status);
      if (search) params.set('search', search);

      const res = await fetch(`/api/contact?${params}`);
      const data = await res.json();

      if (res.ok) {
        setInquiries(data.inquiries);
        setPagination(data.pagination);
        setStatusCounts(data.statusCounts || {});
      }
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleFilterChange = (status) => {
    setActiveFilter(status);
    fetchInquiries(1, status, searchTerm);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchInquiries(1, activeFilter, searchTerm);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setInquiries(prev => prev.map(inq =>
          inq.id === id ? { ...inq, status: newStatus } : inq
        ));
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
    setActionLoading(false);
  };

  const handleSaveNotes = async (id) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_notes: adminNotes }),
      });

      if (res.ok) {
        setInquiries(prev => prev.map(inq =>
          inq.id === id ? { ...inq, admin_notes: adminNotes } : inq
        ));
        setSelectedInquiry(prev => ({ ...prev, admin_notes: adminNotes }));
      }
    } catch (err) {
      console.error('Error saving notes:', err);
    }
    setActionLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;

    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInquiries(prev => prev.filter(inq => inq.id !== id));
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
        setPagination(prev => ({ ...prev, total: prev.total - 1 }));
      }
    } catch (err) {
      console.error('Error deleting inquiry:', err);
    }
  };

  const openInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
    setAdminNotes(inquiry.admin_notes || '');
    // Mark as read if it's new
    if (inquiry.status === 'new') {
      handleStatusUpdate(inquiry.id, 'read');
    }
  };

  const totalInquiries = Object.values(statusCounts).reduce((a, b) => a + b, 0);

  const statusConfig = {
    new: { label: 'New', color: 'bg-blue-500', text: 'text-blue-600', bg: 'bg-blue-50' },
    read: { label: 'Read', color: 'bg-amber-500', text: 'text-amber-600', bg: 'bg-amber-50' },
    replied: { label: 'Replied', color: 'bg-green-500', text: 'text-green-600', bg: 'bg-green-50' },
    archived: { label: 'Archived', color: 'bg-gray-400', text: 'text-gray-500', bg: 'bg-gray-50' },
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return formatDate(dateStr);
  };

  return (
    <>
      {/* Header */}
      <div className="px-4 sm:px-8 lg:px-12 py-6 lg:py-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 z-50 bg-[#fbfbfd]/90 backdrop-blur-md">
        <div>
          <p className="text-[0.85rem] text-[#86868b] mb-2 font-medium">Client Relations</p>
          <h1 className="text-[#0071e3] text-2xl sm:text-3xl font-bold tracking-tight">Inquiries</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white border border-black/10 rounded-xl px-4 py-2">
            <span className="text-lg">📩</span>
            <span className="text-[0.85rem] font-semibold text-[#1d1d1f]">{totalInquiries} Total</span>
            {(statusCounts.new || 0) > 0 && (
              <span className="ml-2 bg-blue-500 text-white text-[0.65rem] font-bold px-2 py-0.5 rounded-full">
                {statusCounts.new} New
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 lg:px-12 pb-12 lg:pb-20">
        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-xl text-[0.8rem] font-semibold transition-all border ${activeFilter === 'all' ? 'bg-[#0071e3] text-white border-[#0071e3]' : 'bg-white text-[#1d1d1f] border-black/10 hover:bg-black/5'}`}
            >
              All ({totalInquiries})
            </button>
            {Object.entries(statusConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => handleFilterChange(key)}
                className={`px-4 py-2 rounded-xl text-[0.8rem] font-semibold transition-all border ${activeFilter === key ? 'bg-[#0071e3] text-white border-[#0071e3]' : 'bg-white text-[#1d1d1f] border-black/10 hover:bg-black/5'}`}
              >
                {config.label} ({statusCounts[key] || 0})
              </button>
            ))}
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search inquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-black/10 rounded-xl px-4 py-2.5 text-[0.85rem] w-full sm:w-[250px] outline-none focus:border-[#0071e3] transition-colors"
            />
            <button type="submit" className="bg-[#0071e3] text-white px-4 py-2.5 rounded-xl text-[0.85rem] font-semibold hover:bg-[#0071e3]/90 transition-colors">
              Search
            </button>
          </form>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 lg:gap-8">
          {/* Inquiries List */}
          <div className="bg-white rounded-2xl border border-black/10 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 rounded-full border-4 border-[#0071e3]/20 border-t-[#0071e3] animate-spin"></div>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="text-center py-20 text-[#86868b]">
                <span className="text-4xl block mb-4">📭</span>
                <p className="text-[0.95rem] font-medium">No inquiries found</p>
                <p className="text-[0.8rem] mt-1">Inquiries will appear here when visitors submit the contact form.</p>
              </div>
            ) : (
              <div>
                {inquiries.map((inquiry) => {
                  const sc = statusConfig[inquiry.status] || statusConfig.new;
                  const isSelected = selectedInquiry?.id === inquiry.id;

                  return (
                    <div
                      key={inquiry.id}
                      onClick={() => openInquiry(inquiry)}
                      className={`flex items-start gap-3 sm:gap-5 px-4 sm:px-6 py-4 sm:py-5 border-b border-black/5 cursor-pointer transition-all hover:bg-[#f5f5f7] ${isSelected ? 'bg-[#0071e3]/5 border-l-4 border-l-[#0071e3]' : ''} ${inquiry.status === 'new' ? 'bg-blue-50/30' : ''}`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 ${sc.color}`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className={`text-[0.95rem] truncate ${inquiry.status === 'new' ? 'font-bold text-[#1d1d1f]' : 'font-medium text-[#1d1d1f]'}`}>
                            {inquiry.name}
                          </h4>
                          <span className={`text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${sc.text} ${sc.bg}`}>
                            {sc.label}
                          </span>
                        </div>
                        <p className="text-[0.8rem] text-[#1d1d1f] font-medium truncate mb-1">{inquiry.subject}</p>
                        <p className="text-[0.75rem] text-[#86868b] truncate">{inquiry.message}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[0.7rem] text-[#86868b] font-medium">{getTimeAgo(inquiry.created_at)}</p>
                      </div>
                    </div>
                  );
                })}

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-black/5">
                    <p className="text-[0.8rem] text-[#86868b]">
                      Page {pagination.page} of {pagination.pages} ({pagination.total} total)
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => fetchInquiries(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                        className="px-4 py-2 rounded-lg text-[0.8rem] font-medium bg-[#f5f5f7] hover:bg-black/10 disabled:opacity-30 transition-colors"
                      >
                        ← Prev
                      </button>
                      <button
                        onClick={() => fetchInquiries(pagination.page + 1)}
                        disabled={pagination.page >= pagination.pages}
                        className="px-4 py-2 rounded-lg text-[0.8rem] font-medium bg-[#f5f5f7] hover:bg-black/10 disabled:opacity-30 transition-colors"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <div className="bg-white rounded-2xl border border-black/10 shadow-sm overflow-hidden xl:sticky xl:top-[120px] self-start">
            {selectedInquiry ? (
              <div>
                {/* Detail Header */}
                <div className="px-6 py-5 border-b border-black/5 bg-[#fbfbfd]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[1.1rem] font-bold text-[#1d1d1f]">{selectedInquiry.name}</h3>
                    <button
                      onClick={() => setSelectedInquiry(null)}
                      className="text-[#86868b] hover:text-[#1d1d1f] text-xl transition-colors"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a href={`mailto:${selectedInquiry.email}`} className="text-[0.75rem] text-[#0071e3] hover:underline">{selectedInquiry.email}</a>
                    {selectedInquiry.phone && (
                      <>
                        <span className="text-[#86868b]">•</span>
                        <a href={`tel:${selectedInquiry.phone}`} className="text-[0.75rem] text-[#0071e3] hover:underline">{selectedInquiry.phone}</a>
                      </>
                    )}
                  </div>
                </div>

                {/* Detail Body */}
                <div className="px-6 py-5 space-y-6">
                  <div>
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[#86868b] mb-2">Interest</p>
                    <p className="text-[0.9rem] font-medium text-[#1d1d1f]">{selectedInquiry.subject}</p>
                  </div>

                  <div>
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[#86868b] mb-2">Message</p>
                    <p className="text-[0.85rem] text-[#4A4A4A] leading-relaxed whitespace-pre-wrap">{selectedInquiry.message}</p>
                  </div>

                  <div>
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[#86868b] mb-2">Received</p>
                    <p className="text-[0.85rem] text-[#1d1d1f]">{formatDate(selectedInquiry.created_at)}</p>
                  </div>

                  {/* Status Controls */}
                  <div>
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[#86868b] mb-3">Status</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <button
                          key={key}
                          disabled={actionLoading}
                          onClick={() => handleStatusUpdate(selectedInquiry.id, key)}
                          className={`px-3 py-1.5 rounded-lg text-[0.7rem] font-bold uppercase tracking-wider transition-all border ${selectedInquiry.status === key ? `${config.text} ${config.bg} border-current` : 'text-[#86868b] bg-[#f5f5f7] border-transparent hover:bg-black/5'}`}
                        >
                          {config.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Admin Notes */}
                  <div>
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[#86868b] mb-2">Admin Notes</p>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows="3"
                      className="w-full bg-[#f5f5f7] border border-black/5 rounded-xl px-4 py-3 text-[0.85rem] outline-none focus:border-[#0071e3] transition-colors resize-none"
                      placeholder="Add internal notes about this inquiry..."
                    />
                    <button
                      onClick={() => handleSaveNotes(selectedInquiry.id)}
                      disabled={actionLoading}
                      className="mt-2 px-4 py-2 bg-[#0071e3] text-white text-[0.75rem] font-semibold rounded-lg hover:bg-[#0071e3]/90 transition-colors disabled:opacity-50"
                    >
                      Save Notes
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="border-t border-black/5 pt-5 flex flex-col sm:flex-row gap-3">
                    <a
                      href={`mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject}`}
                      onClick={() => handleStatusUpdate(selectedInquiry.id, 'replied')}
                      className="flex-1 text-center px-4 py-2.5 bg-[#34c759] text-white text-[0.75rem] font-semibold rounded-lg hover:bg-[#34c759]/90 transition-colors"
                    >
                      📧 Reply via Email
                    </a>
                    <a
                      href={`https://wa.me/${selectedInquiry.phone?.replace(/\D/g, '')}?text=Hello ${selectedInquiry.name}, thank you for reaching out to Pushpa Exports regarding "${selectedInquiry.subject}".`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center px-4 py-2.5 bg-[#25d366] text-white text-[0.75rem] font-semibold rounded-lg hover:bg-[#25d366]/90 transition-colors"
                    >
                      💬 WhatsApp
                    </a>
                  </div>

                  <button
                    onClick={() => handleDelete(selectedInquiry.id)}
                    className="w-full text-center px-4 py-2.5 text-[#ff3b30] text-[0.75rem] font-medium rounded-lg hover:bg-[#ff3b30]/10 transition-colors border border-[#ff3b30]/20"
                  >
                    Delete Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <span className="text-4xl mb-4">📋</span>
                <p className="text-[0.95rem] font-medium text-[#1d1d1f] mb-1">Select an inquiry</p>
                <p className="text-[0.8rem] text-[#86868b]">Click on any inquiry from the list to view its details and take action.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
