'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FCFAF8] pt-20">
      <div className="container text-center max-w-[800px]">
        <div className="reveal">
          <p className="text-[0.6rem] uppercase tracking-[0.5em] text-[#B8860B] font-bold mb-6 italic">Encountered an Interruption</p>
          <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] font-heading leading-tight mb-8 text-[#1F1F1F]">
            A Moment of <span className="text-[#B8860B] italic">Reflection</span>
          </h1>
          <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#B8860B] to-transparent mx-auto mb-10"></div>
          <p className="text-[1.1rem] text-[#4A4A4A] font-light leading-relaxed mb-12 opacity-80">
            Our digital atelier is currently undergoing a brief refinement. We apologize for this unexpected pause in your experience.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={() => reset()}
              className="px-12 py-5 bg-[#1F1F1F] text-white text-[0.7rem] font-bold uppercase tracking-[0.3em] hover:bg-[#B8860B] transition-all duration-500 shadow-xl"
            >
              Try Again
            </button>
            <Link 
              href="/"
              className="px-12 py-5 border border-[#1F1F1F]/10 text-[#1F1F1F] text-[0.7rem] font-bold uppercase tracking-[0.3em] hover:bg-[#1F1F1F] hover:text-white transition-all duration-500"
            >
              Return Home
            </Link>
          </div>
          
          <div className="mt-20 pt-12 border-t border-[#E5E0DA]">
            <p className="text-[0.65rem] text-[#8C8C8C] uppercase tracking-[0.2em] font-light italic">
              Support ID: {Math.random().toString(36).substring(7).toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
