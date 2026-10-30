import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Layers, 
  Users, 
  ShieldCheck, 
  Crown, 
  Sparkles, 
  Lightbulb, 
  Shirt, 
  Smile, 
  CalendarCheck, 
  Info,
  Check,
  Search
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { 
    services, 
    lightingPackages, 
    costumes, 
    mascots, 
    navigateToBookingWithPlan,
    setCurrentPage 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'staff' | 'bowls' | 'lighting' | 'costumes' | 'mascots'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Helper to add item directly into booking draft
  const handleBookSingleService = (serviceId: string, selectedOption?: string) => {
    navigateToBookingWithPlan({
      services: [
        {
          serviceId,
          quantity: 1,
          selectedOption
        }
      ]
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-xs font-semibold text-[#D4AF37] border border-[#D4AF37]/25">
          <Layers className="w-3.5 h-3.5" />
          <span>DKWEENS DELIGHTS ENTERPRISES Official Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Services, Equipment &amp; Rentals
        </h1>
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
          Browse verified hospitality personnel, signature VIP serving bowls, atmospheric lighting, performance costumes, and hype mascots based in Warri, Delta State.
        </p>
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'staff', label: 'Hospitality & Security Staff' },
            { id: 'bowls', label: 'Serving Bowls (Gold & Silver)' },
            { id: 'lighting', label: 'Lighting Packages' },
            { id: 'costumes', label: 'Costume Rentals' },
            { id: 'mascots', label: 'Hype Mascots' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20 font-bold'
                  : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#12141A] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* 1. HOSPITALITY & SECURITY STAFF */}
      {(activeTab === 'all' || activeTab === 'staff') && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="text-xl font-bold text-white">Event Staffing Personnel</h2>
            </div>
            <button
              onClick={() => setCurrentPage('gallery')}
              className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>See Staff Uniforms in Gallery</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.filter(s => s.category === 'staff').map(service => {
              const staffImg = service.id === 'srv-ushers' 
                ? '/assets/aistudio/5_ushers_76d2682c.jpeg' 
                : service.id === 'srv-champagne-girls' 
                ? '/assets/aistudio/white_champagne_gown_standing_506b0fbc.jpeg' 
                : null;

              return (
                <div 
                  key={service.id}
                  className="rounded-2xl bg-[#181B22] border border-white/10 hover:border-[#D4AF37]/40 transition-all flex flex-col justify-between overflow-hidden"
                >
                  {staffImg && (
                    <div className="relative h-48 overflow-hidden bg-black">
                      <img 
                        src={staffImg} 
                        alt={service.name} 
                        className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-2.5 right-2.5 bg-black/80 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#D4AF37] border border-[#D4AF37]/30">
                        Real Business Staff
                      </div>
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider">
                          Staff Service
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Available in Warri &amp; Delta
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{service.name}</h3>
                      <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                        {service.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-2xl font-black text-white">₦{service.unitPrice.toLocaleString()}</span>
                          <span className="text-xs text-neutral-400 font-normal"> / {service.unit}</span>
                        </div>
                        <span className="text-[10px] text-neutral-400">Fixed rate</span>
                      </div>
                      <button
                        onClick={() => handleBookSingleService(service.id)}
                        className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#F3E5AB] hover:text-black border border-[#D4AF37]/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <CalendarCheck className="w-4 h-4" />
                        <span>Book {service.name.split(' ')[0]}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 2. VIP SERVING BOWLS */}
      {(activeTab === 'all' || activeTab === 'bowls') && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="text-xl font-bold text-white">Gold-Coloured Serving Bowls with Chilled Drinks &amp; Silver Bowls</h2>
            </div>
            <button
              onClick={() => setCurrentPage('rentals')}
              className="text-xs text-[#D4AF37] hover:underline cursor-pointer"
            >
              Go to Full Rentals Page →
            </button>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#171A21] via-[#1A1813] to-[#12141A] border border-[#D4AF37]/40 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl">
            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                Signature Presentation Hardware
              </span>
              <h3 className="text-2xl font-bold text-white">Gold-Coloured Serving Bowls with Chilled Drinks</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Pedestal gold-coloured serving bowls filled with ice and assorted beverages for elegant table presentations and VIP hospitality. Designed with generous ice reservoirs and sturdy decorative handles for synchronized usherette parades, VIP table service, and celebrant table delivery.
              </p>
              <div className="p-3 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-xs text-[#F3E5AB] space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Verified Service Rates</span>
                </div>
                <p className="text-[11px] text-neutral-300">
                  Silver Serving Bowls — ₦2,000 each. Gold-Coloured Serving Bowls with Chilled Drinks — ₦2,500 each.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Silver Bowl */}
              <div className="p-5 rounded-2xl bg-black/70 border border-slate-400/30 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                    <img 
                      src="/assets/aistudio/silver_bowl_3f2e880f.jpeg" 
                      alt="Silver Serving Bowls" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Silver Edition</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  </div>
                  <div className="text-2xl font-black text-white mt-1">₦2,000 <span className="text-xs font-normal text-neutral-400">each</span></div>
                  <p className="text-[11px] text-neutral-400 mt-1">Polished chrome finish for crisp, reflective VIP table service.</p>
                </div>
                <button
                  onClick={() => handleBookSingleService('srv-serving-bowls', 'Silver Serving Bowls')}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white text-white hover:text-black transition-colors cursor-pointer mt-2"
                >
                  Select Silver Bowl (₦2,000)
                </button>
              </div>

              {/* Gold Bowl */}
              <div className="p-5 rounded-2xl bg-black/70 border border-[#D4AF37]/50 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                    <video 
                      src="/assets/aistudio/gold_bowls_2428a428.mp4" 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#D4AF37]">Gold Edition</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                  </div>
                  <div className="text-2xl font-black text-[#D4AF37] mt-1">₦2,500 <span className="text-xs font-normal text-neutral-400">each</span></div>
                  <p className="text-[11px] text-neutral-400 mt-1">Pedestal gold-coloured serving bowls filled with ice and assorted beverages for elegant table presentations.</p>
                </div>
                <button
                  onClick={() => handleBookSingleService('srv-serving-bowls', 'Gold-Coloured Serving Bowls with Chilled Drinks')}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#D4AF37] hover:bg-[#F3E5AB] text-black transition-colors cursor-pointer mt-2"
                >
                  Select Gold Bowl (₦2,500)
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. EVENT LIGHTING PACKAGES */}
      {(activeTab === 'all' || activeTab === 'lighting') && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="text-xl font-bold text-white">Configurable Event Lighting Catalog</h2>
            </div>
            <span className="text-xs text-neutral-400 hidden sm:inline">
              Lighting packages configured by administrator
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {lightingPackages.map(light => (
              <div 
                key={light.id}
                className="rounded-2xl bg-[#181B22] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#D4AF37]/40 transition-all"
              >
                <div className="relative h-44 overflow-hidden">
                  <img 
                    src={light.imageUrl} 
                    alt={light.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181B22] via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-white bg-black/70 px-2.5 py-1 rounded-md backdrop-blur-sm">
                      {light.price ? `₦${light.price.toLocaleString()}` : 'Custom Quotation'}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-white text-base mb-1">{light.name}</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-3 line-clamp-2">
                      {light.description}
                    </p>
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wider">
                        Includes:
                      </div>
                      <ul className="space-y-1">
                        {light.inclusions.map((inc, i) => (
                          <li key={i} className="text-[11px] text-neutral-300 flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-[#D4AF37] shrink-0" />
                            <span className="truncate">{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBookSingleService(light.id)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-[#D4AF37] text-white hover:text-black border border-white/10 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>{light.price ? 'Add Lighting Rig' : 'Request Custom Quote'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. COSTUMES AND UNIFORMS */}
      {(activeTab === 'all' || activeTab === 'costumes') && (
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Shirt className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="text-xl font-bold text-white">Costume &amp; Uniform Rentals</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {costumes.map(cst => (
              <div 
                key={cst.id}
                className="rounded-2xl bg-[#181B22] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#D4AF37]/40 transition-all"
              >
                <div className="relative h-44 overflow-hidden">
                  <img 
                    src={cst.imageUrl} 
                    alt={cst.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181B22] via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-xs font-bold text-white bg-black/70 px-2.5 py-1 rounded-md backdrop-blur-sm">
                      {cst.rentalPrice ? `₦${cst.rentalPrice.toLocaleString()} / day` : 'Custom Quote'}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-white text-base mb-1">{cst.name}</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-3 line-clamp-2">
                      {cst.description}
                    </p>
                    <div className="text-[11px] text-neutral-400 bg-black/40 p-2.5 rounded-lg border border-white/5 space-y-1">
                      <div><strong className="text-white">Duration:</strong> {cst.rentalDuration}</div>
                      <div><strong className="text-white">Terms:</strong> {cst.conditions}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBookSingleService(cst.id)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-[#D4AF37] text-white hover:text-black border border-white/10 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>{cst.rentalPrice ? 'Reserve Attire' : 'Inquire for Custom Quote'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. MASCOT RENTALS */}
      {(activeTab === 'all' || activeTab === 'mascots') && (
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Smile className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="text-xl font-bold text-white">Mascot Rentals Catalog</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mascots.map(msc => (
              <div 
                key={msc.id}
                className="rounded-2xl bg-[#181B22] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#D4AF37]/40 transition-all"
              >
                <div className="relative h-44 overflow-hidden">
                  <img 
                    src={msc.imageUrl} 
                    alt={msc.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181B22] via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-xs font-bold text-white bg-black/70 px-2.5 py-1 rounded-md backdrop-blur-sm">
                      {msc.rentalPrice ? `₦${msc.rentalPrice.toLocaleString()}` : 'Quotation Required'}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-white text-base mb-1">{msc.name}</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-3 line-clamp-2">
                      {msc.description}
                    </p>
                    <div className="text-[11px] text-neutral-400">
                      High-impact animated performer costume with trained operator brief.
                    </div>
                  </div>

                  <button
                    onClick={() => handleBookSingleService(msc.id)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-[#D4AF37] text-white hover:text-black border border-white/10 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>{msc.rentalPrice ? 'Book Mascot' : 'Request Mascot Quote'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
