import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MediaItem } from '../types';
import { 
  Play, 
  Image as ImageIcon, 
  CalendarCheck, 
  Filter, 
  X, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const { galleryMedia, setCurrentPage, navigateToBookingWithPlan } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Media' },
    { id: 'ushers', label: 'Professional Ushers' },
    { id: 'champagne_girls', label: 'Champagne & Bottle Girls' },
    { id: 'costumes', label: 'Performance Costumes' },
    { id: 'afterparty', label: 'Afterparty Entertainment' },
    { id: 'mascots', label: 'Hype Mascots' },
    { id: 'serving_bowls', label: 'Serving Bowls (Silver & Gold)' },
    { id: 'boards', label: 'Illuminated Boards' },
  ];

  const filteredMedia = galleryMedia.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-xs font-semibold text-[#D4AF37] border border-[#D4AF37]/25">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Real Business Media Gallery</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Our Events, Staff &amp; Rentals
        </h1>
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
          Real business photographs and live event videos of our ushers, champagne girls, afterparty performers, hype mascots, serving bowls, and illuminated boards in Warri, Delta State and beyond.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-white/10 pb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 font-bold'
                : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="group rounded-2xl bg-[#14161C] border border-white/10 overflow-hidden cursor-pointer hover:border-[#D4AF37]/60 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-black flex items-center justify-center">
              {item.mediaType === 'video' ? (
                <div className="relative w-full h-full flex items-center justify-center bg-black/80">
                  <video
                    src={item.url}
                    preload="metadata"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/80 text-[#D4AF37] border border-[#D4AF37]/40 uppercase">
                    Video Clip
                  </span>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/80 text-white border border-white/20 uppercase">
                    Photo
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white text-sm group-hover:text-[#F3E5AB] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                  {item.caption}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#D4AF37]">
                <span>Click to view details</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className="p-12 text-center text-neutral-400 bg-[#14161C] rounded-2xl">
          No media items found for this category.
        </div>
      )}

      {/* LIGHTBOX / DETAIL MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#14161C] border border-[#D4AF37]/40 rounded-3xl max-w-3xl w-full p-6 space-y-5 shadow-2xl relative my-8">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media Player or Image */}
            <div className="rounded-2xl overflow-hidden bg-black max-h-[500px] flex items-center justify-center border border-white/10">
              {selectedItem.mediaType === 'video' ? (
                <video
                  src={selectedItem.url}
                  controls
                  autoPlay
                  playsInline
                  className="w-full max-h-[480px] object-contain"
                />
              ) : (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.title}
                  className="w-full max-h-[480px] object-contain"
                />
              )}
            </div>

            {/* Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  Category: {selectedItem.category.replace('_', ' ')}
                </span>
                <span className="text-neutral-500">•</span>
                <span className="text-xs text-neutral-400 capitalize">{selectedItem.mediaType} Asset</span>
              </div>

              <h2 className="text-xl font-bold text-white">{selectedItem.title}</h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {selectedItem.caption}
              </p>

              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-neutral-400">
                  Ready to include this in your upcoming event?
                </span>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setSelectedItem(null);
                      setCurrentPage('booking');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-[#D4AF37] hover:bg-[#F3E5AB] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>Book This Service / Item</span>
                  </button>
                  <a
                    href="https://wa.me/2349061453586"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#25D366]/20 border border-[#25D366]/40 hover:bg-[#25D366]/30 transition-colors flex items-center justify-center"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
