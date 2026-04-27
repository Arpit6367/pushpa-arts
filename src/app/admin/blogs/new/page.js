'use client';
import BlogForm from '../BlogForm';

export default function NewBlog() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-[#1d1d1f]">New Art Journal Post</h1>
      </div>
      <BlogForm />
    </div>
  );
}
