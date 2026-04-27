'use client';
import FaqForm from '../FaqForm';

export default function NewFaq() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-[#1d1d1f]">New FAQ</h1>
      </div>
      <FaqForm />
    </div>
  );
}
