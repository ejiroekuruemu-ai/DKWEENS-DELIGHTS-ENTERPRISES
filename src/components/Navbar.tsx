import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CalendarCheck, 
  Search, 
  ShieldCheck, 
  Menu, 
  X, 
  Package, 
  Layers, 
  Info, 
  Mail, 
  Image, 
  Sparkles, 
  Phone,
  ShoppingBag,
  Star
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPage, setCurrentPage, adminToken, settings } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', icon: null },
    { id: 'services', label: 'Services', icon: Layers },
    { id: 'packages', label: 'Afterparty Packages', icon: Package },
    { id: 'rentals', label: 'Rentals & Accessories', icon: ShoppingBag },
    { id: 'gallery', label: 'Real Media Gallery', icon: Image },
    { id: 'reviews', label: 'Client Reviews', icon: Star },
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  const handleNavClick = (pageId: any) => {
    if (pageId === 'reviews') {
      setCurrentPage('home');
      setMobileMenuOpen(false);
      setTimeout(() => {
        document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#07080A]/95 backdrop-blur-md border-b border-[#D4AF37]/25 shadow-2xl">
      {/* Top Bar with Location, Slogan & Direct Hotline */}
      <div className="bg-gradient-to-r from-[#0C0D10] via-[#1A1710] to-[#0C0D10] border-b border-[#D4AF37]/15 py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-[#E6DFD1]/80">
          <div className="flex items-center gap-2">
            <span className="text-[#D4AF37] font-bold tracking-wide">
              {settings?.slogan || 'WE PLAN • WE CREATE • YOU CELEBRATE.'}
            </span>
            <span className="hidden md:inline text-white/30">•</span>
            <span className="hidden md:inline text-neutral-300">
              {settings?.location || 'Warri, Delta State, Nigeria'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a 
              href="tel:09061453586"
              className="text-[#D4AF37] hover:text-[#F3E5AB] flex items-center gap-1.5 font-bold transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call / WhatsApp: 09061453586</span>
            </a>
            <span className="text-white/20">|</span>
            <button 
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded transition-all ${
                adminToken 
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{adminToken ? 'Admin Active' : 'Admin'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Authentic Brand Logo & Name */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3.5 group text-left transition-transform hover:scale-[1.01] cursor-pointer"
          >
            <div className="w-13 h-13 rounded-2xl bg-black border border-[#D4AF37]/40 p-0.5 overflow-hidden shadow-lg shadow-[#D4AF37]/15 shrink-0">
              <img 
                src="/assets/aistudio/my_logo_f5406092.jpeg" 
                alt="DKWEENS DELIGHTS ENTERPRISES Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black tracking-wider text-white leading-tight">
                DKWEENS <span className="text-[#D4AF37]">DELIGHTS</span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-neutral-300 font-semibold">
                Enterprises • Warri, Delta State
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'text-[#F3E5AB] bg-[#D4AF37]/15 shadow-inner border border-[#D4AF37]/35'
                      : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D4AF37]' : 'text-neutral-400'}`} />}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={() => handleNavClick('planner')}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-[#D4AF37] bg-white/5 hover:bg-[#D4AF37]/15 border border-[#D4AF37]/30 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Assistance with estimating packages and services"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Event Assistant</span>
            </button>

            <button
              onClick={() => handleNavClick('status')}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white bg-black/60 hover:bg-white/5 border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-neutral-400" />
              <span>Check Status</span>
            </button>

            <button
              onClick={() => handleNavClick('booking')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA820A] hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book Our Services</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('booking')}
              className="sm:hidden px-3 py-1.5 rounded-lg text-xs font-bold text-black bg-[#D4AF37]"
            >
              Book Now
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/5 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#D4AF37]" /> : <Menu className="w-6 h-6 text-[#D4AF37]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0A0C0F] border-b border-[#D4AF37]/25 px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'text-[#F3E5AB] bg-[#D4AF37]/20 border border-[#D4AF37]/40'
                    : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {Icon && <Icon className="w-4 h-4 text-[#D4AF37]" />}
                  <span>{link.label}</span>
                </div>
              </button>
            );
          })}
          
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('planner')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-[#D4AF37] bg-white/5 border border-[#D4AF37]/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Event Planning Assistant</span>
            </button>

            <button
              onClick={() => handleNavClick('status')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-neutral-300 bg-black/40 border border-white/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Check Booking / Quotation Status</span>
            </button>

            <a
              href="https://wa.me/2349061453586"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-black bg-[#25D366] hover:bg-[#20ba59] flex items-center justify-center gap-2"
            >
              <span>WhatsApp Us: 09061453586</span>
            </a>

            <button
              onClick={() => handleNavClick('admin')}
              className="w-full py-2 px-4 rounded-xl text-[11px] font-semibold text-neutral-400 bg-white/5 flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Administrator Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
