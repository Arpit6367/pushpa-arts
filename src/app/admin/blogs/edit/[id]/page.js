'use client';
import React from 'react';
import BlogForm from '../../BlogForm';

export default function EditBlog({ params }) {
  const { id } = React.use(params);
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-[#1d1d1f]">Edit Art Journal Post</h1>
      </div>
      <BlogForm id={id} />
    </div>
  );
}
