'use client';
import ClientForm from '../ClientForm';

export default function NewClient() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-[#1d1d1f]">New Patron</h1>
      </div>
      <ClientForm />
    </div>
  );
}
