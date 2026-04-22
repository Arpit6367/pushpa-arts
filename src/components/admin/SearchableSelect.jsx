'use client';
import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';

export default function SearchableSelect({ 
  options, 
  selectedIds, 
  onToggle, 
  placeholder = "Select collections...",
  label = "Associated Collections" 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOptions = options.filter(opt => 
    selectedIds.some(id => String(id) === String(opt.id))
  );

  return (
    <div className="flex flex-col gap-2 w-full relative" ref={wrapperRef}>
      <label className="text-[0.8rem] font-semibold text-[#1d1d1f] ml-1">{label}</label>
      
      {/* Always Visible Selected Tags */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 min-h-[32px]">
          {selectedOptions.map(opt => (
            <span 
              key={opt.id} 
              className="bg-[#0071e3] text-white text-[0.7rem] font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm animate-in fade-in slide-in-from-left-2"
            >
              {opt.name}
              <button 
                type="button"
                className="hover:bg-white/20 rounded-full p-0.5 transition-colors border-none cursor-pointer flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(opt.id);
                }}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      
      {/* Selection Trigger / Search Input */}
      <div 
        className={`min-h-[50px] bg-[#f5f5f7] border border-transparent rounded-xl px-5 py-3 flex items-center justify-between cursor-pointer transition-all ${isOpen ? 'bg-white border-[#0071e3] ring-4 ring-[#0071e3]/10' : 'hover:bg-[#e8e8ed]'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <Search className="w-4 h-4 text-[#86868b]" />
          <span className="text-[#86868b] text-sm font-medium">
            {isOpen ? 'Searching...' : placeholder}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-[#86868b] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-black/10 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-3 border-b border-black/5 bg-[#fafafa]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
              <input 
                type="text" 
                className="w-full bg-white border border-black/10 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-[#0071e3] transition-all"
                placeholder="Search collections..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          
          <div className="max-h-[250px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => {
                const isSelected = selectedIds.some(id => String(id) === String(opt.id));
                return (
                  <div 
                    key={opt.id}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-[#0071e3]/5 text-[#0071e3]' : 'hover:bg-[#f5f5f7] text-[#1d1d1f]'}`}
                    onClick={() => onToggle(opt.id)}
                  >
                    <span className={`text-sm ${isSelected ? 'font-bold' : 'font-medium'}`}>{opt.name}</span>
                    {isSelected && <Check className="w-4 h-4" />}
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-[#86868b]">No collections found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
