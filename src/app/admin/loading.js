export default function AdminLoading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-[#0071e3]/10"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#0071e3] animate-spin"></div>
      </div>
      <p className="mt-4 text-[0.8rem] font-medium text-[#86868b] animate-pulse">
        Loading...
      </p>
    </div>
  );
}
