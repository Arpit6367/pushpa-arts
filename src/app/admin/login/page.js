'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F1EE] flex items-center justify-center p-6">
      <div className="w-full max-w-[440px] bg-white rounded-[32px] p-10 md:p-12 shadow-2xl shadow-[#1d1d1f]/5 border border-black/5 animate-fade-in text-center">
        <img src="/images/Pushpa-Exports.svg" alt="Pushpa Arts" className="h-[120px] w-auto mb-8 mx-auto hover:scale-105 transition-transform duration-500" />
        <h2 className="text-xl font-heading text-[#1d1d1f] mb-2">Administration</h2>
        <p className="text-[#86868b] text-[0.85rem] font-medium tracking-wide mb-10">Authorized Access Only</p>
        
        {error && (
          <div className="bg-[#ff3b30]/10 border border-[#ff3b30]/20 text-[#ff3b30] p-4 rounded-2xl mb-8 text-[0.85rem] font-semibold animate-shake">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2 text-left">
            <label htmlFor="admin-username" className="text-[0.8rem] font-bold text-[#1d1d1f] ml-1">Username</label>
            <input
              id="admin-username"
              type="text"
              className="bg-[#f5f5f7] border border-transparent px-5 py-4 rounded-2xl text-base w-full transition-all focus:bg-white focus:border-[#0071e3] outline-none"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-2 text-left">
            <label htmlFor="admin-password" className="text-[0.8rem] font-bold text-[#1d1d1f] ml-1">Password</label>
            <input
              id="admin-password"
              type="password"
              className="bg-[#f5f5f7] border border-transparent px-5 py-4 rounded-2xl text-base w-full transition-all focus:bg-white focus:border-[#0071e3] outline-none"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-[#1F1F1F] text-white py-5 rounded-2xl text-[0.85rem] font-bold uppercase tracking-[0.2em] transform transition-all active:scale-95 hover:bg-[#B8860B] shadow-xl shadow-[#1F1F1F]/20 disabled:opacity-50 cursor-pointer border-none"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                <span>Securing Access...</span>
              </div>
            ) : 'Enter Dashboard'}
          </button>
        </form>

        <p className="mt-12 text-[0.7rem] text-[#b4b4b4] uppercase tracking-widest font-semibold">
          © {new Date().getFullYear()} Pushpa Arts. Handcrafted in India.
        </p>
      </div>
    </div>
  );
}
