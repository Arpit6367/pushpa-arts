'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/clients')
      .then(res => res.json())
      .then(data => {
        setClients(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const deleteClient = async (id) => {
    if (!confirm('Are you sure you want to delete this patron?')) return;
    try {
      const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setClients(clients.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#1d1d1f]">Patrons (Clients)</h1>
        <Link 
          href="/admin/clients/new"
          className="px-6 py-3 bg-[#0071e3] text-white rounded-full font-semibold hover:bg-[#0077ed] transition-all"
        >
          New Patron
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/5 border-b border-black/5">
              <th className="px-6 py-4 font-semibold text-[0.9rem]">Name</th>
              <th className="px-6 py-4 font-semibold text-[0.9rem]">Order</th>
              <th className="px-6 py-4 font-semibold text-[0.9rem]">Status</th>
              <th className="px-6 py-4 font-semibold text-[0.9rem] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id} className="border-b border-black/5 hover:bg-black/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium">{client.name}</td>
                <td className="px-6 py-4 text-[#86868b]">{client.sort_order}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${client.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {client.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link 
                    href={`/admin/clients/edit/${client.id}`}
                    className="text-[#0071e3] hover:underline font-medium text-sm"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => deleteClient(client.id)}
                    className="text-[#ff3b30] hover:underline font-medium text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-[#86868b]">No patrons found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
