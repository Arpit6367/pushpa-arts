'use client';
import React from 'react';
import ProjectForm from '../../ProjectForm';

export default function EditProject({ params }) {
  const { id } = React.use(params);
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-[#1d1d1f]">Edit Exhibition</h1>
      </div>
      <ProjectForm id={id} />
    </div>
  );
}
