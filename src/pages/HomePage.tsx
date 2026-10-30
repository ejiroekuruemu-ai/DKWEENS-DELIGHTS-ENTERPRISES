import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  CalendarCheck, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Crown, 
  MapPin, 
  Phone, 
  MessageCircle,
  Play, 
  Sparkles,
  Users,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { ClientReviewsSection } from '../components/ClientReviewsSection';

export const HomePage: React.FC = () => {
  const { packages, services, setCurrentPage, navigateToBookingWithPackage, settings } = useApp();

  return (
    <div className="space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-8 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background ambient lighting */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-[#D4AF37]/10 rounded-full blur-[140px]" />
          <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#AA820A]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 -left-40 w-96 h-96 bg-[#D4AF37]/8 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          {/* Logo Badge & Tagline Pill */}
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#14161C]/90 border border-[#D4AF37]/40 shadow-xl backdrop-blur-md">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#D4AF37]/50 shrink-0">
              <img 
                src="/assets/aistudio/my_logo_f5406092.jpeg" 
                alt="Logo" 
                className="w-full h-full object-cover" 
              />
            </div>
            <span className="font-bold text-xs sm:text-sm text-[#F3E5AB] tracking-wide">
              {settings?.slogan || 'WE PLAN • WE CREATE • YOU CELEBRATE.'}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
            Exceptional Event Services, Staffing &amp;{' '}
            <span className="gold-gradient-text block mt-1 sm:inline">
              Afterparty Entertainment
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-neutral-300 leading-relaxed font-light">
            Welcome to <strong>DKWEENS DELIGHTS ENTERPRISES</strong>, based in Warri, Delta State. We provide professional event ushers, glamorous champagne girls, high-energy afterparty performers, hype mascots, executive bouncers, and luxury serving accessories across Nigeria.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                setCurrentPage('booking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold text-black bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA820A] hover:brightness-110 shadow-xl shadow-[#D4AF37]/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book Our Services</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                setCurrentPage('services');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-7 py-4 rounded-xl text-sm font-semibold text-[#F3E5AB] bg-[#14161C]/80 hover:bg-[#20242E] border border-[#D4AF37]/40 shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Our Services</span>
            </button>

            <a
              href="https://wa.me/2349061453586"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-4 rounded-xl text-sm font-semibold text-white bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp Direct</span>
            </a>
          </div>

          {/* Quick Real Metrics Bar */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-[#121419]/90 border border-white/5 p-4 rounded-xl">
              <div className="text-xl font-bold text-[#D4AF37]">Warri, Delta State</div>
              <div className="text-xs text-neutral-400 mt-1">Local &amp; Nationwide Service</div>
            </div>
            <div className="bg-[#121419]/90 border border-white/5 p-4 rounded-xl">
              <div className="text-xl font-bold text-[#D4AF37]">6 Tiered Packages</div>
              <div className="text-xs text-neutral-400 mt-1">₦400,000 to ₦1,000,000</div>
            </div>
            <div className="bg-[#121419]/90 border border-white/5 p-4 rounded-xl">
              <div className="text-xl font-bold text-[#D4AF37]">Verified Staff</div>
              <div className="text-xs text-neutral-400 mt-1">Ushers, Champagne Girls, Bouncers</div>
            </div>
            <div className="bg-[#121419]/90 border border-white/5 p-4 rounded-xl">
              <div className="text-xl font-bold text-[#D4AF37]">Serving Bowls</div>
              <div className="text-xs text-neutral-400 mt-1">Silver (₦2k) &amp; Gold-Coloured (₦2.5k)</div>
            </div>
          </div>
        </div>
      </section>

      {/* REAL VIDEO HIGHLIGHTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-[#14161C] border border-[#D4AF37]/30 space-y-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-xs font-bold text-[#D4AF37] border border-[#D4AF37]/25 mb-2">
                <Play className="w-3.5 h-3.5" />
                <span>Live Event Media in Action</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Real Business Videos &amp; Event Moments
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Watch our mascots and serving bowls in action at actual celebrations.
              </p>
            </div>
            <button
              onClick={() => {
                setCurrentPage('gallery');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-bold text-[#D4AF37] hover:text-[#F3E5AB] flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
            >
              <span>View Full Media Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Video 1: Mascots */}
            <div className="rounded-2xl bg-black/60 border border-white/10 p-4 space-y-3">
              <div className="relative aspect-[9/16] max-h-[460px] mx-auto rounded-xl overflow-hidden bg-black flex items-center justify-center">
                <video
                  src="/assets/aistudio/gorrilla_and_other_mascots_fee51748.mp4"
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="pt-2">
                <h3 className="font-bold text-white text-sm">Hype Gorilla, Spiderman &amp; Party Mascots</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  High-energy animated mascots igniting guests with backflips and dance routines. Available for afterparties, weddings, and celebrations.
                </p>
              </div>
            </div>

            {/* Video 2: Gold Bowls */}
            <div className="rounded-2xl bg-black/60 border border-white/10 p-4 space-y-3">
              <div className="relative aspect-[9/16] max-h-[460px] mx-auto rounded-xl overflow-hidden bg-black flex items-center justify-center">
                <video
                  src="/assets/aistudio/gold_bowls_2428a428.mp4"
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="pt-2">
                <h3 className="font-bold text-white text-sm">Gold-Coloured Serving Bowls with Chilled Drinks</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Pedestal gold-coloured serving bowls filled with ice and assorted beverages for elegant table presentations and VIP hospitality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 OFFICIAL AFTERPARTY PACKAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-xs font-semibold text-[#D4AF37] border border-[#D4AF37]/25">
            <Crown className="w-3.5 h-3.5" />
            <span>Curated Event Experiences</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Official Afterparty Packages
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            Serving Warri, Effurun, Udu, Ughelli, Asaba, Bayelsa, Port Harcourt, and clients nationwide across Nigeria. Events outside our normal Warri service area are subject to a separate travel, accommodation, and logistics assessment. Any applicable charges will be communicated transparently before booking confirmation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, idx) => (
            <div
              key={pkg.id}
              className={`rounded-2xl bg-gradient-to-b from-[#14161C] to-[#0E1014] border p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                pkg.highlight
                  ? 'border-[#D4AF37] shadow-xl shadow-[#D4AF37]/15 ring-1 ring-[#D4AF37]/40'
                  : 'border-white/10 hover:border-[#D4AF37]/50'
              }`}
            >
              <div>
                <div className="relative h-48 rounded-xl overflow-hidden mb-4 border border-white/5">
                  <img
                    src={pkg.imageUrl}
                    alt={pkg.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-sm text-[10px] font-bold text-[#D4AF37] border border-[#D4AF37]/40">
                    Tier {idx + 1}
                  </div>
                  {pkg.highlight && (
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-black text-[10px] font-black uppercase">
                      Premium
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{pkg.name}</h3>
                <p className="text-xs text-neutral-400 mb-4 line-clamp-2 leading-relaxed">
                  {pkg.description}
                </p>

                <div className="p-4 rounded-xl bg-black/50 border border-white/5 mb-5">
                  <div className="text-[11px] text-neutral-400">Package Investment</div>
                  <div className="text-2xl font-black text-white mt-0.5">
                    ₦{pkg.price.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">
                    Normal service area • Subject to confirmation
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
                    Inclusions ({pkg.inclusions.length}):
                  </div>
                  <ul className="space-y-1.5">
                    {pkg.inclusions.map((inc, i) => (
                      <li key={i} className="text-xs text-neutral-300 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => navigateToBookingWithPackage(pkg.id)}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  pkg.highlight
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black hover:brightness-110 shadow-lg shadow-[#D4AF37]/20'
                    : 'bg-white/10 hover:bg-[#D4AF37] text-white hover:text-black'
                }`}
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Select &amp; Request Quotation</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* REAL PHOTOGRAPHS GALLERY HIGHLIGHT */}
      <section className="bg-gradient-to-b from-[#0B0D10] via-[#121419] to-[#0B0D10] py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-xs font-bold text-[#D4AF37] border border-[#D4AF37]/25 mb-2">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Real Business Photographs</span>
              </div>
              <h2 className="text-3xl font-black text-white">
                Authentic Event Moments &amp; Attire
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
                Explore photographs from actual celebrations planned and staffed by DKWEENS DELIGHTS ENTERPRISES.
              </p>
            </div>

            <button
              onClick={() => {
                setCurrentPage('gallery');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#D4AF37] bg-white/5 border border-[#D4AF37]/30 hover:bg-[#D4AF37]/15 transition-all self-start md:self-auto flex items-center gap-2 cursor-pointer"
            >
              <span>View All Photos &amp; Videos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Ushers */}
            <div className="rounded-2xl bg-[#14161C] border border-white/10 overflow-hidden space-y-3 p-3">
              <div className="h-56 rounded-xl overflow-hidden">
                <img 
                  src="/assets/aistudio/5_ushers_76d2682c.jpeg" 
                  alt="Ushers in Traditional Ankara" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-2">
                <h4 className="font-bold text-white text-sm">Professional Ushers</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Ankara skirts with coral bead crowns for traditional ceremonies.
                </p>
              </div>
            </div>

            {/* Champagne Girls */}
            <div className="rounded-2xl bg-[#14161C] border border-white/10 overflow-hidden space-y-3 p-3">
              <div className="h-56 rounded-xl overflow-hidden">
                <img 
                  src="/assets/aistudio/white_champagne_gown_standing_506b0fbc.jpeg" 
                  alt="Champagne Hostesses" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-2">
                <h4 className="font-bold text-white text-sm">Champagne Girls</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  White feathered cocktail gowns for VIP bottle parades and toasts.
                </p>
              </div>
            </div>

            {/* Silver Serving Bowls */}
            <div className="rounded-2xl bg-[#14161C] border border-white/10 overflow-hidden space-y-3 p-3">
              <div className="h-56 rounded-xl overflow-hidden">
                <img 
                  src="/assets/aistudio/silver_bowl_3f2e880f.jpeg" 
                  alt="Silver Serving Bowls" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-2">
                <h4 className="font-bold text-white text-sm">Silver Serving Bowls (₦2,000)</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Chilled beverage serving bowls loaded with ice and refreshments.
                </p>
              </div>
            </div>

            {/* Purple Royal Costumes */}
            <div className="rounded-2xl bg-[#14161C] border border-white/10 overflow-hidden space-y-3 p-3">
              <div className="h-56 rounded-xl overflow-hidden">
                <img 
                  src="/assets/aistudio/purple_costume_0e01cfac.jpeg" 
                  alt="Purple Performance Costumes" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-2">
                <h4 className="font-bold text-white text-sm">Royal Purple Costumes</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Velvet, gold tassels, and veiled masks for dramatic afterparty entries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SIGNATURE SERVING BOWLS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#171A21] via-[#1E1B10] to-[#171A21] border border-[#D4AF37]/50 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              Signature Table &amp; VIP Service Accessories
            </span>
            <h2 className="text-3xl font-black text-white">
              Gold-Coloured Serving Bowls with Chilled Drinks
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
              Pedestal gold-coloured serving bowls filled with ice and assorted beverages for elegant table presentations and VIP hospitality.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-4 rounded-xl bg-black/60 border border-slate-400/30">
                <span className="font-bold text-slate-300 block">Silver Serving Bowls</span>
                <span className="text-xl font-black text-white block mt-1">₦2,000 each</span>
                <span className="text-[11px] text-neutral-400">Polished stainless steel finish with carry handles.</span>
              </div>
              <div className="p-4 rounded-xl bg-black/60 border border-[#D4AF37]/40">
                <span className="font-bold text-[#D4AF37] block">Gold-Coloured Serving Bowls with Chilled Drinks</span>
                <span className="text-xl font-black text-[#D4AF37] block mt-1">₦2,500 each</span>
                <span className="text-[11px] text-neutral-400">Lustrous pedestal finish for royal banquet tables.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
            <img 
              src="/assets/aistudio/silver_bowl_3f2e880f.jpeg" 
              alt="Silver Serving Bowls Filled with Ice and Refreshments" 
              className="w-full h-72 object-cover"
            />
          </div>
        </div>
      </section>

      {/* APPROVED SERVICE COVERAGE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#14161C] border border-[#D4AF37]/35 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-xs font-bold text-[#D4AF37] border border-[#D4AF37]/25 mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>Service Coverage &amp; Logistics Policy</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Our Service Locations
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#F3E5AB] max-w-md">
              Serving Warri, Effurun, Udu, Ughelli, Asaba, Bayelsa, Port Harcourt, and clients nationwide across Nigeria.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            {[
              { location: 'Warri', state: 'Delta State', tag: 'Headquarters' },
              { location: 'Effurun', state: 'Delta State', tag: 'Core Coverage' },
              { location: 'Udu', state: 'Delta State', tag: 'Core Coverage' },
              { location: 'Ughelli', state: 'Delta State', tag: 'Core Coverage' },
              { location: 'Asaba', state: 'Delta State', tag: 'State Capital' },
              { location: 'Bayelsa State', state: 'South-South', tag: 'Regional' },
              { location: 'Port Harcourt', state: 'Rivers State', tag: 'Regional' },
              { location: 'Nationwide', state: 'Nigeria', tag: 'All States' }
            ].map((loc, i) => (
              <div key={i} className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-1 hover:border-[#D4AF37]/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{loc.location}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#D4AF37]/15 text-[#D4AF37] font-semibold">{loc.tag}</span>
                </div>
                <div className="text-[11px] text-neutral-400">{loc.state}</div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex items-start gap-3 text-xs text-neutral-300">
            <span className="text-base text-[#D4AF37] mt-0.5">ℹ️</span>
            <div>
              <strong className="text-white block font-semibold mb-1">Travel and Logistics Notice</strong>
              <p className="text-neutral-300 leading-relaxed text-[11px]">
                Events outside our normal Warri service area are subject to a separate travel, accommodation, and logistics assessment. Any applicable charges will be communicated transparently before booking confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENT REVIEWS & TESTIMONIALS */}
      <ClientReviewsSection packages={packages} services={services} />

      {/* DISCREET EVENT PLANNING ASSISTANT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-[#14161C] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
              <Sparkles className="w-4 h-4" />
              <span>Event Planning Assistant</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">Need Help Estimating Your Event Package?</h3>
            <p className="text-xs text-neutral-300 max-w-xl">
              Use our interactive assistant to estimate service combinations within your stated budget, compare the 6 afterparty packages, and pre-populate your booking request.
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentPage('planner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="shrink-0 px-6 py-3 rounded-xl text-xs font-bold text-black bg-[#D4AF37] hover:bg-[#F3E5AB] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Event Assistant</span>
          </button>
        </div>
      </section>
    </div>
  );
};
