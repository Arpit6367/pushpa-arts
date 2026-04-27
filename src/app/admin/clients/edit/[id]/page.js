'use client';
import React from 'react';
import ClientForm from '../../ClientForm';

export default function EditClient({ params }) {
  const { id } = React.use(params);
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-[#1d1d1f]">Edit Patron</h1>
      </div>
      <ClientForm id={id} />
    </div>
  );
}
