'use client';
import { use } from 'react';
import TestimonialForm from '../../TestimonialForm';

export default function EditTestimonial({ params }) {
  const { id } = use(params);
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-[#1d1d1f] mb-8">Edit Testimonial</h1>
      <TestimonialForm id={id} />
    </div>
  );
}
