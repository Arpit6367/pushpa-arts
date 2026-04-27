'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const deleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this exhibition project?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects(projects.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#1d1d1f]">Exhibitions (Projects)</h1>
        <Link 
          href="/admin/projects/new"
          className="px-6 py-3 bg-[#0071e3] text-white rounded-full font-semibold hover:bg-[#0077ed] transition-all"
        >
          New Exhibition
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/5 border-b border-black/5">
              <th className="px-6 py-4 font-semibold text-[0.9rem]">Title</th>
              <th className="px-6 py-4 font-semibold text-[0.9rem]">Client</th>
              <th className="px-6 py-4 font-semibold text-[0.9rem]">Status</th>
              <th className="px-6 py-4 font-semibold text-[0.9rem] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project.id} className="border-b border-black/5 hover:bg-black/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium">{project.title}</td>
                <td className="px-6 py-4 text-[#86868b]">{project.client_name || 'N/A'}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${project.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {project.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link 
                    href={`/admin/projects/edit/${project.id}`}
                    className="text-[#0071e3] hover:underline font-medium text-sm"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => deleteProject(project.id)}
                    className="text-[#ff3b30] hover:underline font-medium text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-[#86868b]">No exhibitions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
