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
      <div className="admin-header">
        <h1>Media Assets</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary btn-sm" onClick={() => fileInputRef.current?.click()}>
            {uploading ? 'Uploading...' : '+ Upload Media'}
          </button>
        </div>
        <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
      </div>

      <div className="admin-content">
        {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

        <div className="admin-table-header" style={{ background: '#fff', borderRadius: '15px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--admin-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div>
              <p style={{ margin: 0, fontWeight: '600' }}>Directory: <code style={{ color: 'var(--color-gold)' }}>/public/uploads/products/</code></p>
              <p style={{ margin: '5px 0 0 0', fontSize: '0.75rem', color: '#888' }}>Total: {files.length} assets | Filtered: {filteredFiles.length} items</p>
            </div>
            <div style={{ width: '300px' }}>
              <input 
                type="text" 
                className="admin-search" 
                placeholder="Find asset by name..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ margin: 0 }}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner"></div></div>
        ) : filteredFiles.length > 0 ? (
          <div className="file-grid">
            {filteredFiles.map(file => (
              <div key={file.name} className="file-card">
                <div className="file-card-image">
                  <img src={file.path} alt={file.name} loading="lazy" />
                </div>
                <div className="file-card-info">
                  <p title={file.name} style={{ fontWeight: '600', color: '#111' }}>{file.name}</p>
                  <p style={{ color: '#888', fontSize: '0.75rem' }}>{formatSize(file.size)}</p>
                </div>
                <div className="file-card-actions" style={{ padding: '0.75rem', gap: '0.5rem' }}>
                  <button 
                    className={`btn btn-sm ${copiedPath === file.path ? 'btn-primary' : 'btn-outline'}`} 
                    onClick={() => copyPath(file.path)}
                    style={{ flex: 1, fontSize: '0.65rem' }}
                  >
                    {copiedPath === file.path ? '✅ Copied' : '📋 URL'}
                  </button>
                  <button 
                    className="btn btn-outline btn-sm" 
                    onClick={() => handleDelete(file.name)}
                    style={{ padding: '0.5rem', color: '#dc2626', borderColor: 'transparent' }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🖼️</div>
            <h3>No media assets found</h3>
            <p>Try a different search or upload new images using the button above.</p>
          </div>
        )}
      </div>
    </>
  );
}

