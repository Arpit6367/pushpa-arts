'use client';
import { useState, useEffect, useRef } from 'react';

export default function MediaPicker({ onSelect, multiple = false, onClose }) {
  const [activeTab, setActiveTab] = useState('library');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPaths, setSelectedPaths] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/files');
      const data = await res.json();
      if (data.files) setFiles(data.files);
    } catch (err) {
      console.error('Failed to fetch files', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

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
        if (!multiple) {
          onSelect(data.files[0].file_path);
          onClose();
        } else {
          fetchFiles();
          setActiveTab('library');
          const newPaths = data.files.map(f => f.file_path);
          setSelectedPaths(prev => [...prev, ...newPaths]);
        }
      }
    } catch (err) {
      alert('Upload failed');
    }
    setUploading(false);
  };

  const toggleSelection = (path) => {
    if (multiple) {
      if (selectedPaths.includes(path)) {
        setSelectedPaths(selectedPaths.filter(p => p !== path));
      } else {
        setSelectedPaths([...selectedPaths, path]);
      }
    } else {
      onSelect(path);
      onClose();
    }
  };

  const confirmSelection = () => {
    onSelect(selectedPaths);
    onClose();
  };

  const filteredFiles = files.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-5xl h-full max-h-[85vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-black/10">

        {/* Header */}
        <div className="px-8 py-6 border-b border-black/5 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h3 className="text-xl font-bold text-[#1d1d1f]">Select Imagery</h3>
            <p className="text-[0.65rem] text-[#86868b] mt-1 uppercase tracking-[0.15em] font-bold">Studio Assets Library</p>
          </div>
          <button type="button" onClick={onClose} className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center text-xl transition-colors border-none cursor-pointer">✕</button>
        </div>

        {/* Tabs & Search bar */}
        <div className="px-8 py-4 bg-[#fbfbfd] border-b border-black/5 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex bg-black/5 p-1 rounded-xl w-full md:w-auto">
            <button
              type="button"
              className={`flex-1 md:flex-none px-8 py-2.5 rounded-lg text-sm font-semibold transition-all border-none cursor-pointer ${activeTab === 'library' ? 'bg-white text-[#0071e3] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'}`}
              onClick={() => setActiveTab('library')}
            >
              Gallery
            </button>
            <button
              type="button"
              className={`flex-1 md:flex-none px-8 py-2.5 rounded-lg text-sm font-semibold transition-all border-none cursor-pointer ${activeTab === 'upload' ? 'bg-white text-[#0071e3] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'}`}
              onClick={() => setActiveTab('upload')}
            >
              Upload New
            </button>
          </div>

          {activeTab === 'library' && (
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                placeholder="Search assets..."
                className="w-full bg-white border border-black/10 rounded-xl px-5 py-2.5 text-sm outline-none focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 transition-all"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'library' ? (
            loading ? (
              <div className="h-full flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 rounded-full border-4 border-[#0071e3]/20 border-t-[#0071e3] animate-spin mb-4"></div>
                <p className="text-sm font-medium text-[#86868b]">Opening vault...</p>
              </div>
            ) : filteredFiles.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-10">
                {filteredFiles.map(file => (
                  <div
                    key={file.path}
                    className={`group relative aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-[1.02] ${selectedPaths.includes(file.path) ? 'border-[#0071e3] ring-4 ring-[#0071e3]/10' : 'border-black/5 hover:border-[#0071e3]/50'}`}
                    onClick={() => toggleSelection(file.path)}
                  >
                    <img src={file.path} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
                    <div className={`absolute inset-0 flex items-center justify-center transition-all ${selectedPaths.includes(file.path) ? 'bg-[#0071e3]/10 backdrop-blur-[2px]' : 'bg-black/0 group-hover:bg-black/10'}`}>
                      {selectedPaths.includes(file.path) ? (
                        <div className="w-10 h-10 bg-[#0071e3] text-white rounded-full flex items-center justify-center shadow-xl border-4 border-white transform scale-110 transition-transform">✓</div>
                      ) : (
                        <div className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100">
                          <span className="text-[#0071e3] font-bold text-xs">ADD</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[#86868b] py-20">
                <div className="text-6xl mb-6 grayscale opacity-20">🖼️</div>
                <h4 className="text-xl font-bold text-[#1d1d1f] mb-2">No imagery found</h4>
                <p className="max-w-[280px] text-center">Try a different search or upload new assets to your collection.</p>
              </div>
            )
          ) : (
            <div
              className="h-full min-h-[400px] border-2 border-dashed border-black/10 rounded-[40px] flex flex-col items-center justify-center p-12 text-center hover:bg-[#fbfbfd] hover:border-[#0071e3] transition-all group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-4 border-[#0071e3]/20 border-t-[#0071e3] animate-spin mb-6"></div>
                  <h4 className="text-xl font-bold text-[#1d1d1f]">Uploading Assets...</h4>
                  <p className="text-[#86868b] mt-2">Finalizing high-resolution imagery</p>
                </div>
              ) : (
                <>
                  <div className="w-24 h-24 bg-[#f5f5f7] rounded-3xl flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-all group-hover:bg-[#0071e3]/5 group-hover:text-[#0071e3]">📤</div>
                  <h4 className="text-2xl font-bold text-[#1d1d1f] mb-3">Drop imagery here</h4>
                  <p className="text-[#86868b] max-w-[320px] leading-relaxed">Your high-resolution files will be automatically optimized and added to the Studio Gallery.</p>
                  <div className="mt-10 flex gap-4">
                    <button type="button" className="bg-[#0071e3] text-white px-10 py-4 rounded-2xl font-bold text-sm hover:bg-[#0071e3]/90 transition-all shadow-xl shadow-[#0071e3]/25 border-none cursor-pointer">Choose Files</button>
                  </div>
                  <p className="text-[0.7rem] text-[#b4b4b4] mt-6 font-bold uppercase tracking-widest">Supports JPG, PNG, WEBP</p>
                </>
              )}
              <input ref={fileInputRef} type="file" multiple={multiple} accept="image/*" className="hidden" onChange={handleUpload} />
            </div>
          )}
        </div>

        {/* Footer for multiple selection */}
        {multiple && activeTab === 'library' && (
          <div className="px-10 py-8 border-t border-black/5 bg-white flex flex-col sm:flex-row items-center justify-between sticky bottom-0 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0071e3]/10 text-[#0071e3] rounded-xl flex items-center justify-center font-bold">{selectedPaths.length}</div>
              <p className="text-sm font-bold text-[#1d1d1f]">Assets Selected</p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setSelectedPaths([])}
                className="flex-1 sm:flex-none px-8 py-3 rounded-2xl text-sm font-bold text-[#86868b] hover:bg-black/5 transition-all border-none cursor-pointer bg-transparent"
              >
                Clear All
              </button>
              <button
                type="button"
                disabled={selectedPaths.length === 0}
                onClick={confirmSelection}
                className="flex-1 sm:flex-none bg-[#1d1d1f] text-white px-10 py-3 rounded-2xl text-sm font-bold hover:bg-black transition-all shadow-xl shadow-black/10 disabled:opacity-30 disabled:cursor-not-allowed border-none cursor-pointer"
              >
                Confirm Selection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
