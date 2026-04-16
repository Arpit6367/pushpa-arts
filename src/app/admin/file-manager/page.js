'use client';
import { useState, useEffect, useRef } from 'react';

export default function AdminFileManagerPage() {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [copiedPath, setCopiedPath] = useState(null);
  const fileInputRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchFiles = () => {
    fetch('/api/files')
      .then(res => res.json())
      .then(data => {
        if (data.files) {
          setFiles(data.files);
          setFilteredFiles(data.files);
        }
        setLoading(false);
      }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchFiles(); }, []);

  useEffect(() => {
    if (search) {
      setFilteredFiles(files.filter(f => f.name.toLowerCase().includes(search.toLowerCase())));
    } else {
      setFilteredFiles(files);
    }
  }, [search, files]);

  const handleUpload = async (e) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    for (const file of fileList) {
      formData.append('files', file);
    }

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.files) {
        showToast(`${data.files.length} file(s) uploaded`);
        fetchFiles();
      }
    } catch {
      showToast('Upload failed', 'error');
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (fileName) => {
    if (!confirm(`Delete ${fileName}?`)) return;
    try {
      const res = await fetch('/api/files', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName }),
      });
      if (res.ok) {
        showToast('File deleted');
        fetchFiles();
      } else {
        showToast('Failed to delete', 'error');
      }
    } catch {
      showToast('Failed to delete', 'error');
    }
  };


  const copyPath = (path) => {
    navigator.clipboard.writeText(path).then(() => {
      setCopiedPath(path);
      showToast('Path copied to clipboard!');
      setTimeout(() => setCopiedPath(null), 2000);
    }).catch(() => {
      // Fallback
      const input = document.createElement('input');
      input.value = path;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopiedPath(path);
      showToast('Path copied!');
      setTimeout(() => setCopiedPath(null), 2000);
    });
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <>
      <div className="flex justify-between items-center px-12 py-10 sticky top-0 z-50 bg-[#fbfbfd]/90 backdrop-blur-md">
        <h1 className="text-3xl font-heading text-[#1d1d1f]">Media Assets</h1>
        <div className="flex gap-3">
          <button className="bg-[#0071e3] text-white px-6 py-2.5 rounded-[12px] text-[0.85rem] font-semibold hover:bg-[#0071e3]/90 transition-all shadow-lg shadow-[#0071e3]/20 cursor-pointer disabled:opacity-50" onClick={() => fileInputRef.current?.click()}>
            {uploading ? 'Uploading...' : '+ Upload Media'}
          </button>
        </div>
        <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
      </div>

      <div className="px-12 pb-20">
        {toast && <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-xl text-[0.9rem] font-medium z-[3000] shadow-xl transition-all ${toast.type === 'error' ? 'bg-[#ff3b30] text-white' : 'bg-[#34c759] text-white'}`}>{toast.message}</div>}

        <div className="bg-white border border-black/10 rounded-3xl p-6 md:p-8 mb-10 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="w-full md:w-auto">
            <p className="m-0 font-bold text-[#1d1d1f]">Directory: <code className="text-[#B8860B] font-mono bg-[#f5f5f7] px-2 py-1 rounded">/public/uploads/products/</code></p>
            <p className="m-1 text-[0.75rem] text-[#86868b]">Total: {files.length} assets | Filtered: {filteredFiles.length} items</p>
          </div>
          <div className="w-full md:w-[400px]">
            <input
              type="text"
              className="w-full bg-[#f5f5f7] border border-transparent px-5 py-3 rounded-2xl text-sm transition-all focus:bg-white focus:border-[#0071e3] outline-none"
              placeholder="Find asset by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="w-10 h-10 rounded-full border-4 border-[#0071e3]/20 border-t-[#0071e3] animate-spin"></div>
          </div>
        ) : filteredFiles.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-8">
            {filteredFiles.map(file => (
              <div key={file.name} className="group bg-white border border-black/10 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                <div className="aspect-square bg-[#fbfbfd] flex items-center justify-center overflow-hidden border-b border-black/5 relative">
                  <img src={file.path} alt={file.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
                </div>
                <div className="p-5">
                  <p title={file.name} className="font-semibold text-[#1d1d1f] truncate text-sm">{file.name}</p>
                  <p className="text-[#86868b] text-[0.7rem] mt-1 uppercase font-bold tracking-wider">{formatSize(file.size)}</p>
                </div>
                <div className="px-5 pb-5 flex gap-2 pt-1">
                  <button
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-[0.7rem] font-bold uppercase tracking-wider transition-all border outline-none cursor-pointer ${copiedPath === file.path ? 'bg-[#34c759] text-white border-[#34c759]' : 'bg-white text-[#0071e3] border-[#0071e3]/20 hover:bg-[#0071e3]/5 hover:border-[#0071e3]'}`}
                    onClick={() => copyPath(file.path)}
                  >
                    {copiedPath === file.path ? '✅ Copied' : '📋 URL'}
                  </button>
                  <button
                    className="w-10 h-10 flex items-center justify-center rounded-xl text-lg hover:bg-[#ff3b30]/10 text-[#ff3b30] border border-black/5 transition-colors cursor-pointer outline-none"
                    onClick={() => handleDelete(file.name)}
                    title="Delete Asset"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <div className="text-6xl mb-6 text-[#d2d2d7]">🖼️</div>
            <h3 className="text-2xl font-heading text-[#1d1d1f] mb-2">No media assets found</h3>
            <p className="text-[#86868b]">Try a different search or upload new images using the button above.</p>
          </div>
        )}
      </div>
    </>
  );
}

