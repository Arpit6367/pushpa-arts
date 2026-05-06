'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Root Error Boundary:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-white">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      
      <h2 className="text-3xl font-heading text-[#1F1F1F] mb-4">Something went wrong</h2>
      <p className="text-[#6E6E6E] max-w-[500px] mb-10 leading-relaxed font-light">
        We encountered an unexpected error while preparing your experience. This has been logged and we are looking into it.
      </p>
      
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => reset()}
          className="px-8 py-3 bg-[var(--color-accent)] text-white text-[0.7rem] uppercase tracking-[0.3em] font-bold transition-all hover:bg-black"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-8 py-3 border border-black/10 text-[#1F1F1F] text-[0.7rem] uppercase tracking-[0.3em] font-bold transition-all hover:bg-black/5"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
