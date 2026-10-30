import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Crown, 
  ShieldCheck, 
  CalendarCheck, 
  Layers, 
  Tv, 
  Wine, 
  Shirt, 
  Smile, 
  Play, 
  Check, 
  ArrowRight,
  Info
} from 'lucide-react';

export const RentalsPage: React.FC = () => {
  const { navigateToBookingWithPlan, setCurrentPage } = useApp();
  const [filterCategory, setFilterCategory] = useState<'all' | 'bowls' | 'boards' | 'costumes' | 'mascots'>('all');

  const handleBookItem = (serviceId: string, option?: string) => {
    navigateToBookingWithPlan({
      services: [
        {
          serviceId,
          quantity: 1,
          selectedOption: option
        }
      ]
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 text-xs font-semibold text-[#D4AF37] border border-[#D4AF37]/25">
          <Crown className="w-3.5 h-3.5" />
          <span>DKWEENS DELIGHTS ENTERPRISES • Equipment &amp; Rentals</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Event Accessories &amp; Presentation Rentals
        </h1>
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
          Upgrade your reception and afterparty with authentic DKWEENS DELIGHTS presentation hardware: 
          illuminated serving bowls, crown video boards, illuminated LED drink carriers, designer performance costumes, and hype mascots.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-white/10 pb-5">
        {[
          { id: 'all', label: 'All Rental Gear' },
          { id: 'bowls', label: 'Serving Bowls (Gold & Silver)' },
          { id: 'boards', label: 'Illuminated Boards & Displays' },
          { id: 'costumes', label: 'Performance Attire & Costumes' },
          { id: 'mascots', label: 'Hype Mascots & Troupe' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterCategory(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterCategory === tab.id
                ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20 font-bold'
                : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. SERVING BOWLS SECTION */}
      {(filterCategory === 'all' || filterCategory === 'bowls') && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-l-4 border-[#D4AF37] pl-4">
            <div>
              <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                Signature Presentation Hardware
              </span>
              <h2 className="text-2xl font-bold text-white">
                Gold-Coloured Serving Bowls with Chilled Drinks &amp; Silver Bowls
              </h2>
            </div>
            <span className="text-xs text-neutral-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
              Verified Rates: Silver ₦2,000 / Gold ₦2,500
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Gold Serving Bowls with Live Video */}
            <div className="rounded-3xl bg-[#14161C] border border-[#D4AF37]/50 overflow-hidden flex flex-col justify-between shadow-2xl">
              <div className="relative aspect-video bg-black overflow-hidden group">
                <video 
                  src="/assets/aistudio/gold_bowls_2428a428.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#D4AF37] border border-[#D4AF37]/40">
                  Live Demonstration • Gold Bowls Fleet
                </div>
                <div className="absolute bottom-3 right-3 bg-black/80 px-2.5 py-1 rounded-md text-[10px] text-neutral-300">
                  Ready for ice, water &amp; champagne bottles
                </div>
              </div>

              <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Gold Edition</span>
                    <span className="text-2xl font-black text-[#D4AF37]">₦2,500 <span className="text-xs text-neutral-400 font-normal">/ unit</span></span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Gold-Coloured Serving Bowls with Chilled Drinks</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Pedestal gold-coloured serving bowls filled with ice and assorted beverages for elegant table presentations and VIP hospitality.
                  </p>
                  
                  <ul className="mt-4 space-y-1.5 text-xs text-neutral-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Brushed gold finish that glistens under event lighting</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Sturdy pedestal base with decorative handles for easy carrying</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Generous ice chamber for champagne, wines, and bottled refreshments</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => handleBookItem('srv-serving-bowls', 'Gold-Coloured Serving Bowls with Chilled Drinks')}
                  className="w-full py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-[#D4AF37] to-[#AA820A] hover:brightness-110 text-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#D4AF37]/20"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Reserve Gold Serving Bowls (₦2,500)</span>
                </button>
              </div>
            </div>

            {/* Silver Serving Bowls */}
            <div className="rounded-3xl bg-[#14161C] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#D4AF37]/40 transition-all shadow-xl">
              <div className="relative aspect-video bg-black overflow-hidden">
                <img 
                  src="/assets/aistudio/silver_bowl_3f2e880f.jpeg" 
                  alt="Silver Serving Bowls on Event Day" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-slate-200 border border-white/20">
                  Silver Edition • In Field Service
                </div>
              </div>

              <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Silver Edition</span>
                    <span className="text-2xl font-black text-white">₦2,000 <span className="text-xs text-neutral-400 font-normal">/ unit</span></span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Silver Serving Bowls</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Polished silver chrome serving bowls providing a sleek, reflective contrast for corporate dinners, wedding receptions, and high-energy VIP delivery sets.
                  </p>

                  <ul className="mt-4 space-y-1.5 text-xs text-neutral-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Mirror polished chrome finish</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Accommodates high bottle &amp; ice volume seamlessly</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Available in multiples for coordinated usherette entry</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => handleBookItem('srv-serving-bowls', 'Silver Serving Bowls')}
                  className="w-full py-3 rounded-xl text-xs font-bold bg-white/10 hover:bg-[#D4AF37] text-white hover:text-black transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/15"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Reserve Silver Serving Bowls (₦2,000)</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. ILLUMINATED BOARDS & CARRIERS */}
      {(filterCategory === 'all' || filterCategory === 'boards') && (
        <section className="space-y-6">
          <div className="border-l-4 border-[#D4AF37] pl-4">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              Afterparty &amp; Club Hype Props
            </span>
            <h2 className="text-2xl font-bold text-white">
              Illuminated Video &amp; Drink Carrier Boards
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Included in our Official Afterparty Packages or available as standalone additions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Crown Video Board */}
            <div className="rounded-3xl bg-[#14161C] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#D4AF37]/50 transition-all shadow-xl">
              <div className="relative h-72 overflow-hidden bg-black">
                <img 
                  src="/assets/aistudio/small_board_3cbf85c9.jpeg" 
                  alt="Crown-Crested Hype Video Board" 
                  className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#D4AF37] border border-[#D4AF37]/30">
                  Crown-Crested Digital Unit
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Crown Hype Video Screen Board</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed mt-2">
                    Signature handheld LED video display crowned with the royal emblem and neon border glow. Perfect for hyping the celebrant, displaying live video visuals, and leading dramatic stage walk-ins.
                  </p>
                  <div className="mt-3 text-[11px] text-[#D4AF37] bg-[#D4AF37]/10 p-2.5 rounded-lg border border-[#D4AF37]/20 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Included in Packages 1, 2, 3 &amp; 4 or rented individually</span>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentPage('booking')}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#F3E5AB] hover:text-black border border-[#D4AF37]/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Inquire / Add Video Board</span>
                </button>
              </div>
            </div>

            {/* Illuminated LED Drink Carrier Board */}
            <div className="rounded-3xl bg-[#14161C] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#D4AF37]/50 transition-all shadow-xl">
              <div className="relative h-72 overflow-hidden bg-black">
                <img 
                  src="/assets/aistudio/drink_carrier_board_4490446f.jpeg" 
                  alt="Illuminated LED Drink Carrier Board" 
                  className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-cyan-300 border border-cyan-500/30">
                  Multicolour LED Lettering &amp; Bottle Mount
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Illuminated Luxury Drink Carrier Board</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed mt-2">
                    Features glowing neon brand typography (CÎROC, BELAIRE, ACE, DOM PÉRIGNON) with digital LED matrix display ("PIECE OF MY HEART") and illuminated bottle staging bay. Guaranteed to command room attention during afterparty countdowns.
                  </p>
                  <div className="mt-3 text-[11px] text-cyan-300 bg-cyan-950/40 p-2.5 rounded-lg border border-cyan-800/30 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>Included in Packages 1 &amp; 2 or available with custom bottle sets</span>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentPage('booking')}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-[#D4AF37] text-white hover:text-black border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Inquire / Add Carrier Board</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. PERFORMANCE COSTUMES & ATTIRE */}
      {(filterCategory === 'all' || filterCategory === 'costumes') && (
        <section className="space-y-6">
          <div className="border-l-4 border-[#D4AF37] pl-4">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              Bespoke Event Wardrobe
            </span>
            <h2 className="text-2xl font-bold text-white">
              Signature Performance Costumes &amp; Attire
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Photographed directly on our professional performers and available for hire.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 'cst-black-gold',
                name: 'Black & Gold Fringe VIP Attire',
                img: '/assets/aistudio/black_costume_c34757cd.jpeg',
                desc: 'Two-piece embellished halter set with black tiered flare skirt and gold tassel sleeve bands.',
                price: '₦25,000 / day',
                tag: 'VIP Bottle Girls'
              },
              {
                id: 'cst-gold-fringe',
                name: 'Golden-Yellow Fringe Set',
                img: '/assets/aistudio/gold_costume_70f42908.jpeg',
                desc: 'High-energy canary yellow two-piece with flowing sleeve fringe and combat boot styling.',
                price: '₦25,000 / day',
                tag: 'Afterparty Dancers'
              },
              {
                id: 'cst-purple-velvet',
                name: 'Royal Purple & Gold Velvet Costumes',
                img: '/assets/aistudio/purple_costume_0e01cfac.jpeg',
                desc: 'Velvet harem performance outfits with gold chain accents and gold theatrical masquerade masks.',
                price: '₦30,000 / day',
                tag: 'Fire Dancers & Performers'
              },
              {
                id: 'cst-emerald-vip',
                name: 'Emerald Green VIP Attire',
                img: '/assets/aistudio/green_bottlegirl_costume_8f729841.jpeg',
                desc: 'Structured emerald green luxury jacket and shorts set with knee-high performance boots.',
                price: '₦25,000 / day',
                tag: 'Bottle Service Girls'
              }
            ].map((cst, i) => (
              <div 
                key={i}
                className="rounded-2xl bg-[#14161C] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#D4AF37]/50 transition-all"
              >
                <div className="relative h-64 overflow-hidden bg-black">
                  <img 
                    src={cst.img} 
                    alt={cst.name} 
                    className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/80 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#D4AF37] border border-[#D4AF37]/30">
                    {cst.tag}
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-black/85 px-2 py-0.5 rounded text-[11px] font-bold text-white">
                    {cst.price}
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{cst.name}</h4>
                    <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed line-clamp-3">
                      {cst.desc}
                    </p>
                  </div>
                  <button
                    onClick={() => handleBookItem('cst-1')}
                    className="w-full py-2 rounded-lg text-xs font-semibold bg-white/5 hover:bg-[#D4AF37] text-white hover:text-black border border-white/10 transition-colors"
                  >
                    Reserve Attire
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. MASCOTS & TROUPE */}
      {(filterCategory === 'all' || filterCategory === 'mascots') && (
        <section className="space-y-6">
          <div className="border-l-4 border-[#D4AF37] pl-4">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              Crowd Energizers
            </span>
            <h2 className="text-2xl font-bold text-white">
              Hype Mascots &amp; Performer Characters
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Includes our famous Gorilla mascot, Spiderman, Panda, and afterparty hype crew.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Mascot Video */}
            <div className="lg:col-span-7 rounded-3xl bg-black border border-[#D4AF37]/40 overflow-hidden relative aspect-video shadow-2xl">
              <video 
                src="/assets/aistudio/gorrilla_and_other_mascots_fee51748.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-black/80 px-3 py-1 rounded-full text-xs font-bold text-[#D4AF37] border border-[#D4AF37]/30">
                Live Video • Mascots in Action
              </div>
            </div>

            {/* Mascot Info */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                Unrivaled Dancefloor Energy
              </span>
              <h3 className="text-2xl font-bold text-white">
                The DKWEENS Hype Squad
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Nothing ignites a Nigerian wedding afterparty like our acrobatic Spiderman, dancing Panda, Super Mario, Bumblebee, and the thunderous Gorilla mascot! 
                Each mascot booking includes a trained animator to hype the crowd, coordinate photo moments, and keep energy levels soaring.
              </p>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between items-center text-white">
                  <span>Gorilla Mascot (Solo Appearance)</span>
                  <span className="font-bold text-[#D4AF37]">₦50,000</span>
                </div>
                <div className="flex justify-between items-center text-white">
                  <span>Full Mascot Troupe (3+ Characters)</span>
                  <span className="font-bold text-[#D4AF37]">Custom Quotation</span>
                </div>
                <div className="text-[11px] text-neutral-400 pt-1">
                  *Included at no additional fee in Packages 1, 2, 3, 4, and 5.
                </div>
              </div>

              <button
                onClick={() => handleBookItem('msc-gorilla')}
                className="w-full py-3 rounded-xl text-xs font-bold bg-[#D4AF37] hover:bg-[#F3E5AB] text-black transition-colors flex items-center justify-center gap-2 cursor-pointer font-bold shadow-lg shadow-[#D4AF37]/20"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Book Gorilla / Mascots</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#171A21] via-[#1F1C12] to-[#171A21] border border-[#D4AF37]/40 text-center space-y-4 shadow-2xl">
        <h3 className="text-2xl font-black text-white">
          Need a Custom Equipment &amp; Attire Rental Package?
        </h3>
        <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed font-light">
          We configure combination rentals tailored for your guest count, venue dimensions, and afterparty schedule in Warri and throughout Delta State.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setCurrentPage('booking')}
            className="px-6 py-3 rounded-xl text-xs font-bold bg-[#D4AF37] hover:bg-[#F3E5AB] text-black transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-[#D4AF37]/25"
          >
            <span>Request Rental Quotation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage('gallery')}
            className="px-6 py-3 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer border border-white/20"
          >
            View Real Media Gallery
          </button>
        </div>
      </div>
    </div>
  );
};
