'use client';
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      <div className="relative w-24 h-24">
        {/* Outer ring */}
        <div className="absolute inset-0 border-t-2 border-r-2 border-transparent border-t-[var(--color-accent)] border-r-[var(--color-accent)] rounded-full animate-spin"></div>
        {/* Inner logo/placeholder */}
        <div className="absolute inset-4 border-b-2 border-l-2 border-transparent border-b-[var(--color-accent)] border-l-[var(--color-accent)] rounded-full animate-spin-slow"></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/images/Pushpa-Exports.svg"
            alt="Pushpa Arts"
            className="w-12 h-12 opacity-20 animate-pulse-slow"
          />
        </div>
      </div>

      <p className="mt-8 text-[0.65rem] tracking-[0.4em] uppercase font-bold text-[var(--color-accent)] animate-pulse">
        Loading...
      </p>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(0.95); }
          50% { opacity: 0.3; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
