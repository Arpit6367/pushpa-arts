'use client';
import { useState, useEffect, useRef } from 'react';

export default function AdminFileManagerPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchFiles = () => {
    fetch('/api/files')
      .then(res => res.json())
      .then(data => {
        if (data.files) setFiles(data.files);
        setLoading(false);
      }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchFiles(); }, []);

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
      showToast('Path copied!');
    }).catch(() => {
      // Fallback
      const input = document.createElement('input');
      input.value = path;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      showToast('Path copied!');
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
        <h1>File Manager</h1>
        <button className="btn btn-primary btn-sm" onClick={() => fileInputRef.current?.click()}>
          {uploading ? 'Uploading...' : '+ Upload Files'}
        </button>
        <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
      </div>

      <div className="admin-content">
        {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

        <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          📁 All files are stored in <code style={{ background: '#f0f0f0', padding: '2px 8px', borderRadius: '4px', color: '#555' }}>/public/uploads/products/</code> 
          — Total: {files.length} files
        </p>

        {loading ? (
          <div className="loading"><div className="spinner"></div></div>
        ) : files.length > 0 ? (
          <div className="file-grid">
            {files.map(file => (
              <div key={file.name} className="file-card">
                <div className="file-card-image">
                  <img src={file.path} alt={file.name} loading="lazy" />
                </div>
                <div className="file-card-info">
                  <p title={file.name}>{file.name}</p>
                  <p style={{ color: '#555' }}>{formatSize(file.size)}</p>
                </div>
                <div className="file-card-actions">
                  <button className="copy-btn" onClick={() => copyPath(file.path)}>📋 Copy URL</button>
                  <button className="del-btn" onClick={() => handleDelete(file.name)}>🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No files uploaded yet</h3>
            <p>Upload images using the button above. They will be available for use in products.</p>
          </div>
        )}
      </div>
    </>
  );
}
