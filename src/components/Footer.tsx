import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, Mail, ShieldCheck, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage, settings } = useApp();

  return (
    <footer className="bg-[#050608] border-t border-[#D4AF37]/25 text-[#E6DFD1]/70 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info with Original Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-black border border-[#D4AF37]/40 p-0.5 overflow-hidden shadow-lg shadow-[#D4AF37]/10 shrink-0">
                <img 
                  src="/assets/aistudio/my_logo_f5406092.jpeg" 
                  alt="DKWEENS DELIGHTS ENTERPRISES Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-lg font-black tracking-wider text-white">
                  DKWEENS <span className="text-[#D4AF37]">DELIGHTS</span>
                </span>
                <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
                  Enterprises • Warri, Delta State
                </p>
              </div>
            </div>
            
            <p className="text-xs font-semibold text-white/90 italic">
              “{settings?.slogan || 'WE PLAN • WE CREATE • YOU CELEBRATE.'}”
            </p>

            <p className="text-xs leading-relaxed text-neutral-400">
              Your trusted partner in Warri, Delta State for professional event ushers, champagne girls, afterparty entertainment packages, mascots, VIP serving bowls, and event rentals.
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs text-[#D4AF37] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Verified Catalogue &amp; Confirmed Prices</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-4 text-[#D4AF37]">
              Services &amp; Packages
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => { setCurrentPage('packages'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F3E5AB] transition-colors cursor-pointer text-left"
                >
                  6 Official Afterparty Packages
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentPage('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F3E5AB] transition-colors cursor-pointer text-left"
                >
                  Professional Ushers (Traditional &amp; Corporate)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentPage('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F3E5AB] transition-colors cursor-pointer text-left"
                >
                  Champagne Girls &amp; Bottle Girls
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentPage('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F3E5AB] transition-colors cursor-pointer text-left"
                >
                  Silver &amp; Gold-Coloured Serving Bowls
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentPage('rentals'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F3E5AB] transition-colors cursor-pointer text-left"
                >
                  Costume &amp; Uniform Rentals
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentPage('rentals'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F3E5AB] transition-colors cursor-pointer text-left"
                >
                  Hype Gorilla &amp; Party Mascots
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Journey */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-4 text-[#D4AF37]">
              Customer Portal
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => { setCurrentPage('gallery'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F3E5AB] transition-colors cursor-pointer text-left"
                >
                  Real Business Media Gallery (Photos &amp; Videos)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentPage('booking'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F3E5AB] transition-colors cursor-pointer text-left font-bold text-white"
                >
                  Book Our Services (Get Quotation)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentPage('status'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F3E5AB] transition-colors cursor-pointer text-left"
                >
                  Track Quotation by Reference (DK-2026-XXXX)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentPage('planner'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F3E5AB] transition-colors cursor-pointer text-left"
                >
                  Event Planning Assistant
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setCurrentPage('home');
                    setTimeout(() => {
                      document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-[#F3E5AB] transition-colors cursor-pointer text-left text-[#D4AF37] font-semibold"
                >
                  Client Reviews &amp; Testimonials
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentPage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F3E5AB] transition-colors cursor-pointer text-left"
                >
                  About DKWEENS DELIGHTS
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentPage('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F3E5AB] transition-colors cursor-pointer text-left"
                >
                  Contact &amp; Enquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Location & Contact Information */}
          <div className="space-y-3.5">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-2 text-[#D4AF37]">
              Location &amp; Direct Hotline
            </h4>

            <div className="flex items-start gap-2.5 text-xs text-neutral-300">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Warri, Delta State, Nigeria</strong>
                <span className="text-[11px] text-neutral-400">
                  Serving Warri, Effurun, Udu, Ughelli, Asaba, Bayelsa, Port Harcourt, and clients nationwide across Nigeria.
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <a 
                href="tel:09061453586"
                className="flex items-center gap-2 text-white font-bold hover:text-[#D4AF37] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>09061453586</span>
              </a>

              <a 
                href="https://wa.me/2349061453586"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-xs font-bold hover:bg-[#25D366]/30 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Message on WhatsApp</span>
              </a>
            </div>

            <p className="text-[11px] leading-relaxed text-neutral-400 bg-white/5 p-2.5 rounded-xl border border-white/5">
              ⚠️ <em>Events outside our normal Warri service area are subject to a separate travel, accommodation, and logistics assessment. Any applicable charges will be communicated transparently before booking confirmation.</em>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>
            © 2026 <strong>DKWEENS DELIGHTS ENTERPRISES</strong>. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-neutral-400">
            <span>Warri, Delta State, Nigeria</span>
            <span>•</span>
            <span>Tel: 09061453586</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
