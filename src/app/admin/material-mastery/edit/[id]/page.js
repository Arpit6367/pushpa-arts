'use client';
import { use } from 'react';
import MasteryForm from '../../MasteryForm';

export default function EditMastery({ params }) {
  const { id } = use(params);
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-[#1d1d1f] mb-8">Edit Material Showcase</h1>
      <MasteryForm id={id} />
    </div>
  );
}
