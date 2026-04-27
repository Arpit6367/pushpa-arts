'use client';
import { use } from 'react';
import HeroSlideForm from '../../HeroSlideForm';

export default function EditHeroSlide({ params }) {
  const { id } = use(params);
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-[#1d1d1f] mb-8">Edit Hero Slide</h1>
      <HeroSlideForm id={id} />
    </div>
  );
}
